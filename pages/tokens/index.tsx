import {
    Avatar,
    Box,
    Button,
    Container,
    Text,
    Image,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Tfoot,
    Th,
    Thead,
    Tr,
    useToast,
} from "@chakra-ui/react"
import React, { useState } from "react"
import { headers } from "../../utils/tableHeaders"
import { useReadContractHook } from "@/hooks/useReadContract"
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi"
import { contractAddress } from "@/utils/constants"
import TokenABI from "../../utils/abi/tokenABI.json"
import { parseEther } from "ethers/lib/utils.js"
import { Token } from "@/types"
import { useRouter } from "next/router"

export default function Tokens() {
    const toast = useToast()
    const router = useRouter()
    const { address } = useAccount()
    const { data } = useReadContractHook("getAllTokens", [])
    const tokens: Token[] = data as Token[]
    const [seleckedId, setSelectedId] = useState(0)
    const [fee, setFee] = useState("0.0001")
    console.log("data", data)

    const copyAddress = (address: string) => {
        navigator.clipboard.writeText(address)
        toast({
            title: `Copied`,
            description: address,
            status: "success",
            duration: 9000,
            isClosable: true,
        })
    }

    const { config, error } = usePrepareContractWrite({
        address: contractAddress,
        abi: TokenABI,
        functionName: "mintToAddress",
        args: [seleckedId, address, 1000],
        overrides: {
            from: address,
            value: parseEther(fee),
        },
    })
    console.log("config", config)
    const { isLoading, writeAsync: mintToAddress } = useContractWrite(config)

    const mintToken = async (key: number, fee: any) => {
        if (address && mintToAddress) {
            try {
                setSelectedId(key)
                setFee(fee.toString())
                const result = await mintToAddress()
                toast({
                    title: `Token mint successful`,
                    description: ``,
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                })
            } catch (error) {
                console.log(error)
            }
        }
    }
    return (
        <Box pt={10} px={10}>
            <TableContainer>
                <Table variant="striped" colorScheme="teal">
                    <TableCaption>All Tokens Deployed</TableCaption>
                    <Thead>
                        <Tr>
                            {headers.map((item) => {
                                return (
                                    <Th
                                        key={item.title}
                                        isNumeric={item.isNumeric}
                                    >
                                        {item.title}
                                    </Th>
                                )
                            })}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {tokens &&
                            tokens?.map((item, key) => {
                                return (
                                    <Tr key={item.tokenAddress}>
                                        <Td>{item.name}</Td>
                                        <Td>{item.symbol}</Td>
                                        <Td isNumeric>{item.decimals}</Td>
                                        <Td
                                            cursor="pointer"
                                            onClick={() => {
                                                copyAddress(item.tokenAddress)
                                            }}
                                        >
                                            <Text isTruncated w="100px">
                                                {item.tokenAddress}
                                            </Text>
                                        </Td>
                                        <Td isNumeric>
                                            {parseInt(item.totalSupply)}
                                        </Td>
                                        <Td
                                            cursor="pointer"
                                            onClick={() => {
                                                copyAddress(item.owner)
                                            }}
                                        >
                                            <Text isTruncated w="100px">
                                                {item.owner}
                                            </Text>
                                        </Td>
                                        <Td isNumeric>
                                            {parseInt(item.fee) / 1e18}
                                        </Td>
                                        <Td>
                                            <Avatar
                                                size="sm"
                                                name={item.name}
                                                src={item.image}
                                            />
                                        </Td>
                                        <Td>
                                            <Button onClick={() => router.push({
                                                pathname: `/tokendetails`,
                                                query: { id: key }
                                            })}>View</Button>
                                        </Td>
                                    </Tr>
                                )
                            })}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    )
}
