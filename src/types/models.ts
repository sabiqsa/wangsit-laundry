export type UserRole = "admin" | "client";
export type OrderService = "cuciLipat" | "setrika" | "cuciSetrika";
export type OrderStatus = "Pending" | "Proses" | "Selesai" | "Lunas";
export type PaymentStatus = "unpaid" | "paid" | "pending";
export type PaymentMethod = "bayar_sekarang" | "bayar_nanti";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  clientId?: string;
  clientName: string;
  clientPhone?: string;
  services: OrderService[];
  kg: number;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  midtransToken?: string;
  estimatedCompletion: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPricing {
  cuciLipat: number;
  setrika: number;
  cuciSetrika: number;
}

export interface IEstimatedTime {
  cuciLipat: string;
  setrika: string;
  cuciSetrika: string;
}

export interface ISettings {
  _id: string;
  pricing: IPricing;
  estimatedTime: IEstimatedTime;
  adminPhone: string;
  storeName: string;
  updatedAt: string;
}

export const SERVICE_LABELS: Record<OrderService, string> = {
  cuciLipat: "Cuci Lipat",
  setrika: "Setrika",
  cuciSetrika: "Cuci + Setrika",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  Pending: "Menunggu",
  Proses: "Sedang Diproses",
  Selesai: "Selesai",
  Lunas: "Lunas",
};
