import { Avatar, Box, Button, Container, Text, Image, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, useToast, Card, CardHeader, HStack, Heading, CardBody, FormControl, Stack, FormLabel, Input, Center } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useReadContractHook } from '@/hooks/useReadContract'
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { useRouter } from 'next/router';
import { ArrowBackIcon } from '@chakra-ui/icons';

export default function TokenDetails() {
    const toast = useToast();
    const { address } = useAccount()
    const router = useRouter()
    const { data } = useReadContractHook("addressToToken", [address])

    console.log("data", data);

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

    const addToWallet = async () => {
        if (window && window.ethereum) {
            try {
                // wasAdded is a boolean. Like any RPC method, an error may be thrown.
                const wasAdded = await window.ethereum.request({
                    method: 'wallet_watchAsset',
                    params: {
                        type: 'ERC20', // Initially only supports ERC20, but eventually more!
                        options: {
                            address: data?.tokenAddress, // The address that the token is at.
                            symbol: data?.symbol, // A ticker symbol or shorthand, up to 5 chars.
                            decimals: data?.decimals, // The number of decimals in the token
                            image: data?.image, // A string url of the token logo
                        },
                    },
                });

                if (wasAdded) {
                    console.log('Thanks for your interest!');
                } else {
                    console.log('Your loss!');
                }
            } catch (error) {
                console.log(error);
            }
        }
    }


    return (

        <Box pt={10} px={10}>
            {data ? (

                <Container maxW={"3xl"}>
                    <Card>
                        <CardHeader>
                            <HStack justifyContent="space-between">
                                <HStack>
                                    <Button onClick={() => router.back()}>
                                        <ArrowBackIcon />
                                    </Button>
                                    <Heading size='md'>
                                        {data.name}
                                    </Heading>
                                </HStack>

                                <HStack justifyContent="center">
                                    <Box>
                                        <HStack justifyContent="center">
                                            <Image
                                                borderRadius='full'
                                                boxSize='100px'
                                                src={data?.image}
                                                alt='token-img'
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
                                            <FormLabel>Token Symbol</FormLabel>
                                            <Input type='text' readOnly placeholder='ATK' value={data?.symbol} />
                                        </Box>
                                        <Box>
                                            <FormLabel>Token Address</FormLabel>
                                            <Input type='text' readOnly placeholder='ATK' value={data?.tokenAddress} />
                                        </Box>
                                        <HStack>
                                            <Box>
                                                <FormLabel>Decimals</FormLabel>
                                                <Input type='text' readOnly placeholder='18' value={data?.decimals} />
                                            </Box>
                                            <Box>
                                                <FormLabel>Total Supply</FormLabel>
                                                <Input type='text' readOnly placeholder='ATK' value={data?.totalSupply} />
                                            </Box>
                                            <Box>
                                                <FormLabel>Token Fee (in ETH)</FormLabel>
                                                <Input type='text' readOnly placeholder='ATK' value={parseInt(data?.fee) / 1e18} />
                                            </Box>

                                        </HStack>


                                        <Box>
                                            <Center>
                                                <Button colorScheme={"green"} bg={"green.400"} rounded={"full"} px={4} onClick={() => addToWallet()}>
                                                    Add to Wallet
                                                </Button>
                                            </Center>
                                        </Box>
                                    </Stack>
                                </FormControl>
                            </Box>
                        </CardBody>

                    </Card>
                </Container>
            ) : null}

        </Box>
    )
}
