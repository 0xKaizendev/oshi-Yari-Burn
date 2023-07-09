import React from 'react';
export default function page({ }) {
    return (
        <div className='  flex flex-col   pt-16 gap-4 container text-left'>
            <h1 className='text-3xl font-heading  text-foreground mt-10 '>
                To make a transfer inscription, follow these steps:</h1>
            <ul className='font-medium lg:macx-w-5xl leading-loose  list-disc'>
                <li className=' pl-3 '>Go to <a href="https://looksordinal.com/" className='underline underline-offset-2 font-semibold' target='_blank'>https://looksordinal.com/</a>.</li>
                <li className=' pl-2 '>Copy and Paste the multisig address <span className='font-semibold block  address'>bc1q50rzva0tw43hc4h9ez644wx30fvhmndey8xe7zcspy2euk0r3q9s7e39c3</span> into the &quot;Enter a BTC address from an ordinal wallet&quot; field.</li>
                <li className=' pl-2 '>Click on the BRC-20 transfer inscription,
                    scroll down and enter the ticker (yari) and the amount you previously entered on the Yari Finance bridge interface.</li>
                <li className=' pl-2 '>Select a fee rate (mid is fine) and set the padding to 10000 sats.</li>
                <li className=' pl-2 '>Proceed to pay for the transfer inscription. Make the payment to the provided address after clicking &quot;Inscribe.&quot;</li>
                <li className=' pl-2 '>After completing the payment correctly, you can view the indexed transfer inscriptions at <a className='address underline underline-offset-2 font-semibold' target='_blank' href="https://unisat.io/brc20?q=bc1q50rzva0tw43hc4h9ez644wx30fvhmndey8xe7zcspy2euk0r3q9s7e39c3&tick=yari">https://unisat.io/brc20?q=bc1q50rzva0tw43hc4h9ez644wx30fvhmndey8xe7zcspy2euk0r3q9s7e39c3&tick=yari</a>.</li>
                <li className=' pl-2 '>Paste the ID of your transfer inscription and bridge your Yari! 
                    </li>
            </ul>
            <p>That&apos;s it! Follow these steps to successfully complete the transfer inscription process using <a href="https://looksordinal.com/" className='underline underline-offset-2 font-semibold' target='_blank'>https://looksordinal.com/</a></p>
        </div>
    );
};
