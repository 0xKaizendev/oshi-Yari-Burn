"use client"
import React, {  useContext } from 'react';
import { Button } from './ui/button';
import { TransactionContext } from '@yaris/context/TransactionContext';
import { LucideLoader2 } from 'lucide-react';
interface SignInButtonProps  {
  
};

export default function SignInButton ({  })  {
    const { connectWallet, currentAccount, isLoading } = useContext(TransactionContext)
  return (
    <div className='bg-gradient-to-r  from-green-600 to-green-800 p-2 rounded-xl'>
    {currentAccount !== null ? `${currentAccount.slice(0, 7)}...${currentAccount.slice(35)}` : (<Button className={` relative bg-gradient-to-r  from-green-600 to-green-800 md:text-sm text-xs h-8 px-2 md:h-10 md:py-2 md:px-4`} onClick={connectWallet}>
      <span className='text-primary hover:text-primary/90'> Connect Wallet</span>
      {isLoading ? <LucideLoader2 className='animate-spin absolute' /> : null}
    </Button>)}
  </div>
  );
};
