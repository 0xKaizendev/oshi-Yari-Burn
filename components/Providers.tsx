'use client'
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react'
import TransactionProvider from '@yaris/context/TransactionContext';
interface ProviderProps {
    children: ReactNode
};

export default function Providers({ children }: ProviderProps) {
    return (
        <SessionProvider>
            <TransactionProvider>
                {children}
            </TransactionProvider>
        </SessionProvider>

    );
};