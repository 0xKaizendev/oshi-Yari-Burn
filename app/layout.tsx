import './globals.css'
import { Toaster } from '@yaris/components/ui/toast'

import { cn } from "@yaris/lib/utils"
import Header from '@yaris/components/Header'
import Providers from '@yaris/components/Providers'
import { Inter as FontSans } from "next/font/google"
import localFont from "next/font/local"
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})
export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}
const fontHeading = localFont({
  src: "../public/assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
})
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased flex flex-col md:px-20",
        fontSans.variable,
        fontHeading.variable
      )}>
        <Providers>
        <Header />
        {children}
        <Toaster position='bottom-right'/>
        </Providers>

    </body>
    </html>
  )
}
