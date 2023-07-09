import * as z from "zod";

export const transactionSchema= z.object({
    tx_hash:z.string().nullable(),
    amount:z.string(),
    from_address:z.string(),
    ordinal_inscription_id:z.string(),
    taproot_address:z.string(),
    id:z.number().optional(),
    completed:z.boolean().optional(),
})