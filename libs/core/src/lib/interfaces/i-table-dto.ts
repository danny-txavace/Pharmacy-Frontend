export interface ITableParams {
  "value": string
}

export interface ITableParamsArray {
  "value"?: string[]
}

export interface ITableStatus {
  'true': { 'label': string, 'color': string };
  'false': { 'label': string, 'color': string };
}

export type PaymentStatus = 'cancelled' | 'overdue' | 'paid' | 'pending';
export interface ITableMapPymtStatus {
  'cancelled': { 'label': string, 'color': string }
  'overdue': { 'label': string, 'color': string }
  'paid': { 'label': string, 'color': string }
  'pending': { 'label': string, 'color': string }
}

export interface ITablePaymentMethods {
  'cash': { 'label': string, 'color': string };
  'eMola': { 'label': string, 'color': string };
  'mPesa': { 'label': string, 'color': string };
}
