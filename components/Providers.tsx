'use client'
import { ReactNode } from 'react';
import TransactionProvider from '@yaris/context/TransactionContext';
interface ProviderProps {
    children: ReactNode
};

export default function Providers({ children }: ProviderProps) {
    return (
            <TransactionProvider>
                {children}
            </TransactionProvider>

    );
};