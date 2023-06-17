import './globals.css'
import { Toaster } from '@yaris/components/ui/toast'
import { siteConfig } from "@yaris/config/site"

import { SiteFooter } from '@yaris/components/site-footer'
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
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Web3",
    "BRC20",
    "ERC20",
    "Yari Token",
    "Oshi Finance",
  ],
  authors: [
    {
      name: "Oshi Finance",
      url: "http://www.oshi.fi/",
    },
  ],
  creator: "Oshi Finance",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${siteConfig.url}/og.jpg`,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.png`],
    creator: "@0xZales",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
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
        "bg-background font-sans antialiased flex flex-col h-screen gap-36  md:px-20",
        fontSans.variable,
        fontHeading.variable
      )}>
        <Providers >
          <main className='flex flex-col h-screen gap-10 justify-between'>
          <Header />
            {children}
            <Toaster position='top-right' />
            <SiteFooter />
          </main>

        </Providers>
        {/* <SiteFooter /> */}

      </body>
    </html>
  )
}
