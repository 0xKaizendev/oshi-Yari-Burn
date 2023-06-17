import * as z from "zod";

export const transactionSchema= z.object({
    tx_hash:z.string().nullable(),
    amount:z.string(),
    from_address:z.string(),
    ordinal_inscription_id:z.string().nullable().optional(),
    taproot_address:z.string().nullable().optional(),
    id:z.number().optional(),
    completed:z.boolean().optional(),
})