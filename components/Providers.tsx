'use client'
import { FC, ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import TransactionProvider from '@yaris/context/TransactionContext';
interface ProviderProps {
    children: ReactNode
};

export default function Providers({ children }: ProviderProps) {
    // const queryClient = new QueryClient()
    return (
        // <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <TransactionProvider>
                {children}
            </TransactionProvider>
        </ThemeProvider>
        // </QueryClientProvider>


    );
};