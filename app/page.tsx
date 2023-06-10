import { Button,buttonVariants } from '@yaris/components/ui/button'
import Image from 'next/image'
import { FlameIcon,CoinsIcon, } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@yaris/lib/utils'
export default function Home() {
  return (
    <main className="h-screen max-h-screen h-min-screen select-none flex flex-col  items-center gap-6 pt-16 md:pt-48">

      <div className='flex flex-col  gap-3 md:gap-8 container  items-center justify-center md:px-24 '>
        <h2 className='font-heading text-center md:text-6xl text-3xl bg-gradient-to-r from-[#e0c24c] via-[#54634c] to-green-800 bg-clip-text leading-normal text-transparent'>BURN YOUR ERC20 YARI FOR <br className='hidden md:block' /> BRC20 </h2>
        <p className='text-muted-foreground font-sans text-xl max-w-prose text-center'>  Lorem ipsum dolor sit amet consectetur adipisicing elit. Et quaerat voluptatibus asperiores magnam,</p>
        <div className='mt-3'>
          <Link className={cn(buttonVariants({variant:"outline"}))} href={'/burn'} >
            BURN YARIS
          </Link>
        </div>
      </div>
      <div className='hidden flexs flex-wrap md:flex-row flex-col  w-full px-36 gap-5'>
        <div className='flex-1 bg-muted rounded-md p-3 flex items-center flex-col justify-center gap-4 '>
          <FlameIcon />
          <p>Total value burned</p>
          <p className='font-heading text-2xl'>44,034,588</p>
        </div>
        <div className='flex-1 bg-muted rounded-md p-3 flex items-center flex-col justify-center gap-4 '>
          <FlameIcon />
          <p>Total value burned</p>
          <p className='font-heading text-2xl'>44,034,588</p>
        </div>
        <div className='flex-1 bg-muted rounded-md p-3 flex items-center flex-col justify-center gap-4 '>
          <FlameIcon />
          <p>Total value burned</p>
          <p className='font-heading text-2xl'>44,034,588</p>
        </div>
        <div className='flex-1 bg-muted rounded-md p-3 flex items-center flex-col justify-center gap-4 '>
          <FlameIcon />
          <p>Total value burned</p>
          <p className='font-heading text-2xl'>44,034,588</p>
        </div>
      </div>
    </main>
  )
}
