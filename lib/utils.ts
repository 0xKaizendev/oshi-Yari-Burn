import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export {abi as burnerApi} from './BurnYaris.json'
export {abi as yarisAbi} from './ERC20.json'
export const yariAddress= '0x31c2da967a284A00999ab9fe49b5CFd580c2d4E9'
export const burnerAddress= '0x31c2da967a284A00999ab9fe49b5CFd580c2d4E9'