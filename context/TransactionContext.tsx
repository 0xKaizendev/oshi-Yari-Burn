"use client"
import * as React from "react";
import { toast } from "@yaris/components/ui/toast";
import * as types from "@yaris/types/types";
import axios from "axios";
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
interface TransactionProviderProps {
    children: React.ReactNode
};
export const TransactionContext = React.createContext<types.TransactionContextInterface>({
    isLoading: false,
    bridgeToken: async () => false,
    handleChange: async () => { },
    formData: {
        amount: undefined,
        taproot_address: undefined,
        ordinal_inscription_id: undefined
    },
})

export default function TransactionProvider({ children }: TransactionProviderProps) {
    const address = useAddress();
    const { contract } = useContract("0xF32dc7a09aDC261230Cf7Ef81a4880886Da44100", "token")
    const connectWithMetamask = useMetamask()
    const [isLoading, setisLoading] = React.useState<boolean>(false)
    const [formData, setFormData] = React.useState<types.FormDataProps>({
        taproot_address: undefined,
        amount: undefined,
        ordinal_inscription_id: undefined,
    })
    React.useEffect(()=>{
        if(!address) connectWithMetamask()
    })
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'amount') {
            setFormData(prevState => ({ ...prevState, [e.target.name]: e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1') }))
        } else {
            setFormData(prevState => ({
                ...prevState,
                [e.target.name]: e.target.value
            }));
        }
    }
    const bridgeToken = async (e: React.FormEvent<HTMLFormElement>): Promise<boolean> => {
        try {
            e.preventDefault()
            setisLoading(true)
            const { taproot_address, amount, ordinal_inscription_id } = formData
           const burn = await contract?.erc20.burn(amount!)
           const tx_hash=burn?.receipt.transactionHash
           await axios.post('/api/transactions', {
            tx_hash,
            amount: amount,
            taproot_address: taproot_address,
            from_address: address,
            ordinal_inscription_id: ordinal_inscription_id,
        }, {
            headers: {
                Authorization: process.env.NEXT_PUBLIC_SECRET_HEADER
            }
        })
        setisLoading(false)
        toast({
            title: `Burn success`,
            message: `Successfully burned YARI`,
            type: "success"
        })
            return true
        } catch (error) {
            setisLoading(false)
            toast({
                title: `Error sending transactiosn`,
                message: `Please try again later`,
                type: "error"
            })
            return false
        }

    }
    return (
        <TransactionContext.Provider value={
            { bridgeToken, handleChange, formData, isLoading }
        }>
            {children}
        </TransactionContext.Provider>
    );
};
export const useStateContext = () => React.useContext(TransactionContext)