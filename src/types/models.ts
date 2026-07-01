export type UserRole = "admin" | "client";
export type OrderService = "cuciLipat" | "setrika" | "cuciSetrika";
export type OrderStatus = "Pending" | "Proses" | "Selesai" | "Lunas" | "Dibatalkan";
export type PaymentStatus = "unpaid" | "paid" | "pending";
export type PaymentMethod = "bayar_sekarang" | "bayar_nanti";
export type DeliveryType = "jemput_antar" | "ambil_sendiri";

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
  actualKg?: number;
  kgConfirmed: boolean;
  kgPhotoUrl?: string;
  totalPrice: number;
  discountAmount: number;
  promoCode?: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  deliveryType: DeliveryType;
  deliveryAddress?: string;
  midtransToken?: string;
  estimatedCompletion: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPromo {
  _id: string;
  code: string;
  name: string;
  discountType: "flat" | "percent";
  discountValue: number;
  minOrderAmount: number;
  maxUsage?: number;
  usageCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
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

export interface IStoreHours {
  open: string;
  close: string;
}

export interface ISettings {
  _id: string;
  pricing: IPricing;
  estimatedTime: IEstimatedTime;
  adminPhone: string;
  storeName: string;
  storeHours: IStoreHours;
  deliveryFee: number;
  deliveryEnabled: boolean;
  updatedAt: string;
}

export const SERVICE_LABELS: Record<OrderService, string> = {
  cuciLipat: "Cuci Lipat",
  setrika: "Setrika",
  cuciSetrika: "Cuci + Setrika",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  Pending: "Menunggu",
  Proses: "Diproses",
  Selesai: "Selesai",
  Lunas: "Selesai",
  Dibatalkan: "Dibatalkan",
};
