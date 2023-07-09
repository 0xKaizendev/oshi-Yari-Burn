'use client'
import { ReactNode } from 'react';
import TransactionProvider from '@yaris/context/TransactionContext';
import { ThirdwebProvider,metamaskWallet,coinbaseWallet,walletConnect } from "@thirdweb-dev/react";
import { Ethereum, Polygon,Sepolia } from "@thirdweb-dev/chains";
interface ProviderProps {
    children: ReactNode
};

export default function Providers({ children }: ProviderProps) {
    return (
        <ThirdwebProvider activeChain={Sepolia} supportedWallets={[metamaskWallet()]} autoConnect={true}>
            <TransactionProvider>
                {children}
            </TransactionProvider>
            </ThirdwebProvider>

    );
};