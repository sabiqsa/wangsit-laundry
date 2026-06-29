import MidtransClient from "midtrans-client";

export interface CreateTransactionParams {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
}

let snapInstance: MidtransClient.Snap | null = null;

function getSnapClient(): MidtransClient.Snap {
  if (!snapInstance) {
    snapInstance = new MidtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.MIDTRANS_CLIENT_KEY!,
    });
  }
  return snapInstance;
}

export async function createMidtransTransaction(
  params: CreateTransactionParams
): Promise<{ token: string; redirectUrl: string }> {
  const snap = getSnapClient();

  const parameter = {
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.amount,
    },
    customer_details: {
      first_name: params.customerName,
      email: params.customerEmail || "customer@wangsit.id",
      phone: params.customerPhone || "",
    },
    enabled_payments: ["qris", "gopay", "bank_transfer"],
  };

  const transaction = await snap.createTransaction(parameter);
  return {
    token: transaction.token,
    redirectUrl: transaction.redirect_url,
  };
}

export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
): boolean {
  const crypto = require("crypto");
  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const expected = crypto
    .createHash("sha512")
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest("hex");
  return expected === signatureKey;
}
