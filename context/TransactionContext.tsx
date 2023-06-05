"use client"
import { useState, useEffect, createContext, ReactNode } from "react";
import { toast } from "@yaris/components/ui/toast";

import { MetaMaskInpageProvider } from "@metamask/providers";
import { yarisAbi, yariAddress, burnerAddress, burnerApi } from '@yaris/lib/utils'
import { ethers } from "ethers";
import { type Contract } from "ethers";
interface TransactionProviderProps {
    children: ReactNode
};
interface formDataProps {
    tapeRouteAddress: string | undefined,
    amount: number | undefined
}
interface TransactionContext {
    currentAccount: string | null
    connectWallet: () => void
    approveToken: () => Promise<string | undefined>
    burnToken: () => Promise<string | undefined>
    isLoading: boolean,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    formData: formDataProps

}
export const TransactionContext = createContext<TransactionContext>({
    currentAccount: null, connectWallet: () => { },
    isLoading: false,
    approveToken: async () => undefined,
    handleChange: async () => { },
    burnToken: async () => undefined,
    formData: {
        amount: undefined,
        tapeRouteAddress: undefined
    }
})

export default function TransactionProvider({ children }: TransactionProviderProps) {
    const [currentAccount, setCurrentAccount] = useState<null | string>(null)
    const [isLoading, setisLoading] = useState<boolean>(false)
    const [formData, setFormData] = useState<formDataProps>({
        tapeRouteAddress: undefined,
        amount: undefined,
    })
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prevState => ({ ...prevState, [e.target.name]: e.target.value }))
    }

    const connectWallet = async () => {
        try {
            setisLoading(true)
            const metamask = window.ethereum
            if (!metamask) {
                return toast({
                    title: `Metamask not found`,
                    message: `Please install Metamask`,
                    type: "error"
                })

            }
            const accounts = await metamask.request({ method: 'eth_requestAccounts' }) as string[]
            setCurrentAccount(accounts[0])
            setisLoading(false)
        } catch (error) {
            setisLoading(false)
            return toast({
                title: `Error connecting wallet`,
                message: `Please try again later`,
                type: "error"
            })
        }
    }

    const checkIfWalletIsConnected = async () => {

        try {
            const metamask = window.ethereum
            if (!metamask) {
                return toast({
                    title: `Wallet not connected`,
                    message: `Please connect your wallet`,
                    type: "error"
                })
            }
            const accounts = await metamask.request({ method: "eth_accounts" }) as string[]
            if (accounts.length) {
                setCurrentAccount(accounts[0])
            }
        } catch (error) {
            return toast({
                title: `Metamask not found`,
                message: `Please install Metamask`,
                type: "error"
            })
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected()
    }, [])
    interface getContractProps {
        name: "yari" | "burner"
    }
    const getContract = async ({ name }: getContractProps): Promise<Contract | undefined> => {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        console.log(signer.address)
        if (name === 'yari') {
            const yariContract = new ethers.Contract(yariAddress, yarisAbi, signer)
            return yariContract
        } else if (name === 'burner') {
            const burnerContract = new ethers.Contract(yariAddress, yarisAbi, signer)
            return burnerContract
        }
        return undefined

    }
    const approveToken = async (): Promise<string | undefined> => {
        try {
            const metamask = window.ethereum
            if (!metamask) toast({
                title: `Metamask not found`,
                message: `Please install Metamask`,
                type: "default"
            })
            const { amount, tapeRouteAddress } = formData
            const yariContract = await getContract({ name: 'yari' })
            const parsedAmount = ethers.parseEther("0.6")
            if (yariContract) {
                const balanceofZeroAddress = await yariContract.balanceOf("0xf1FCeD5B0475a935b49B95786aDBDA2d40794D2d")
                console.log(balanceofZeroAddress)
                const approveTx = await yariContract.approve(burnerAddress, parsedAmount) as string
                return approveTx
            }

        } catch (error) {
            toast({
                title: `Error sending transaction`,
                message: `Please try again later`,
                type: "error"
            })
            return undefined
        }

    }

    // const transaction = await ethers.getCon
    const burnToken = async () => {
        try {
            const metamask = window.ethereum
            if (!metamask) toast({
                title: `Metamask not found`,
                message: `Please install Metamask`,
                type: "default"
            })

            const { amount, tapeRouteAddress } = formData
            const burner = await getContract({ name: 'burner' })
            const parsedAmount = ethers.parseEther(amount?.toString()!)
            if (burner) {
                const burnTx = await burner.transferFrom(currentAccount, burnerApi, parsedAmount) as string

                return burnTx
            }

            return undefined
        } catch (error) {

             toast({
                title: `Error sending transaction`,
                message: `Please try again later`,
                type: "error"
            })
            return undefined
        }

    }
    return (
        <TransactionContext.Provider value={
            { currentAccount, connectWallet, approveToken, burnToken, handleChange, formData, isLoading }
        }>
            {children}
        </TransactionContext.Provider>
    );
};



