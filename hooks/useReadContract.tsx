import { contractAddress } from "@/utils/constants"
import { useContractRead } from "wagmi"
import TokenABI from "../utils/abi/tokenABI.json"

export const useReadContractHook = (functionName: string, args: any[]) => {
    const { data, ...rest } = useContractRead({
        address: contractAddress,
        abi: TokenABI,
        functionName,
        args,
        watch: true,
    })
    return { data, ...rest }
}
