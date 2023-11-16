import type { IEnvironmentConfig } from './types'

export const netlifyConfig: IEnvironmentConfig = {
  host: 'fg-customer.netlify.app',
  client_id: 'revassure.customer',
  grant_type: 'password',
  baseUrl: 'https://api.normsmiway.com/revassure',
  tenant: 'Customer'
}
