"use client"
import { Button, buttonVariants } from '@yaris/components/ui/button'
import { Input } from '@yaris/components/ui/input';
import { TransactionContext } from '@yaris/context/TransactionContext';
import { LucideLoader2 } from 'lucide-react';
import { useContext } from 'react';
export default function Home() {
  const { approveToken, isLoadingTransaction, handleChange, formData, } = useContext(TransactionContext)
  return (
    <main className="h-screen max-h-screen h-min-screen select-none flex flex-col  items-center gap-6 pt-16 md:pt-48">

      <div className='flex flex-col  gap-3 md:gap-8 container  items-center justify-center md:px-24 '>
        <h2 className='font-heading text-center md:text-6xl text-3xl bg-gradient-to-r from-[#e0c24c] via-[#54634c] to-green-800 bg-clip-text leading-normal text-transparent'>BURN YOUR ERC20 YARI FOR <br className='hidden md:block' /> BRC20 </h2>
        <p className='text-muted-foreground font-sans text-xl max-w-prose text-center'>  Lorem ipsum dolor sit amet consectetur adipisicing elit. Et quaerat voluptatibus asperiores magnam,</p>
        <form className='mt-3 rounded-xl flex flex-col justify-center items-center w-full md:w-8/12 lg:w-3/12 border-1  gap-5 ' onSubmit={approveToken}>
          <Input placeholder='Amount to burn' className='p-7 ' value={formData.amount} type='text' name='amount' onChange={handleChange} required />
          <Button className='w-full  relative bg-gradient-to-r  from-green-600 to-green-800' type='submit'>
            <span className={`${isLoadingTransaction ? "text-primary hover:text-primary/90" : null}`}> Approve</span>
            {isLoadingTransaction ? <LucideLoader2 className='animate-spin absolute' /> : null}
          </Button>
        </form>
      </div>
    </main>
  )
}
