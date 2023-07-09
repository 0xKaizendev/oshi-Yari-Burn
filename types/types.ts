export interface FormDataProps {
  taproot_address: string | undefined;
  amount: number | undefined;
  ordinal_inscription_id: string | undefined;
}
export interface TransactionContextInterface {
  bridgeToken: (e:any) => Promise<boolean>;
  isLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: FormDataProps;
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