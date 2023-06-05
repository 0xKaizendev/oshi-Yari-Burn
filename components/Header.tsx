"use client"
import React, { useContext } from 'react';
import { useState, useEffect } from 'react'
import Image from 'next/image';
import { Button } from './ui/button';
import { ModeToggle } from './mode-toggle';
import ethLogo from '@yaris/assets/eth.png'
import Link from 'next/link';
import { LucideLoader2 } from 'lucide-react';
import logo from '@yaris/assets/logo.png'
import { TransactionContext } from '@yaris/context/TransactionContext';
import { MoreVertical } from 'lucide-react'
interface HeaderProps {

};
const style = {
  headerLogo: ``,
  nav: ``,
  buttonsContainer: ``,

}
export default function Header({ }) {
  // const [isLoading, setisLoading] = useState<boolean>(false)
  const { connectWallet, currentAccount, isLoading} = useContext(TransactionContext)

  const [selectedNav, setSelectedNav] = useState('swap')
  return (
    <div className={`md:p-4 px-1 w-full flex justify-between items-center border-b-2 border-muted`}>
      <Link className='flex md:w-1/4 items-end gap-2 justify-start  ' href='/'>
        <Image src={logo} alt='yaris' height={40} width={40} />
        <h1 className='font-heading text-center md:text-3xl bg-gradient-to-r from-yellow-500 via-green-600 to-green-800 bg-clip-text text-transparent'>YARIS BURN</h1>

      </Link>
      <div className={'flex-1 flex justify-end items-center p-2'}>
        {/* <div className={style.navItemsContainer}>
            <div
            onClick={() => setSelectedNav('swap')}
            className={`${style.navItem} ${
              selectedNav === 'swap' && style.activeNavItem
            }`}
          >
            Swap
          </div>    
          <div
            onClick={() => setSelectedNav('pool')}
            className={`${style.navItem} ${
              selectedNav === 'pool' && style.activeNavItem
            }`}
          >
            Pool
          </div>
          <div
            onClick={() => setSelectedNav('vote')}
            className={`${style.navItem} ${
              selectedNav === 'vote' && style.activeNavItem
            }`}
          >
            Vote
          </div>
            </div> */}
        <div className={'flex md:w-1/4 justify-end items-center md:gap-4 gap-2'}>
          <ModeToggle />
          <div className='bg-muted p-2 rounded-xl'>
            {currentAccount !== null ? `${currentAccount.slice(0, 7)}...${currentAccount.slice(35)}` : (<Button className={`rounded-xl bg-blue-600 hover:bg-blue-700 relative `} onClick={connectWallet}>
              <span className={`${isLoading ? "text-blue-600 hover:text-blue-700" : null}`}> Connect Wallet</span>
              {isLoading ? <LucideLoader2 className='animate-spin absolute' /> : null}
            </Button>)}
          </div>
        </div>
      </div>
    </div>
  );
};
