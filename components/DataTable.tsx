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
import { TransactionInterface } from '@yaris/types/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger, DialogFooter
} from "@yaris/components/ui/dialog"
import { Switch } from "@yaris/components/ui/switch"
import { Input } from "@yaris/components/ui/input"
import { Label } from "@yaris/components/ui/label"
import { Button } from "./ui/button";
import axios from "axios";
import { Transaction } from "@prisma/client";
interface TableProps {
    transactions: Transaction[]
};

export function DataTable({ transactions }: TableProps) {
    const [isLoading, setisLoading] = React.useState<boolean>(false)
    const router = useRouter()
    const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction>({
        id: 0,
        tx_hash: "",
        amount: "",
        from_address: "",
        tape_route_address: "",
        timestamp: null,
        completed: false,
        user_id:0
    })
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSelectedTransaction(prevState => ({ ...prevState, [e.target.name]: e.target.value }))

    }
    const updateTransaction = async () => {
        setisLoading(true)
        const saveTransaction = await axios.patch('/api/transactions', selectedTransaction, {
            headers: {
                Authorization: process.env.NEXT_PUBLIC_SECRET_HEADER
            }
        })
        setisLoading(false)
        router.refresh()
    }
    // React.useEffect(() => { }, [selectedTransaction])
    return (
        <>

            <Table className="font-medium">
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">id</TableHead>
                        <TableHead className="text-center">From Address</TableHead>
                        <TableHead className="text-center">Amount</TableHead>
                        <TableHead className="text-center">Tape Route Address</TableHead>
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
                            <TableCell className="text-center">{transaction.tape_route_address}</TableCell>
                            <TableCell className="text-center">{transaction.completed ? <span className="bg-green-600 px-2 py-1.5 rounded-lg text-xs text-white">processed</span> : <span className="bg-red-600 px-2 py-1.5 text-xs text-white  rounded-lg">unprocessed</span>}</TableCell>
                            <TableCell className="text-center">
                                <Dialog>
                                    <DialogTrigger className="flex px-2 mx-auto gap-2 py-1 items-center justify-center border-green-600 border rounded-lg" onClick={() => setSelectedTransaction(transaction)}><p className="text-xs">Edit</p>
                                        <Edit2 className="w-3 h-3 " />
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>Edit transction</DialogTitle>
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
                                                <Input id="name" value={selectedTransaction?.tape_route_address} onChange={handleChange} name="tape_route_address" className="col-span-3" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="username" className="text-left">
                                                    Amount
                                                </Label>
                                                <Input id="username" onChange={handleChange} value={selectedTransaction?.amount} name="amount" className="col-span-3" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="username" className="text-left">
                                                    Status
                                                </Label>
                                                <Switch checked={selectedTransaction.completed} onCheckedChange={(checked) => setSelectedTransaction(prevState => ({ ...prevState, completed: !prevState.completed }))} />

                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" className="relative" onClick={updateTransaction}>

                                                <span className={`${isLoading ? "text-primary hover:text-primary/90" : null}`}> Update</span>
                                                {isLoading ? <LucideLoader2 className='animate-spin absolute' /> : null}
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
