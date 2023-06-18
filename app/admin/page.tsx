import DataTable  from '@yaris/components/DataTable'
import { getServerSession } from 'next-auth';
import { getData } from '@yaris/lib/utils';
import { authOptions } from '@yaris/lib/auth';
import { redirect } from 'next/navigation'
export default async function Dashboard({ }) {
    const   session = await getServerSession(authOptions)
    console.log(session)
    if(!session){
        redirect('/api/auth/signin')
    }
    const data = await getData()
    return (
        <div className=' bg-muted rounded-lg m-5 flex flex-col gap-8 p-12'>
            <h1 className='font-heading text-2xl'>Transactions</h1>
            
            <DataTable transactions={data.transactions} />
        </div>
    );
};

