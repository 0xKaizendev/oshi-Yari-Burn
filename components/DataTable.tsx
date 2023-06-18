"use client"
import {
    Table,
    TableBody,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow, TableCell
} from "@yaris/components/ui/table"
import { setps } from "@yaris/config/setps"
import * as React from 'react'
import TableContent from "./TableContent";

import { Input } from "@yaris/components/ui/input"
import axios from "axios";
import { Transaction } from "@prisma/client";
interface TableProps {
    transactions: Transaction[] | null
};

function DataTable({ transactions }: TableProps) {
    const handleSteps = (pas: number) => {
        // On defini le pas actuel sur son numero correspondant ce qui lui donne cet arriere pla bleu
        setStep(pas)
        // Indice de départ pour extraire les transactions
        const startIndex = (pas - 1) * 15;
        // Indice de fin pour extraire les transactions
        const endIndex = startIndex + 15;

        // méthode slice pour extraire une tranche de 10 transactions
        const tranche = transactions?.slice(startIndex, endIndex);
        setData(tranche)
    }
    const [step, setStep] = React.useState(1)
    const [searchResult, setSearchResult] = React.useState<Transaction[] | undefined>([]);
    const [data, setData] = React.useState(transactions?.slice(0, 15))
    const [searchTimeout, setSearchTimeout] = React.useState(0);
    const [search, setSearch] = React.useState("");
    const handlesearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        clearTimeout(searchTimeout)
        setSearch(e.target.value)
        setSearchTimeout(
            Number(setTimeout(() => {
                const result = transactions?.filter(
                    (transaction) =>
                        transaction.from_address.toLowerCase() === search.toLowerCase() ||
                        transaction.amount.toLowerCase() === search.toLowerCase() ||   transaction.from_address.toLowerCase().includes(search.toLowerCase()) 
                )
                setSearchResult(result)
            }, 500))
        )
    }
    return (
        <div className="flex flex-col gap-4">
            <div className=" flex justify-end">
                <Input placeholder='Search by status or id' className='p-4 w-4/12' type='text' onChange={handlesearch} />
            </div>

            <Table className="font-medium ">
                <TableCaption>
                    List of transactions
                </TableCaption>
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
                <TableBody className="min-h-[1000px]">
                    {!transactions || !searchResult ? (<TableRow className=" h-[500px]     ">
                        <TableCell className="font-medium text-center"></TableCell>
                        <TableCell className="font-medium text-center"></TableCell>
                        <TableCell className="font-medium text-center"></TableCell>
                        <TableCell className="font-medium text-center"></TableCell>
                        <TableCell className="font-medium text-center"></TableCell>
                        <TableCell className="font-medium text-center"></TableCell>
                    </TableRow>) : null}
                    {search ? <TableContent data={searchResult} /> : <TableContent data={data} />}
                    {/* <TableContent data={data} /> */}
                </TableBody>
            </Table>
            <div className="flex gap-4 text-foreground items-center justify-center  w-full mx-auto">


                {
                    setps.map((numer, index) => <span key={numer.id} className={`w-6 h-6 shadow-2xl drop-shadow-lg ${step === numer.step ? "bg-[#1A75FF]" : ""} rounded-md flex items-center justify-center 
          cursor-pointer`} id={numer.step.toString()}>
                        {
                            numer.icon ? <numer.icon onClick={(e: any) => {
                                if (numer.id === 'prev' && step > 1) {
                                    handleSteps(step - 1)
                                }
                                else if (step >= 1 && step < 6 && numer.id === 'next') {
                                    handleSteps(step + 1)
                                }

                            }} className={` cursor-pointer h-6 w-6 ${index === 0 ? "rotate-180" : ""}`} /> : <p id={numer.step.toString()} className={`font-medium`}
                                onClick={(e: any) => handleSteps(Number(e.target.id))}
                            >{numer.step}</p>
                        }
                    </span>)
                }
            </div>
        </div>
    )
}
export default React.memo(DataTable)