export interface IFinancialPaymentResponse
{
  "isSuccess": boolean
  "paymentId": string
}

export interface IFinancialPaymentSuccessResponse
{
  "receivedFrom": string
  "description": string
  "totalAmount": number
  "methods": string[]
  "date": Date
}

export interface IFinancialReceipts
{
  "id": string
  "receivedFrom": string
  "fullName": string
  "description": string
  "totalAmount": number
  "updateAt": Date
}

export interface IFinancialAccountsTblResponse
{
  "id": string
  "fullName": string
  "description": string
  "totalAmount": number
  "expirationAt": Date
}

export interface IAccountsReceivedCardResponse
{
  "toReceiveAmount": number
  "toReceiveQty": number
  "dueSoonAmount": number
  "dueSoonQty": number
  "overdueAmount": number
  "overdueQty": number
  "receivedAmount": number
  "receivedQty": number
}

export interface IAccountsPayableCardResponse
{
  "toPayQty": number;
  "toPayAmount": number;
  "dueSoonQty": number;
  "dueSoonAmount": number;
  "overdueQty": number;
  "overdueAmount": number;
  "paidQty": number;
  "paidAmount": number;
}

export interface IAccountsBalanceCardResponse
{
  "total": number;
  "bci": number;
  "cash": number;
  "eMola": number;
  "mPesa": number;
}

export interface IAccountsBalanceTblResponse
{
  "origin": string
  "destination": string
  "totalAmount": number
  "transactionFee": number
  "createdAt": Date
}

export interface IFinancialStudentTblResponse
{
  "id": string
  "description": string
  "methods": string[]
  "totalAmount": number
  "date": Date
  "status": boolean
}

export interface IFinancialTuitionTblResponse
{
  "fullName": string
  "level": string
  "modality": string
  "package": string
  "amount": number
  "description": string
  "status": string
  "createdAt": Date
}

export interface IFinancialTuitionChartResponse
{
  "date": string[]
  "expected": number[]
  "received": number[]
  "fee": number[]
}
