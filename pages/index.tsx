import Head from "next/head"
import { Box, Heading, Container, Text, Button, Stack } from "@chakra-ui/react"
import Link from "next/link"

export default function CallToActionWithAnnotation() {
    return (
        <>
            <Box pb={10}>
                <Container maxW={"3xl"}>
                    <Stack
                        as={Box}
                        textAlign={"center"}
                        spacing={{ base: 8, md: 14 }}
                        py={{ base: 20 }}
                    >
                        <Heading
                            fontWeight={600}
                            fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
                            lineHeight={"110%"}
                        >
                            <Text as={"span"} color={"green.400"}>
                                Deploy ERC20 Token
                            </Text>
                        </Heading>
                        <Text color={"gray.500"}>
                            This project is to illustrate how to deploy an ERC20
                            Token on the evmc and uses Bitfinity Testnet Network
                        </Text>
                        <Stack
                            direction={"row"}
                            spacing={3}
                            align={"center"}
                            alignSelf={"center"}
                            position={"relative"}
                        >
                            <Link href="/createToken">
                                <Button
                                    colorScheme={"green"}
                                    bg={"green.400"}
                                    rounded={"full"}
                                    px={6}
                                    _hover={{
                                        bg: "green.500",
                                    }}
                                >
                                    Create Token
                                </Button>
                            </Link>
                            <Link href="/tokens">
                                <Button
                                    rounded={"full"}
                                    px={6}
                                    _hover={{
                                        bg: "blue.500",
                                    }}
                                >
                                    View All Tokens
                                </Button>
                            </Link>
                        </Stack>
                    </Stack>
                </Container>
            </Box>
        </>
    )
}
