"use client"
import * as React from "react";
import { toast } from "@yaris/components/ui/toast";
import * as utils from '@yaris/lib/utils'
import { ethers } from "ethers";
import * as types from "@yaris/types/types";
import { useRouter } from 'next/navigation'
import axios from "axios";
import { ContractTransactionResponse } from "ethers";
interface TransactionProviderProps {
    children: React.ReactNode
};
export const TransactionContext = React.createContext<types.TransactionContextInterface>({
    currentAccount: null, connectWallet: () => { },
    isLoading: false,
    isLoadingTransaction: false,
    approveToken: async () => false,
    handleChange: async () => { },
    burnToken: async () => false,
    formData: {
        amount: undefined,
        taproot_address: undefined,
        ordinal_inscription_id: undefined
    },
})

export default function TransactionProvider({ children }: TransactionProviderProps) {
    const [currentAccount, setCurrentAccount] = React.useState<null | string>(null)
    const [isLoading, setisLoading] = React.useState<boolean>(false)
    const [isLoadingTransaction, setIsLoadingTransaction] = React.useState<boolean>(false)

    const [formData, setFormData] = React.useState<types.FormDataProps>({
        taproot_address: undefined,
        amount: undefined,
        ordinal_inscription_id: undefined,
    })
    const checkChainIdAndMetamask = async (): Promise<boolean> => {
        const metamask = window.ethereum
        if (!metamask) {
            toast({
                title: `Metamask not found`,
                message: `Please install Metamask`,
                type: "error"
            })
            return false
        }
        const chainId = await metamask.request({ method: 'eth_chainId' });
        if (chainId !== "0x1") {
            // Request to switch the chainId
            await metamask.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x1" }],
            })
            return true
        }
        return true
    }
    const router = useRouter()
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'amount') {
            setFormData(prevState => ({ ...prevState, [e.target.name]: e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1') }))
        } else if (e.target.name === 'tape_route_address') {
            const bitcoinAddressRegex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/;
            if (bitcoinAddressRegex.test(e.target.value)) {
                setFormData(prevState => ({
                    ...prevState,
                    [e.target.name]: e.target.value
                }));
            } else {
                toast({
                    title: `Invalid Bitcoin address`,
                    message: `Enter valid Bitcoin addres`,
                    type: "error"
                })
            }
        } else {
            setFormData(prevState => ({
                ...prevState,
                [e.target.name]: e.target.value
            }));
        }
    }



    const connectWallet = async () => {
        try {
            const metamask = window.ethereum
            if (!metamask) {
                toast({
                    title: `Metamask not found`,
                    message: `Please install it`,
                    type: "error"
                })
                return false
            }
            setisLoading(true)
            await checkChainIdAndMetamask()
            const accounts = await metamask.request({ method: 'eth_requestAccounts' }) as string[]
            setCurrentAccount(accounts[0])
            // const message=utils.createSiweMessage(currentAccount!,"Hello")
            setisLoading(false)
            return true
        } catch (error) {
            setisLoading(false)
            toast({
                title: `Error connecting wallet`,
                message: `Please try again later`,
                type: "error"
            })
            return
        }
    }
    const checkIfWalletIsConnected = async () => {
        const metamask = window.ethereum
        if (!metamask) {
            return false
        }
        const accounts = await metamask.request({ method: "eth_accounts" }) as string[]
        if (accounts.length) {
            await checkChainIdAndMetamask()
            setCurrentAccount(accounts[0])
            return true
        }
        connectWallet()
        return false
    }


    React.useEffect(() => {
        checkIfWalletIsConnected()
    }, [])



    const approveToken = async (e: React.FormEvent<HTMLFormElement>): Promise<boolean> => {
        try {
            e.preventDefault()
            const isConnected = await checkIfWalletIsConnected()
            if (!isConnected) {
                await connectWallet()

            }
            const yariContract = await utils.getContract({ name: 'yari' })
            const { amount } = formData

            const parsedAmount = ethers.parseEther(amount!)
            if (yariContract) {
                setIsLoadingTransaction(true)
                const approveTonen: ContractTransactionResponse = await yariContract.approve(utils.burnerAddress, parsedAmount)
                await approveTonen.wait(2)
                localStorage.setItem('pendingTransaction', JSON.stringify({ amount }))
                setIsLoadingTransaction(false)
                router.push('/burn')
                return true
            }
            setIsLoadingTransaction(false)
            return false
        } catch (error) {
            setIsLoadingTransaction(false)
            console.log(error)
            toast({
                title: `Error sending transaction`,
                message: `Please try again later`,
                type: "error"
            })
            return false
        }

    }
    const burnToken = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            const metamask = window.ethereum
            if (!metamask) {
                toast({
                    title: `Metamask not found`,
                    message: `Please install Metamask`,
                    type: "error"
                })
                return false
            }
            const isConnected = await checkIfWalletIsConnected()
            if (!isConnected) {
                await connectWallet()

            }

            const { taproot_address, amount, ordinal_inscription_id } = formData
            const data = JSON.parse(localStorage.getItem('pendingTransaction') as string)
            // as Transaction
            const burner = await utils.getContract({ name: 'burner' })
            const parsedAmount = ethers.parseEther(amount || data.amount)
            if (burner) {
                setIsLoadingTransaction(true)
                const tx: ContractTransactionResponse = await burner.burn(parsedAmount, utils.yariAddress)
                await tx.wait(2)
                await axios.post('/api/transactions', {
                    tx_hash: tx.hash,
                    amount: amount,
                    taproot_address: taproot_address,
                    from_address: currentAccount,
                    ordinal_inscription_id: ordinal_inscription_id,
                }, {
                    headers: {
                        Authorization: process.env.NEXT_PUBLIC_SECRET_HEADER
                    }
                })
                toast({
                    title: `Burn success`,
                    message: `Successfully burned YARI`,
                    type: "success"
                })
                setIsLoadingTransaction(false)
                localStorage.removeItem('transaction')
                router.refresh()
                return true
            }
            setIsLoadingTransaction(false)
            return false
        } catch (error: any) {
            console.log(error)
            setIsLoadingTransaction(false)
            toast({
                title: `Error sending transaction`,
                message: `Try afain later`,
                type: "error"
            })
            localStorage.removeItem('transaction')
            return false
        }

    }
    return (
        <TransactionContext.Provider value={
            { currentAccount, connectWallet, approveToken, burnToken, handleChange, formData, isLoading, isLoadingTransaction }
        }>
            {children}
        </TransactionContext.Provider>
    );
};



