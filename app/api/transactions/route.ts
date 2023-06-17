import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@yaris/lib/utils";
import { db } from "@yaris/lib/db";
import { StatusCodes } from 'http-status-codes';
import { transactionSchema } from "@yaris/lib/validation";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const payload = transactionSchema.parse(json);
    authenticate(req);

    const userExist = await db.user.findFirst({
      where: {
        address: payload.from_address,
      },
    });
    if (userExist) {
      const newTransaction =  await db.$transaction([db.user.create({
        data: {
          address: payload.from_address,
          transactions: {
            create: {
              amount: payload.amount,
              from_address: payload.from_address,
              taproot_address: payload.taproot_address,
              tx_hash: payload.tx_hash,
              ordinal_inscription_id: payload.ordinal_inscription_id,
            },
          },
        },
      })]);
      return NextResponse.json({ newTransaction }, { status: 201 });
    } else {
      const newTransaction = await db.user.create({
        data: {
          address: payload.from_address,
          transactions: {
            create: {
              amount: payload.amount,
              from_address: payload.from_address,
              taproot_address: payload.taproot_address,
              tx_hash: payload.tx_hash,
              ordinal_inscription_id: payload.ordinal_inscription_id,
            },
          },
        },
      });
      return NextResponse.json({ newTransaction }, { status: 201 });
    }
  } catch (error:any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues }, { status: 400 });
    } else {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
export async function GET(req: NextRequest) {
  try {
    authenticate(req);

    const transactions = await db.transaction.findMany();
    return NextResponse.json({ transactions }, { status: StatusCodes.OK });

  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
export async function PATCH(req: NextRequest) {
  try {
    const json = await req.json();
    const payload = transactionSchema.parse(json);
    authenticate(req);

    const newTransaction = await db.transaction.update({
      where: { id: payload.id },
      data: {
        amount: payload.amount,
        from_address: payload.from_address,
        taproot_address: payload.taproot_address,
        tx_hash: payload.tx_hash,
        completed: payload.completed,
        ordinal_inscription_id: payload.ordinal_inscription_id,
      },
    });
    return NextResponse.json({ newTransaction }, { status: 201 });
  } catch (error:any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    } else {
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const transactionId = searchParams.get("id");
    authenticate(req);
    if (!transactionId) {
      return NextResponse.json(
        { error: "Provide transaction id" },
        {
          status: 400,
        }
      );
    }
    const transaction = await db.transaction.findUnique({
      where: { id: Number(transactionId) },
    });
    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        {
          status: 404,
        }
      );
    }
    await db.transaction.delete({
      where: { id: Number(transactionId) },
    });

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
