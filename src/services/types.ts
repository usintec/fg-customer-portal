export interface ILoginResponse {
  access_token: string
  expires_in: number
  token_type: string
  refresh_token: string
  scope: string
}

export interface IUserInfo {
  id?: string
  userId?: string
  phoneNumber?: string
  sub: string
  email: string
  name: string
  email_verified: boolean
}

export interface IOrganization {
  id: string
  organizationId: string
  uniqueRequestId: string
  parentOrganizationId: string
  organizationName: string
  organizationCode: string
  organizationCity: string
  organizationState: string
  organizationEmail: string
  organizationAddress: string
  organizationWebsite: string
  organizationContactPersonName: string
  organizationContactPersonEmail: string
  organizationContactPersonPhoneNumber: string
  organizationPhoneNumber: string
  adminUserInformation: AdminUserInformation
  organizationStatus: string
  createdOn?: Date
}

export interface AdminUserInformation {
  firstName: string
  lastName: string
  emailAddress: string
}

export interface ICreateAdmin {
  organizationId: string
  adminUserModel: Partial<IAdminUser>
}

export interface IAdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  username: string
  createdOn: string
}

export interface ErrorMessage {
  statusCode: number
  message: string
  errors: Errors
}

export interface Errors {
  generalErrors: string[]
}

export interface RootAPIResponse<T> {
  hasError: boolean
  value: T
  error: Error
}

export interface PaginatedResult<T> {
  currentPage: number
  pageCount: number
  pageSize: number
  totalRecords: number
  result: T[]
}

export interface AdminUser {
  firstName: string
  lastName: string
  emailAddress: string
}

export interface Error {
  errorCode: string
  message: string
  isTransient: boolean
  inner: string
  fullMessage: string
}

export interface ILookUp {
  id: string
  displayName: string
}

export interface INameValue {
  name: string
  value: string
}

export interface IPayableItem {
  organizationId: string
  uniqueRequestId: string
  payableItemModels: PayableItemModel[]
  createdOn: Date
}

export interface PayableItemModel {
  payableItemId: string
  name: string
  code: string
  currency: string
  currencyCode: string
  description: string
  priceType: string
  price: any
  priceRange: PriceRange
  vat: Vat
  stampDuty: StampDuty
  gifmisCode: string
  isLocked: boolean
  isPayable: boolean
  isTaxable: boolean
  isApproved: boolean
  organizationId: string
  quantity?: number
  additionalInformation: Record<string, any>
}

export interface PriceRange {
  min: string
  max: string
}

export interface StampDuty {
  fee: string
  isApplyable: boolean
}

export interface Vat {
  fee: number
  type: string
  maximumFee: number
  isApplyable: boolean
}

export interface addition {
  itemStrength: string
  itemInfo: string
  itemHandle: string
  itemSelect: string
  itemDescription: string
}

export interface itemDetail {
  itemName: string
  gifmisCode: string
  itemQty: string
  itemTax: string
  itemPrice: string
  total: string
  currencyCode: string
}

export interface Iinvoice {
  customerName: string
  dueDate: string
  phoneNo: string
  mobileNo: string
  billingAddress: string
  billingNo: string
  date: string
  amount: string
  organizationPhoneNo?: string
  organizationMobileNo?: string
  item: itemDetail[]
}

export interface IOption {
  label: string
  value: string
  organisationCode?: string
}

export interface ICustomerRead {
  id: string
  name: string
  phoneNumber: string
  email: string
}

export interface ICustomer {
  id: string
  name: string
  bvn: string
  nin: string
  email: string
  remarks: string
  website: string
  lastName: string
  firstName: string
  cacNumber: string
  companyName: string
  uniqueRequestId: string
  address: Address
  contactPersonName: string
  customerType: string
  phoneNumber: string
  countryCode: string
  billingAddress: BillingAddress
  token?: string
}

export interface Address {
  city: string
  state: string
  street: string
  country: string
  postalCode: string
}

export interface BillingAddress {
  city?: string
  state: string
  street: string
  country: string
  postalCode: string
}

export interface IBill {
  id: string
  note: string
  recurring: Recurring
  billId: string
  customerId: string
  dueDate: string
  billNumber: string
  lineItems: LineItems[]
  organisationId: string
  status?: string
  customerName?: string
  createdOn: string
  customerPhoneNumber?: string
  invoiceCount: number
}

export interface Recurring {
  label: string
  interval: number
  frequency: string
}

export interface LineItems {
  id: string
  tax: ItemTax
  quantity: string
  price: string
}

export interface ItemTax {
  type: string
  value: string
}

export interface Invoice {
  id: string
  tax: string
  status: string
  total: number
  dueDate: string
  subTotal: number

  currency: string
  createdDate: string
  proccesDate: string
  invoiceNumber: string
  priceAdjustments: PriceAdjustmentModel[]
  lineItems: LineItem[]

  customer?: ICustomer
  organisation?: {
    name: string
    email: string
    address: string
    logoUrl: string
    phoneNumber: string
  }
  bill: {
    billNumber: string
    dueDate: string
  }
  note?: string
  additionalInformation?: {}
  amountPaid?: number
  amountDue?: number
}
export interface IBillInvoiceModel {
  billNumber: string
  note: string
  dueDate: string
  customer: ICustomer
  lineItems: LineItem[]
  additionalInformation: {}
  organisation: {
    name: string
    email: string
    address: string
    logoUrl: string
    phoneNumber: string
  }
  invoices: Invoice[]
  status?: string
  isPartial: boolean
}

export interface LineItem {
  id: string
  tax: {
    type: string
    value: number
  }
  total: number
  subTotal?: number
  quantity: number
  price: number
  gifmisCode: string
  name: string
  description: string
}

export enum PriceAdjustmentStatus {
  'OLD' = 'old',
  'NEW' = 'new'
}
export interface PriceAdjustmentModel {
  id?: string
  description?: string
  amount?: string
  type?: string
  status?: PriceAdjustmentStatus
}
export interface IPayableItemActivation {
  uniqueRequestId?: string
  organizationId: string
  payableItemId: string
}
export interface ISearchOrgnisation {
  organizationId: string
  name: string
  code: string
  organizationEmail: string
}

export interface IPaymentProvider {
  name: string
  value: string
  keys: Keys
  logo: string
}

export interface Keys {
  reference: string
  transactionStatus: string
}

export interface IPayNowRequest {
  invoiceNumber: string
  paymentProvider: string
  paymentPortalUrl: string
  paymentPortalRedirectUrl: string
  isPartialPayment: boolean
  paymentAmount: number
  uniqueRequestId: string
}
export enum PAGE {
  CREATE_BILL = 'create_bill',
  INVOICES = 'invoices'
}
export interface ISearch {
  countryCode: string
  searchString: string
}
