import { NextRequest, NextResponse } from "next/server";
import { db } from "@yaris/lib/db";
import { TransactionInterface } from "@yaris/types/types";
import { transactionSchema } from "@yaris/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const payload = transactionSchema.parse(json);
    const secret = process.env.NEXT_PUBLIC_SECRET_HEADER;
    if (secret !== req.headers.get("authorization")) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 403 }
      );
    }

    const userExist = await db.user.findFirst({
      where: {
        address: payload.from_address,
      },
    });
    if (userExist) {
      const newTransaction = await db.transaction.create({
        data: {
          user: { connect: { id: userExist.id } },
          amount: payload.amount,
          from_address: payload.from_address,
          tape_route_address: payload.tape_route_address,
          tx_hash: payload.tx_hash,
          ordinal_inscription_id: payload.ordinal_inscription_id,
        },
      });
      return NextResponse.json({ newTransaction }, { status: 201 });
    } else {
      const newTransaction = await db.user.create({
        data: {
          address: payload.from_address,
          transactions: {
            create: {
              amount: payload.amount,
              from_address: payload.from_address,
              tape_route_address: payload.tape_route_address,
              tx_hash: payload.tx_hash,
              ordinal_inscription_id: payload.ordinal_inscription_id,
            },
          },
        },
      });
      return NextResponse.json({ newTransaction }, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
export async function GET(req: NextRequest) {
  try {
    const secret = process.env.NEXT_PUBLIC_SECRET_HEADER;
    if (secret !== req.headers.get("authorization")) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 403 }
      );
    }

    const transactions = await db.transaction.findMany();
    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
export async function PATCH(req: NextRequest) {
  try {
    const json = await req.json();
    const payload = transactionSchema.parse(json);
    const secret = process.env.NEXT_PUBLIC_SECRET_HEADER;
    if (secret !== req.headers.get("authorization")) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 403 }
      );
    }

    const newTransaction = await db.transaction.update({
      where: { id: payload.id },
      data: {
        amount: payload.amount,
        from_address: payload.from_address,
        tape_route_address: payload.tape_route_address,
        tx_hash: payload.tx_hash,
        completed: payload.completed,
        ordinal_inscription_id: payload.ordinal_inscription_id,
      },
    });
    return NextResponse.json({ newTransaction }, { status: 201 });
  } catch (error) {
    return NextResponse.json(error  , { status: 500 });
  }
}
