import { NFT } from "@/types"
import {
    Box,
    HStack,
    Text,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    ModalFooter,
    Button,
} from "@chakra-ui/react"
import React from "react"
import { useAccount } from "wagmi"
import { ConnectWalletButton } from "../ConnectWallet"
import { contractAddress } from "@/utils/constants"

interface Props {
    selectedNFT: NFT
    isOpen: boolean
    onClose: () => void
    mintingError?: string
    isLoading: boolean
    mintNFT: () => void
    success?: boolean
    tokenId?: number
}

export function NFTModal({
    isLoading,
    selectedNFT,
    isOpen,
    mintingError,
    onClose,
    mintNFT,
    success,
    tokenId,
}: Props) {
    const { isConnected } = useAccount()

    return (
        <Modal isCentered isOpen={isOpen} size="3xl" onClose={onClose}>
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
            <ModalContent>
                <ModalHeader>{selectedNFT.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <HStack alignItems="center" gap={5}>
                        <Box
                            width={{ base: "100%" }}
                            zIndex="2"
                            marginLeft={{ base: "0", sm: "5%" }}
                            marginTop="5%"
                        >
                            <Image
                                borderRadius="lg"
                                src={"/assets/" + selectedNFT.imagePath}
                                alt="some good alt text"
                                objectFit="contain"
                            />
                        </Box>
                        <Box
                            zIndex="1"
                            width="100%"
                            height="100%"
                            overflow="scroll"
                        >
                            <Text as="p" marginTop="2" fontSize="lg">
                                {selectedNFT.description}
                            </Text>

                            {success && (
                                <Box>
                                    <Box pt={5}>
                                        <Text
                                            color="rgba(255, 255, 255, 0.6)"
                                            fontSize="14px"
                                        >
                                            Token ID: {tokenId}
                                        </Text>
                                    </Box>
                                    <Box cursor={"pointer"} pt={2}>
                                        <Text
                                            color="rgba(255, 255, 255, 0.6)"
                                            fontSize="12px"
                                        >
                                            {contractAddress}
                                        </Text>
                                    </Box>
                                </Box>
                            )}

                            {mintingError && (
                                <Text
                                    color="rgba(255, 255, 255, 0.6)"
                                    fontSize="11px"
                                >
                                    {mintingError}
                                </Text>
                            )}
                            {!success && (
                                <Box pt={5}>
                                    {isConnected ? (
                                        <Button
                                            isLoading={isLoading}
                                            loadingText="Minting NFT"
                                            onClick={() => mintNFT()}
                                        >
                                            Mint Ryno NFT
                                        </Button>
                                    ) : (
                                        <ConnectWalletButton />
                                    )}
                                </Box>
                            )}
                        </Box>
                    </HStack>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
