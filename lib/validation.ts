import * as z from "zod";

export const transactionSchema= z.object({
    tx_hash:z.string(),
    amount:z.string(),
    from_address:z.string(),
    ordinal_inscription_id:z.string(),
    tape_route_address:z.string(),
    id:z.number().optional(),
    completed:z.boolean().optional(),
})