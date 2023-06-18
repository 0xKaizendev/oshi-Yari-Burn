"use client"
import React, { useContext } from 'react';
import { signOut } from 'next-auth/react'
import { Button } from './ui/button';
import { TransactionContext } from '@yaris/context/TransactionContext';
import { LucideLoader2 } from 'lucide-react';
export default function SignOutButton({ }) {
  return (

    <Button className={` relative bg-gradient-to-r  from-green-600 to-green-800 md:text-sm text-xs h-8 px-2 md:h-10 md:py-2 md:px-4 cursor-pointer`} onClick={() => signOut()}>
      Signout
    </Button>
  );
};
