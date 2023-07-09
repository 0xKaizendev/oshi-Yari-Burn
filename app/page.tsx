"use client"
import SignInButton from '@yaris/components/SignInButton';
import { Button, buttonVariants } from '@yaris/components/ui/button'
import Header from '@yaris/components/Header'
import { Input } from '@yaris/components/ui/input';
import { TransactionContext, useStateContext } from '@yaris/context/TransactionContext';
import { LucideLoader2 } from 'lucide-react';
import { useContext } from 'react';
export default function Home() {
  const { bridgeToken, handleChange, formData,isLoading } = useContext(TransactionContext)
  console.log(isLoading)
  return (
    <main className="select-none flex flex-col  gap-3 md:gap-8   items-center justify-center">
      <Header >
        <SignInButton />
      </Header>
      <h2 className='font-heading text-center md:text-6xl text-3xl bg-gradient-to-r from-[#e0c24c] via-[#54634c] to-green-800 bg-clip-text leading-relaxed text-transparent px-4 md:px-0 '>Welcome to the Yari Token  <br className='hidden md:block' /> Burning Interface </h2>
      <div className='text-foreground font-medium max-w-3xl text-center flex flex-col gap-5 px-4 md:px-0'>
        <p>
          Unleash your cypherpunk spirit and become a true DeFi degenerate while shaping the evolution of the Yari protocol and stacking those juicy rewards!
        </p>
        <p>
          As a Yari hodler, you wield the power to propose and implement radical governance models and unleash the wildest liquidity experiments on the Bitcoin network.
        </p>
        <p>
          With every $deth bridge transaction, a meager fee is extracted. But forget about hoarding those fees for ourselves! We&apos; re flipping the script and redistributing them directly to Yari holders, pro rata style, at a mind-bending rate of 0.3% per bridge use. The more degenerates join the bridge, the sweeter your rewards become!
        </p>
        <p className=''>
          So why hesitate? Dive headfirst into the Yari community and embark on a wild journey where you shape the future of DeFi on Bitcoin with a dash of cypherpunk rebellion. Get ready to unleash your inner degen and reap the rewards that await you!</p>
      </div>
      <form className='mt-3 rounded-xl flex flex-col justify-center items-center w-full md:w-8/12 lg:w-5/12 border-1 px-4 md:px-0 gap-5 ' onSubmit={bridgeToken}>
        <Input placeholder='Amount to burn' className='p-7 ' value={formData.amount} type='text' name='amount' onChange={handleChange} required />
        <Input placeholder='Taproot Address' className='p-7' value={formData.taproot_address} type='text' onChange={handleChange} name='taproot_address' required />
        <Input placeholder='Transfer Inscriptions Id' className='p-7' value={formData.ordinal_inscription_id} type='text' onChange={handleChange} name='ordinal_inscription_id' required />
        <a href="/how-to-make-transfer-inscription" className=' w-full text-right text-sm font-semibold underline underline-offset-4'>How to make transfer inscritpion?</a>
        <Button className='w-full  relative bg-gradient-to-r  from-green-600 to-green-800' type='submit'>
          <span className={`${isLoading ? " hidden" : "text-primary hover:text-primary/90"}`}> Bridge Yari</span>
          {isLoading ? <LucideLoader2 className='animate-spin absolute' /> : null}
        </Button>
      </form>
    </main>
  )
}
