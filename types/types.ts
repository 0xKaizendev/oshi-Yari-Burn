export interface TransactionInterface {
  id?: number;
  user_id?: number;
  tx_hash: string;
  amount: string;
  from_address: string;
  tape_route_address: string;
  timestamp?: null;
  completed?: boolean;
}

export interface FormDataProps {
  tape_route_address: string | undefined;
  amount: string | undefined;
}
export interface TransactionContextInterface {
  currentAccount: string | null;
  connectWallet: () => void;
  approveToken: () => Promise<boolean>;
  burnToken: () => Promise<boolean>;
  isLoading: boolean;
  isPendingTransaction: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: FormDataProps;
}
export interface ContractProps {
  name: "yari" | "burner";
}
