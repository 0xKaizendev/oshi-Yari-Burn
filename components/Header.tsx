"use client"
import React, { useContext } from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import { LucideLoader2 } from 'lucide-react';
import logo from '@yaris/assets/logo.png'
import { TransactionContext } from '@yaris/context/TransactionContext';
interface HeaderProps {

};
export default function Header({ }) {
  const { connectWallet, currentAccount, isLoading } = useContext(TransactionContext)
  return (
    <div className={`md:p-4 px-1 w-full flex justify-between items-center border-b-2 border-muted`}>
      <Link className='flex lg:w-1/4 items-end gap-2 justify-start  ' href='/'>
        <Image src={logo} alt='yaris' height={40} width={40} className='rounded-xl wc-6 hc-6 md:cw-10 mdc:h-10' />
        <h1 className='font-heading text-center md:text-2xl bg-gradient-to-r from-[#e0c24c] via-[#54634c] to-green-800 bg-clip-text text-transparent'>YARI BURN</h1>

      </Link>
      <div className={'flex-1 flex justify-end items-center p-2'}>
        <div className={'flex lg:w-1/4 justify-end items-center md:gap-4 gap-2'}>
          <div className='bg-gradient-to-r  from-green-600 to-green-800 p-2 rounded-xl'>
            {currentAccount !== null ? `${currentAccount.slice(0, 7)}...${currentAccount.slice(35)}` : (<Button className={` relative bg-gradient-to-r  from-green-600 to-green-800 md:text-sm text-xs h-8 px-2 md:h-10 md:py-2 md:px-4`}  onClick={connectWallet}>
              <span className={`${isLoading ? "text-blue-600 hover:text-blue-700" : null}`}> Connect Wallet</span>
              {isLoading ? <LucideLoader2 className='animate-spin absolute' /> : null}
            </Button>)}
          </div>
        </div>
      </div>
    </div>
  );
};
