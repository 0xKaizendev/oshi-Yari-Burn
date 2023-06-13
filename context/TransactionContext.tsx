"use client"
import * as React from "react";
import { toast } from "@yaris/components/ui/toast";
import * as utils from '@yaris/lib/utils'
import { ethers } from "ethers";
import * as types from "@yaris/types/types";
import { useRouter } from 'next/navigation'
import axios from "axios";
interface TransactionProviderProps {
    children: React.ReactNode
};



export const TransactionContext = React.createContext<types.TransactionContextInterface>({
    currentAccount: null, connectWallet: () => { },
    isLoading: false,
    isPendingTransaction: false,
    approveToken: async () => false,
    handleChange: async () => { },
    burnToken: async () => false,
    formData: {
        amount: undefined,
        tape_route_address: undefined
    },
})

export default function TransactionProvider({ children }: TransactionProviderProps) {
    const [currentAccount, setCurrentAccount] = React.useState<null | string>(null)
    const [isLoading, setisLoading] = React.useState<boolean>(false)
    const [isPendingTransaction, setIsPendingTransaction] = React.useState<boolean>(false)
    const [formData, setFormData] = React.useState<types.FormDataProps>({
        tape_route_address: undefined,
        amount: undefined,
    })
    const checkChainIdAndMetamask=()=>{
        const metamask = window.ethereum
        if (!metamask) {
            toast({
                title: `Metamask not found`,
                message: `Please install Metamask`,
                type: "error"
            })
            return false
        }
        const chaindId=window.ethereum.networkVersion
        if (chaindId!=="1") {
                const chainId="0x16"
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
        } else {
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
            }
            setFormData({ amount: unprocessedTransaction.amount, tape_route_address: unprocessedTransaction.tape_route_address })
            setIsPendingTransaction(unprocessedTransaction.isPending)
        }
        checkIfWalletIsConnected()

    }, [])


  
    const approveToken = async (): Promise<boolean> => {
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
                await yariContract.approve(utils.burnerAddress, parsedAmount)
                setIsPendingTransaction(true)
                localStorage.setItem('transaction', JSON.stringify({ amount, tape_route_address, isPending: true }))
                return true
            }
            return false
        } catch (error) {
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

            const { tape_route_address, amount } = formData
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
                const tx_hash = await burner.burn(parsedAmount, utils.yariAddress)
                await axios.post('/api/transactions', {
                    tx_hash: tx_hash.hash,
                    amount,
                    tape_route_address,
                    from_address: currentAccount


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
                setIsPendingTransaction(false)
                localStorage.removeItem('transaction')
                return true
            }

            return false
        } catch (error: any) {
            const tx = JSON.parse(localStorage.getItem('transaction') as string) as types.FormDataProps
            setIsPendingTransaction(false)
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
            { currentAccount, connectWallet, approveToken, burnToken, handleChange, formData, isLoading, isPendingTransaction }
        }>
            {children}
        </TransactionContext.Provider>
    );
};



