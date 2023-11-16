import { BaseService } from './BaseService'
import type { INameValue, IPaymentProvider, Recurring, RootAPIResponse } from './types'

class LookupService extends BaseService {
  constructor() {
    super('lookups')
  }

  readonly vatTypes = async (): Promise<INameValue[]> => {
    const url = this.getUrl('vat-types')
    const response = await this.doRequest<RootAPIResponse<INameValue[]>>({
      url
    })
    return response.value
  }

  readonly currencies = async (): Promise<INameValue[]> => {
    const url = this.getUrl('currencies')
    const response = await this.doRequest<RootAPIResponse<INameValue[]>>({
      url
    })
    return response.value
  }
  readonly cites = async (state?: string): Promise<string[]> => {
    const url = this.getUrl(state ? `cities?state=${state}` : 'cities')
    const response = await this.doRequest<RootAPIResponse<string[]>>({
      url
    })
    return response.value
  }
  readonly states = async (): Promise<string[]> => {
    const url = this.getUrl('states')
    const response = await this.doRequest<RootAPIResponse<string[]>>({
      url
    })
    return response.value
  }

  readonly billFrequency = async (): Promise<Recurring[]> => {
    const url = this.getUrl('billing-frequency')
    const response = await this.doRequest<RootAPIResponse<INameValue[]>>({
      url
    })
    return response.value.map((c) => ({
      label: c.value,
      interval: 0,
      frequency: c.name
    }))
  }
  readonly billingTypes = async (): Promise<INameValue[]> => {
    const url = this.getUrl('billing-types')
    const response = await this.doRequest<RootAPIResponse<INameValue[]>>({
      url
    })
    return response.value
  }

  readonly dailcode = async (): Promise<string[]> => {
    const url = this.getUrl('dail-code')
    const response = await this.doRequest<RootAPIResponse<string[]>>({
      url,
      options: {
        noToken: true
      }
    })
    return response.value
  }

  readonly paymentMethods = async (): Promise<IPaymentProvider[]> => {
    const url = this.getUrl('payment-providers')
    const response = await this.doRequest<RootAPIResponse<IPaymentProvider[]>>({
      url,
      options: {
        noToken: true
      }
    })
    return response.value
  }
}

export default new LookupService()
