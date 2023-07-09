"use client"
import React from 'react';
import {
  TableCell,
  TableRow,
} from "@yaris/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger, DialogFooter
} from "@yaris/components/ui/dialog"
import { cn, deleteTransaction, editTransaction } from '@yaris/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@yaris/components/ui/alert-dialog"
import { Transaction } from "@prisma/client";
import { Edit2, LucideLoader2 } from 'lucide-react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Button, buttonVariants } from './ui/button';
import { useRouter } from 'next/navigation';
import axios from 'axios';
interface TableContentProps {
  data: Transaction[] | undefined
};

export default function TableContent({ data }: TableContentProps) {
  const [isUpdating, setisUpdating] = React.useState<boolean>(false)
  const [isDeleting, setisDeleting] = React.useState<boolean>(false)
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction>({
    id: 0,
    tx_hash: "",
    amount: "",
    from_address: "",
    taproot_address: "",
    timestamp: null,
    completed: false,
    user_id: 0,
    ordinal_inscription_id: "",
  })
  const router = useRouter()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedTransaction(prevState => ({ ...prevState, [e.target.name]: e.target.value }))

  }
  const updateTransaction = async () => {
    setisUpdating(true)
    await editTransaction(selectedTransaction)
    setisUpdating(false)
    router.refresh()
  }
  const remove = async () => {
    setisDeleting(true)
    await deleteTransaction(selectedTransaction.id.toString())
    setisDeleting(false)
    router.refresh()
  }
  return (
    <>
      {data?.map((transaction) => (
        <TableRow key={transaction.id}>
          <TableCell className="font-medium text-center">{transaction.id}</TableCell>
          <TableCell className="text-center">{transaction.from_address}</TableCell>
          <TableCell className="text-center">{transaction.amount}</TableCell>
          <TableCell className="text-center">{transaction.taproot_address}</TableCell>
          <TableCell className="text-center">{transaction.completed ? <span className="bg-green-600 px-2 py-1.5 rounded-lg text-xs text-white">processed</span> : <span className="bg-red-600 px-2 py-1.5 text-xs text-white  rounded-lg">unprocessed</span>}</TableCell>
          <TableCell className="text-center">
            <Dialog>
              <DialogTrigger className="flex px-2 mx-auto gap-2 py-1 items-center justify-center border-green-600 border rounded-lg" onClick={() => setSelectedTransaction(transaction)}><p className="text-xs">Edit</p>
                <Edit2 className="w-3 h-3 " />
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit transaction</DialogTitle>
                  <DialogDescription>
                    Make changes to the transaction here. Click save when youre done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-left">
                      From Address
                    </Label>
                    <Input id="name" value={selectedTransaction?.from_address!} onChange={handleChange} name="from_address" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-left">
                      Taperoot address
                    </Label>
                    <Input id="name" value={selectedTransaction?.taproot_address || ""} onChange={handleChange} name="taproot_address" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-left">
                      Amount
                    </Label>
                    <Input id="username" onChange={handleChange} value={selectedTransaction?.amount} name="amount" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-left">
                      Inscription id
                    </Label>
                    <Input id="username" onChange={handleChange} value={selectedTransaction?.ordinal_inscription_id || ""} name="ordinal_inscription_id" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-left">
                      Status
                    </Label>
                    <Switch checked={selectedTransaction.completed} onCheckedChange={(checked) => setSelectedTransaction(prevState => ({ ...prevState, completed: !prevState.completed }))} />
                  </div>
                </div>
                <DialogFooter>

                  <AlertDialog>
                    <AlertDialogTrigger className={`${cn(buttonVariants({ variant: "destructive" }))} relative`}> <span className={`${isDeleting ? "text-primary hover:text-primary/90" : null}`}> Delete</span>
                      {isDeleting ? <LucideLoader2 className='animate-spin absolute' /> : null}</AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure to delete this transaction?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive text-white " onClick={remove}>
                          <span className={`text-primary`}> Yes</span>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button type="submit" className="relative" onClick={updateTransaction}>

                    <span className={`${isUpdating ? "text-primary hover:text-primary/90" : null}`}> Update</span>
                    {isUpdating ? <LucideLoader2 className='animate-spin absolute' /> : null}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
