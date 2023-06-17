import { MetaMaskInpageProvider } from "@metamask/providers";
declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}
export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string,
    discord:string
    telegram:string
  }
}
