"use client"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@yaris/components/ui/table"
import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Edit2 } from "lucide-react";
import { LucideLoader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger, DialogFooter
} from "@yaris/components/ui/dialog"
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
import { Switch } from "@yaris/components/ui/switch"
import { Input } from "@yaris/components/ui/input"
import { Label } from "@yaris/components/ui/label"
import { Button, buttonVariants } from "./ui/button";
import axios from "axios";
import { Transaction } from "@prisma/client";
import { cn } from "@yaris/lib/utils";
interface TableProps {
    transactions: Transaction[]
};

 function DataTable({ transactions }: TableProps) {
    const [isUpdating, setisUpdating] = React.useState<boolean>(false)
    const [isDeleting, setisDeleting] = React.useState<boolean>(false)
    const router = useRouter()
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
        status: "APPROVED"
    })
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSelectedTransaction(prevState => ({ ...prevState, [e.target.name]: e.target.value }))

    }
    const updateTransaction = async () => {
        setisUpdating(true)
        const saveTransaction = await axios.patch('/api/transactions', selectedTransaction, {
            headers: {
                Authorization: process.env.NEXT_PUBLIC_SECRET_HEADER
            }
        })
        setisUpdating(false)
        router.refresh()
    }
    const deleteTransaction = async () => {
        setisDeleting(true)
        const saveTransaction = await axios.delete(`/api/transactions?id=${selectedTransaction.id}`, {
            headers: {
                Authorization: process.env.NEXT_PUBLIC_SECRET_HEADER
            }
        })
        setisDeleting(false)
        router.refresh()
    }
    return (
        <>

            <Table className="font-medium ">
                <TableCaption>A list of recent transactions .</TableCaption>
                <TableHeader>
                    {/* transfer inscriptions id */}
                    <TableRow>
                        <TableHead className="text-center">id</TableHead>
                        <TableHead className="text-center">From Address</TableHead>
                        <TableHead className="text-center">Amount</TableHead>
                        <TableHead className="text-center">Taproot Address</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((transaction) => (
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
                                                    Tape Route Address
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
                                                    Ordinal Id
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
                                                        <AlertDialogAction className="bg-destructive text-white " onClick={deleteTransaction}>
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
                </TableBody>
            </Table>
        </>
    )
}
export default React.memo(DataTable)