"use client"
import React, { useState } from 'react';
import { Input } from '@yaris/components/ui/input';
import { FlameIcon } from 'lucide-react';
import { TransactionContext } from '@yaris/context/TransactionContext';
import { useContext } from 'react';
import { LucideLoader2 } from 'lucide-react';
import { Button } from '@yaris/components/ui/button';
import Image from 'next/image'
interface pageProps {

};

export default function Page({ }) {
    const [isLoadingApprove, setisLoadingApprove] = useState<boolean>(false)
    const [isLoadingBurn, setisLoadingBurn] = useState<boolean>(false)
    const { approveToken, burnToken, connectWallet, currentAccount, handleChange, formData, isLoading } = useContext(TransactionContext)
    const approve = async (e: any) => {
        setisLoadingApprove(true)
        await approveToken()
        setisLoadingApprove(false)

    }
    const burn = async (e: any) => {
        setisLoadingBurn(true)
        await burnToken()
        setisLoadingBurn(false)

    }
    return (
        <div className='w-full h-screen flex flex-col  items-center pt-24'>
            <div className='rounded-xl flex flex-col justify-center items-center w-full md:w-8/12 lg:w-3/12 border-1 px-4 py-6 bg-muted gap-5'>

                <Input placeholder='Amount to burn' className='p-8 ' type='text' pattern='^[0-9]*[.,]?[0-9]*$' name='amount' onChange={handleChange} />
                <FlameIcon className='text-red-600' />
                <Input placeholder='Unisat Adress' className='p-8' type='text' onChange={handleChange} name='tapeRouteAdress' />
                <Button className='w-full  relative' onClick={approve}>
                    <span className={`${isLoadingApprove ? "text-blue-600 hover:text-blue-700" : null}`}> Approve</span>
                    {isLoadingApprove ? <LucideLoader2 className='animate-spin absolute' /> : null}
                </Button>
                <Button className='w-full bg-red-600 hover:bg-red-400 relative' onClick={burn}>
                    <span className={`${isLoadingBurn ? "text-red-600 hover:text-red-400" : null}`}> Burn</span>
                    {isLoadingBurn ? <LucideLoader2 className='animate-spin absolute' /> : null}
                </Button>
            </div>
        </div>
    );
};
