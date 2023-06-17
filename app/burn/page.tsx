"use client"
import { Input } from '@yaris/components/ui/input';
import { TransactionContext } from '@yaris/context/TransactionContext';
import { useContext } from 'react';
import { LucideLoader2 } from 'lucide-react';
import { Button } from '@yaris/components/ui/button';
import { useRouter } from 'next/navigation'
export default function Page({ }) {
    const router = useRouter()
    const { burnToken, isLoadingTransaction, handleChange, formData,  } = useContext(TransactionContext)
    return (
        <div className='w-full h-screen flex flex-col  items-center pt-24'>
            <div className='rounded-xl flex flex-col justify-center items-center w-full md:w-8/12 lg:w-3/12 border-1 px-4 py-6 bg-muted gap-5'>
                <form className='rounded-xl flex flex-col justify-center items-center w-full  gap-5' onSubmit={(e) => burnToken(e)}>

                    <Input placeholder='Amount to burn' className='p-7 ' value={formData.amount} type='text' name='amount' disabled />
                    <Input placeholder='Taproot Address' className='p-7' value={formData.taproot_address} type='text' onChange={handleChange} name='tape_route_address' required />
                    <Input placeholder='Transfer Inscriptions Id' className='p-7' value={formData.ordinal_inscription_id} type='text' onChange={handleChange} name='ordinal_inscription_id' required />
                    <Button className='w-full ' variant={'destructive'} >
                    <span className={`${isLoadingTransaction ? "text-destructive hover:text-destructive/90" : null}`}> Burn</span>
                    {isLoadingTransaction ? <LucideLoader2 className='animate-spin absolute' /> : null}
                </Button>
                </form>

            </div>

        </div>
    );
};
