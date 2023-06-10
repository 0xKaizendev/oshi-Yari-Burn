import { ContractProps } from "@yaris/types/types";
import { ClassValue, clsx } from "clsx";
import { ethers, type Contract } from "ethers";
import { twMerge } from "tailwind-merge";
import { getAbi } from "./get-abis";
export const yariAddress = "0xF32dc7a09aDC261230Cf7Ef81a4880886Da44100";
// export const yariAddress = "0x31c2da967a284A00999ab9fe49b5CFd580c2d4E9";
export const burnerAddress = "0x129DE6E64D14C03f65FC013f01cF2d06500356A2";
//  const burnerAddress = "0x31c2da967a284A00999ab9fe49b5CFd580c2d4E9";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getContract = async ({
  name,
}: ContractProps): Promise<Contract> => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  if (name === "yari") {
    const yarisAbi = await getAbi("yari");
    const yariContract = new ethers.Contract(yariAddress, yarisAbi, signer);
    return yariContract;
  } else {
    const burnerAbi = await getAbi("burner");
    const burnerContract = new ethers.Contract(
      burnerAddress,
      burnerAbi,
      signer
    );
    return burnerContract;
  }
};
