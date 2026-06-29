declare module "midtrans-client" {
  interface SnapConfig {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }

  interface TransactionDetails {
    order_id: string;
    gross_amount: number;
  }

  interface CustomerDetails {
    first_name?: string;
    email?: string;
    phone?: string;
  }

  interface TransactionParameter {
    transaction_details: TransactionDetails;
    customer_details?: CustomerDetails;
    enabled_payments?: string[];
    [key: string]: unknown;
  }

  interface TransactionResult {
    token: string;
    redirect_url: string;
  }

  class Snap {
    constructor(config: SnapConfig);
    createTransaction(parameter: TransactionParameter): Promise<TransactionResult>;
  }

  export { Snap };
}
