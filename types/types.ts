export interface FormDataProps {
  taproot_address: string | undefined;
  amount: string | undefined;
  ordinal_inscription_id: string | undefined;
}
export interface TransactionContextInterface {
  currentAccount: string | null;
  connectWallet: () => void;
  approveToken: (e:any) => Promise<boolean>;
  burnToken: (e:any) => Promise<boolean>;
  isLoading: boolean;
  isLoadingTransaction: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: FormDataProps;
}
export interface ContractProps {
  name: "yari" | "burner";
}
