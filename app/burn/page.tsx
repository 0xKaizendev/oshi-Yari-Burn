"use client"
import React, { useState } from 'react';
import { Input } from '@yaris/components/ui/input';
import { FlameIcon } from 'lucide-react';
import { TransactionContext } from '@yaris/context/TransactionContext';
import { useContext } from 'react';
import { LucideLoader2 } from 'lucide-react';
import { Button } from '@yaris/components/ui/button';
import Image from 'next/image'
import { useRouter } from 'next/navigation'
interface pageProps {

};

export default function Page({ }) {
    const [isLoadingApprove, setisLoadingApprove] = useState<boolean>(false)
    const router = useRouter()
    // const [isaproved, setIsaproved] = useState<boolean>(false)
    const [isLoadingBurn, setisLoadingBurn] = useState<boolean>(false)
    const { approveToken, burnToken, connectWallet, isPendingTransaction, handleChange, formData, isLoading } = useContext(TransactionContext)
    const approve = async () => {
        setisLoadingApprove(true)
        await approveToken()
        setisLoadingApprove(false)


    }
    const burn = async () => {
        setisLoadingBurn(true)
        const tx = await burnToken()
        console.log(tx)
        if(!tx){
            router.refresh()
        }
        setisLoadingBurn(false)

    }
    const checkInput = (e: React.FormEvent<HTMLInputElement>) => {
        // e.target.v
    }
    return (
        <div className='w-full h-screen flex flex-col  items-center pt-24'>
            <div className='rounded-xl flex flex-col justify-center items-center w-full md:w-8/12 lg:w-3/12 border-1 px-4 py-6 bg-muted gap-5'>

                <Input placeholder='Amount to burn' className='p-7 ' value={formData.amount} type='text' name='amount' onChange={handleChange} />
                <FlameIcon className='text-destructive' />
                <Input placeholder='Unisat Adress' className='p-7' value={formData.tape_route_address} type='text' onChange={handleChange} name='tape_route_address' />
                <Button className='w-full  relative' onClick={approve} disabled={isPendingTransaction}>
                    <span className={`${isLoadingApprove ? "text-primary hover:text-primary/90" : null}`}> Approve</span>
                    {isLoadingApprove ? <LucideLoader2 className='animate-spin absolute' /> : null}
                </Button>
                <Button className='w-full ' variant={'destructive'} onClick={burn}>
                    <span className={`${isLoadingBurn ? "text-destructive hover:text-destructive/90" : null}`}> Burn</span>
                    {isLoadingBurn ? <LucideLoader2 className='animate-spin absolute' /> : null}
                </Button>
            </div>
        </div>
    );
};
