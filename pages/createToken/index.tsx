import { contractAddress } from "@/utils/constants"
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Center,
    Checkbox,
    Container,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Heading,
    Image,
    Input,
    Select,
    Stack,
    VStack,
    useToast,
} from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi"
import { ArrowBackIcon } from "@chakra-ui/icons"
import TokenABI from "../../utils/abi/tokenABI.json"
import { useRouter } from "next/router"
import { parseEther } from "ethers/lib/utils.js"

const avatarStyles = [
    "adventurer",
    "adventurer-neutral",
    "avataaars",
    "identicon",
    "icons",
    "initials",
    "thumbs",
]

// `https://avatars.dicebear.com/api/initials/${symbol}.svg`;
export default function Token() {
    const router = useRouter()
    const { address } = useAccount()
    const [generateImage, setGenerateImage] = useState(true)
    const [avatarStyle, setAvatarStyle] = useState("identicon")
    const [decimals, setDecimals] = useState(18)
    const [totalSupply, setTotalSupply] = useState(1000000)
    const [name, setName] = useState("")
    const [symbol, setSymbol] = useState("")
    const [image, setImage] = useState<string>("")
    const [fee, setFee] = useState(0.0001)
    const toast = useToast()

    const { config, error } = usePrepareContractWrite({
        address: contractAddress,
        abi: TokenABI,
        functionName: "createToken",
        args: [
            name,
            symbol,
            decimals,
            totalSupply,
            image,
            parseEther(fee.toString()),
        ],
    })
    console.log("config", config)
    const { isLoading, writeAsync: createToken } = useContractWrite(config)

    useEffect(() => {
        if (generateImage) {
            setImage(
                `https://api.dicebear.com/6.x/${avatarStyle}/svg?seed=${name}`
            )
        }
    }, [name, avatarStyle, generateImage])

    const deployToken = async () => {
        if (address && createToken) {
            try {
                const result = await createToken()
                toast({
                    title: `${name} successfully created`,
                    description: `You have successfully created a token`,
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                })
                router.push({
                    pathname: "/tokens",
                })
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <Box pt={10}>
            <Container maxW={"3xl"}>
                <Card>
                    <CardHeader>
                        <HStack justifyContent="space-between">
                            <HStack>
                                <Button onClick={() => router.back()}>
                                    <ArrowBackIcon />
                                </Button>
                                <Heading size="md">Create Token</Heading>
                            </HStack>

                            <HStack justifyContent="center">
                                <Box>
                                    <HStack justifyContent="center">
                                        <Image
                                            borderRadius="full"
                                            boxSize="100px"
                                            src={image}
                                            alt="token-img"
                                        />
                                    </HStack>
                                </Box>
                            </HStack>
                        </HStack>
                    </CardHeader>
                    <CardBody>
                        <Box>
                            <FormControl>
                                <Stack gap={4} w="full">
                                    <Box>
                                        <FormLabel>Token Name</FormLabel>
                                        <Input
                                            type="text"
                                            placeholder="Awesome Token"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                        />
                                    </Box>
                                    <Box>
                                        <FormLabel>Token Symbol</FormLabel>
                                        <Input
                                            type="text"
                                            placeholder="ATK"
                                            value={symbol}
                                            onChange={(e) =>
                                                setSymbol(e.target.value)
                                            }
                                        />
                                    </Box>
                                    <HStack>
                                        <Box>
                                            <FormLabel>Decimals</FormLabel>
                                            <Input
                                                type="text"
                                                placeholder="18"
                                                value={decimals}
                                                onChange={(e) =>
                                                    setSymbol(e.target.value)
                                                }
                                            />
                                        </Box>
                                        <Box>
                                            <FormLabel>Total Supply</FormLabel>
                                            <Input
                                                type="text"
                                                placeholder="ATK"
                                                value={totalSupply}
                                                onChange={(e) =>
                                                    setTotalSupply(
                                                        Number(e.target.value)
                                                    )
                                                }
                                            />
                                        </Box>
                                        <Box>
                                            <FormLabel>
                                                Token Fee (in ETH)
                                            </FormLabel>
                                            <Input
                                                type="text"
                                                placeholder="ATK"
                                                value={fee}
                                                onChange={(e) =>
                                                    setFee(
                                                        Number(e.target.value)
                                                    )
                                                }
                                            />
                                        </Box>
                                    </HStack>
                                    {!generateImage ? (
                                        <Box pt={8}>
                                            <FormLabel>
                                                Token Image Url
                                            </FormLabel>
                                            <Input
                                                type="text"
                                                onChange={(e) =>
                                                    setImage(e.target.value)
                                                }
                                            />
                                            <FormHelperText></FormHelperText>
                                        </Box>
                                    ) : null}

                                    {generateImage ? (
                                        <Box pt={5}>
                                            <FormLabel>Image Type</FormLabel>
                                            <Select
                                                variant="outline"
                                                value={avatarStyle}
                                                onChange={(e) =>
                                                    setAvatarStyle(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                {avatarStyles.map((item) => {
                                                    return (
                                                        <option
                                                            key={item}
                                                            value={item}
                                                        >
                                                            {item}
                                                        </option>
                                                    )
                                                })}
                                            </Select>
                                        </Box>
                                    ) : null}
                                    <Box>
                                        <Checkbox
                                            isChecked={generateImage}
                                            onChange={() =>
                                                setGenerateImage(!generateImage)
                                            }
                                        >
                                            Generate Token Image
                                        </Checkbox>
                                    </Box>
                                    <Box>
                                        <Center>
                                            <Button
                                                isLoading={isLoading}
                                                colorScheme={"green"}
                                                bg={"green.400"}
                                                rounded={"full"}
                                                px={4}
                                                onClick={() => deployToken()}
                                            >
                                                Deploy Token
                                            </Button>
                                        </Center>
                                    </Box>
                                </Stack>
                            </FormControl>
                        </Box>
                    </CardBody>
                </Card>
            </Container>
        </Box>
    )
}
