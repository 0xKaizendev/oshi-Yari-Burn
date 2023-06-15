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
    isLoadingBurn: false,
    isLoadingApprove: false,
    isPendingTransaction: false,
    approveToken: async () => false,
    handleChange: async () => { },
    burnToken: async () => false,
    formData: {
        amount: undefined,
        tape_route_address: undefined,
        ordinal_inscription_id: undefined
    },
})

export default function TransactionProvider({ children }: TransactionProviderProps) {
    const [currentAccount, setCurrentAccount] = React.useState<null | string>(null)
    const [isLoading, setisLoading] = React.useState<boolean>(false)
    const [isLoadingApprove, setisLoadingApprove] = React.useState<boolean>(false)
    const [isLoadingBurn, setisLoadingBurn] = React.useState<boolean>(false)
    const [isPendingTransaction, setIsPendingTransaction] = React.useState<boolean>(false)
    const [formData, setFormData] = React.useState<types.FormDataProps>({
        tape_route_address: undefined,
        amount: undefined,
        ordinal_inscription_id: undefined,
    })
    const checkChainIdAndMetamask = async () => {
        const metamask = window.ethereum
        if (!metamask) {
            toast({
                title: `Metamask not found`,
                message: `Please install Metamask`,
                type: "error"
            })
            return false
        }
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== "1") {
            const chainId = "0x1"
            // Request to switch the chainId
            window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId }],
            }).then((result) => {
                // Check if the chain switch was successful
                if (result) {
                    console.log("Chain switch successful!");
                } else {
                    console.log("Chain switch failed.");
                }
            }).catch((error) => {
                console.log("Error occurred while switching chain:", error);
            });
        }
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
            setisLoading(true)
            checkChainIdAndMetamask()
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[]
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


    React.useEffect(() => {
        if (localStorage.getItem('transaction')) {
            const unprocessedTransaction = JSON.parse(localStorage.getItem('transaction') as string) as types.FormDataProps & {
                isPending: boolean
                ordinal_inscription_id: string
            }
            setFormData({ amount: unprocessedTransaction.amount, tape_route_address: unprocessedTransaction.tape_route_address, ordinal_inscription_id: unprocessedTransaction.ordinal_inscription_id })
            setIsPendingTransaction(unprocessedTransaction.isPending)
        }
        checkIfWalletIsConnected()

    }, [])



    const approveToken = async (e: React.FormEvent<HTMLFormElement>): Promise<boolean> => {
        e.preventDefault()
        try {

            const metamask = window.ethereum
            if (!metamask) {
                toast({
                    title: `Metamask not found`,
                    message: `Please install Metamask`,
                    type: "error"
                })
                return false
            }
            const { amount, tape_route_address } = formData
            if (!amount || !tape_route_address) {
                toast({
                    title: `Invalid amount or address`,
                    message: `Please install Metamask`,
                    type: "error"
                })
                return false
            }
            const yariContract = await utils.getContract({ name: 'yari' })
            const parsedAmount = ethers.parseEther(amount)

            if (yariContract) {
                setisLoadingApprove(true)
                const approveTonen:ContractTransactionResponse = await yariContract.approve(utils.burnerAddress, parsedAmount)
                await approveTonen.wait(3)
                setIsPendingTransaction(true)
                localStorage.setItem('transaction', JSON.stringify({ amount, tape_route_address, isPending: true }))
                setisLoadingApprove(false)
                return true
            }
            setisLoadingApprove(false)
            return false
        } catch (error) {
            setisLoadingApprove(false)
            console.log(error)
            toast({
                title: `Error sending transaction`,
                message: `Please try again later`,
                type: "error"
            })
            return false
        }

    }
    const burnToken = async () => {
        try {
            const metamask = window.ethereum
            if (!metamask) {
                toast({
                    title: `Metamask not found`,
                    message: `Please install Metamask`,
                    type: "error"
                })
                return false
            }

            const { tape_route_address, amount, ordinal_inscription_id } = formData
            if (!amount || !tape_route_address) {
                toast({
                    title: `Invalid amount or address`,
                    message: `Please install Metamask`,
                    type: "error"
                })
                return false
            }
            const burner = await utils.getContract({ name: 'burner' })
            const parsedAmount = ethers.parseEther(amount!)
            if (burner) {
                setisLoadingBurn(true)
                const tx_hash = await burner.burn(parsedAmount, utils.yariAddress)
                console.log(tx_hash)
                await axios.post('/api/transactions', {
                    // tx_hash: tx_hash.hash,
                    amount,
                    tape_route_address,
                    from_address: currentAccount,
                    ordinal_inscription_id,


                }, {
                    headers: {
                        Authorization: process.env.NEXT_PUBLIC_SECRET_HEADER
                    }
                })
                const tx = JSON.parse(localStorage.getItem('transaction') as string) as types.FormDataProps
                toast({
                    title: `Burn success`,
                    message: `Successfully burned ${tx.amount} YARI`,
                    type: "success"
                })
                setisLoadingBurn(false)
                setIsPendingTransaction(false)
                localStorage.removeItem('transaction')
                router.refresh()
                return true
            }
            setisLoadingBurn(false)
            return false
        } catch (error: any) {
            const tx = JSON.parse(localStorage.getItem('transaction') as string) as types.FormDataProps
            setIsPendingTransaction(false)
            setisLoadingBurn(false)
            toast({
                title: `Error burning ${tx.amount} YARI`,
                message: `${error.reason}`,
                type: "error"
            })
            localStorage.removeItem('transaction')
            return false
        }

    }
    return (
        <TransactionContext.Provider value={
            { currentAccount, connectWallet, approveToken, burnToken, handleChange, formData, isLoading, isPendingTransaction, isLoadingApprove, isLoadingBurn }
        }>
            {children}
        </TransactionContext.Provider>
    );
};



