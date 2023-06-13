import { DataTable } from '@yaris/components/DataTable'
import { getData } from '@yaris/lib/utils';
import { db } from '@yaris/lib/db';
async function getTransaction() {
    const transactions = await db.transaction.findMany()
    return transactions
}
export default async function Dashboard({ }) {
    const data = await getData()
    console.log(data)
    // const data = await getTransaction()
    return (
        <div className=' bg-muted rounded-lg m-5 flex flex-col gap-8 p-12'>
            <h1 className='font-heading text-2xl'>Transactions</h1>
            <DataTable transactions={data.transactions} />
            {/* <DataTable /> */}
        </div>
    );
};



