import { BaseService } from './BaseService'
import type {
  RootAPIResponse,
  IBillInvoiceModel,
  ICustomer,
  ISearchOrgnisation,
  PayableItemModel,
  IBill,
  PaginatedResult,
  Invoice,
  IPayNowRequest,
  ISearch,
  IUserInfo
} from './types'
class CustomerService extends BaseService {
  constructor() {
    super('customers')
  }
  readonly getBill = async (billNo: string): Promise<IBillInvoiceModel | null> => {
    const url = this.getUrl(`/bills/${billNo.trim()}`)
    try {
      const response = await this.doRequest<RootAPIResponse<IBillInvoiceModel>>({
        url,
        options: {
          noToken: true
        }
      })
      return response.value
    } catch (error) {
      return null
    }
  }

  readonly getInvoice = async (invoiceNo: string): Promise<IBillInvoiceModel> => {
    const url = this.getUrl(`/invoices/${invoiceNo}`)
    const res = await this.doRequest<RootAPIResponse<IBillInvoiceModel>>({
      url
    })
    return res.value
  }

  readonly create = async (data: Partial<ICustomer>) => {
    const url = this.getUrl('signup')
    const response = await this.doRequest<RootAPIResponse<ICustomer>>({
      url,
      method: 'POST',
      body: this.uniqueRequestGUID(data),
      options: {
        noToken: true
      }
    })
    return response
  }

  readonly login = async (data: Partial<ICustomer>) => {
    const url = this.getUrl('sendToken')
    const response = await this.doRequest<RootAPIResponse<ICustomer>>({
      url,
      method: 'POST',
      body: this.uniqueRequestGUID(data),
      options: {
        noToken: true
      }
    })
    return response
  }
  readonly searchPayableItem = async (organizationId: string) => {
    const url = this.getUrl(`organizations/${organizationId}/payableitems/search`)
    const response = await this.doRequest<RootAPIResponse<PayableItemModel[]>>({
      url,
      method: 'GET',
      options: {
        noToken: true
      }
    })
    return response.value
  }

  readonly searchOrganisation = async (searchTerm: string) => {
    const url = this.getUrl(`organizations/search?SearchTerm=${searchTerm}`)
    const response = await this.doRequest<RootAPIResponse<ISearchOrgnisation[]>>({
      url,
      method: 'GET',
      options: {
        noToken: true
      }
    })
    return response.value
  }

  readonly createBill = async (
    body: Partial<IBill>,
    preview = false
  ): Promise<IBillInvoiceModel> => {
    const url = this.getUrl(`bills?preview=${preview}`)
    const response = await this.doRequest<RootAPIResponse<IBillInvoiceModel>>({
      url,
      method: 'POST',
      body,
      options: {
        noToken: true
      }
    })
    return response.value
  }

  readonly update = async (data: Partial<ICustomer>, customerId: string) => {
    const url = this.getUrl(`${customerId}`)
    const response = await this.doRequest<RootAPIResponse<ICustomer>>({
      url,
      method: 'PUT',
      body: this.uniqueRequestGUID(data),
      options: {
        noToken: true
      }
    })
    return response.value
  }

  readonly getCustomerInvoices = async (customerId: string): Promise<Invoice[]> => {
    const url = this.getUrl(`${customerId}/invoices`)
    const response = await this.doRequest<RootAPIResponse<PaginatedResult<Invoice>>>({
      url,
      method: 'GET',
      options: {}
    })
    return response.value.result
  }

  readonly getCustomerDetails = async (customerId: string) => {
    const url = this.getUrl(`${customerId}`)
    const response = await this.doRequest<RootAPIResponse<ICustomer>>({
      url,
      method: 'GET',
      options: {
        noToken: true
      }
    })
    return response.value
  }

  readonly payBill = async (data: IPayNowRequest): Promise<string> => {
    const url = this.getUrl(`pay-now`)
    const response = await this.doRequest<
      RootAPIResponse<{
        paymentRedirectUrl: 'string'
      }>
    >({
      url,
      method: 'POST',
      body: this.uniqueRequestGUID(data),
      options: {
        noToken: true
      }
    })
    return response.value.paymentRedirectUrl
  }

  readonly searchCustomer = async (data: Partial<ISearch>) => {
    const url = this.getUrl('search')
    const response = await this.doRequest<RootAPIResponse<IUserInfo[]>>({
      url,
      method: 'POST',
      body: this.uniqueRequestGUID(data),
      options: {
        noToken: true
      }
    })
    return response.value
  }
}

export default new CustomerService()
