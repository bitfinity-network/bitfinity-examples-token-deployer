import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"
import theme from "@/components/theme"
import { Nav } from "@/components/ui"
import { WagmiConfig, createClient, configureChains } from "wagmi"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"

import { publicProvider } from "wagmi/providers/public"
import { BITFINITY_CHAIN } from "@/utils/constants"
import { useEffect, useState } from "react"

export default function App({ Component, pageProps }: AppProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const { chains, provider, webSocketProvider } = configureChains(
        [BITFINITY_CHAIN],
        [publicProvider()]
    )
    const client = createClient({
        autoConnect: true,
        connectors: [new MetaMaskConnector({ chains })],
        provider,
        webSocketProvider,
    })
    return (
        <div>
            {mounted && (
                <WagmiConfig client={client}>
                    <ChakraProvider theme={theme}>
                        <Nav />
                        <Component {...pageProps} />
                    </ChakraProvider>
                </WagmiConfig>
            )}
        </div>
    )
}
