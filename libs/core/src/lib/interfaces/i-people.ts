export interface ICustomerGetAllResponse {
  "id": string
  "fullName": string
  "phoneNumber": string
  "address": string
  "createdAt": Date,
  "totalQty": number
  "updatedAt": Date
}

export interface ISupplierGetAllResponse {
  "id": string
  "fullName": string
  "phoneNumber": string
  "address": string
  "type": string
  "createdAt": Date,
  "totalQty": number
  "updatedAt": Date
}

export interface IUserGetAllResponse {
  "id": string
  "fullName": string
  "username": string
  "role": string
  "isActive": boolean
  "createdAt": Date,
  "updatedAt": Date,
}
