import { ContractProps } from "@yaris/types/types";
import { ClassValue, clsx } from "clsx";
import { ethers, type Contract } from "ethers";
import { twMerge } from "tailwind-merge";
import { getAbi } from "./get-abis";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { Transaction } from "@prisma/client";
// export const yariAddress = "0xF32dc7a09aDC261230Cf7Ef81a4880886Da44100";
export const yariAddress = "0x31c2da967a284a00999ab9fe49b5cfd580c2d4e9";
// export const burnerAddress = "0x129DE6E64D14C03f65FC013f01cF2d06500356A2";
 const burnerAddress = "0xFCb69C821b499d06a295eE2f19A2F2F70E1d8Bcb";
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
export const getData = async () => {
  const data = await fetch("/api/transactions", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_SECRET_HEADER!,
    },
    cache: "no-store"
  });
  return data.json();
};
export async function authenticate(req: NextRequest) {
  const secret = process.env.NEXT_PUBLIC_SECRET_HEADER;
  if (secret !== req.headers.get("authorization")) {
    return false;
  } else {
    return true;
  }
}
export const editTransaction = async (transaction: Transaction) => {
  try {
    await axios.patch("/api/transactions", transaction, {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_SECRET_HEADER,
      },
    });
  } catch (error) {}
};
export const deleteTransaction = async (id: string) => {
  try {
    await axios.delete(`/api/transactions?id=${id}`, {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_SECRET_HEADER,
      },
    });
  } catch (error) {}
};
