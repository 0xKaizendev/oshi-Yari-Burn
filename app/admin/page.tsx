import DataTable  from '@yaris/components/DataTable'
import { db } from '@yaris/lib/db';
export default async function Dashboard({ }) {
    const transactions = await db.transaction.findMany()
    return (
        <div className=' bg-muted rounded-lg m-5 flex flex-col gap-8 p-12'>
            <h1 className='font-heading text-2xl'>Transactions</h1>
            
            <DataTable transactions={transactions} />
        </div>
    );
};

