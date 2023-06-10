import React, { useState, useEffect } from 'react';
import { TransactionInterface } from '@yaris/types/types';
import {DataTable} from '@yaris/components/DataTable'
// import axios from 'axios';
const getTx= async ()=>{
    // const transactions = await axios.get('/api/save', {
    //     headers: {
    //         Authorization: process.env.NEXT_PUBLIC_SECRET_HEADER
    //     }
    // })
    const data = await fetch('http://localhost:3000/api/transactions',{
        headers: {
            method: "GET", 
            "Content-Type": "application/json",
            "Authorization":process.env.NEXT_PUBLIC_SECRET_HEADER!
          },
          cache:'force-cache'
    })
    return data.json()
}

const Dashboard = async ({ }) => {
   const data = await getTx()
    return (
        <div className=' bg-muted rounded-lg m-5 flex flex-col gap-8 p-12'>
            <h1 className='font-heading text-2xl'>Transactions</h1>
            <DataTable transactions={data.transactions}/>
            {/* <DataTable /> */}
        </div>
    );
};
export default Dashboard


