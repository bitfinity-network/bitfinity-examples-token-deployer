import { Box, Button, HStack, Image, Text } from "@chakra-ui/react"
import React from "react"
import {
    useAccount,
    useConnect,
    useDisconnect,
    useEnsAvatar,
    useEnsName,
} from "wagmi"

export function ConnectWalletButton() {
    const { address, isConnected } = useAccount()
    const { connect, connectors, error, isLoading, pendingConnector } =
        useConnect()
    const { disconnect } = useDisconnect()
    return (
        <Box>
            {isConnected ? (
                <Button onClick={() => disconnect()}>
                    <HStack>
                        <Image src="metamask.svg" alt="metamask icon" />
                        <Text isTruncated w="100px">
                            {address}
                        </Text>
                    </HStack>
                </Button>
            ) : (
                connectors.map((connector) => (
                    <Button
                        disabled={!connector.ready}
                        key={connector.id}
                        onClick={() => connect({ connector })}
                    >
                        Connect to {connector.name}
                        {!connector.ready && " (unsupported)"}
                        {isLoading &&
                            connector.id === pendingConnector?.id &&
                            " (connecting)"}
                    </Button>
                ))
            )}
        </Box>
    )
}
