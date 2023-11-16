import type { IEnvironmentConfig } from './types'

export const localHostConfig: IEnvironmentConfig = {
  host: 'localhost:5173',
  client_id: 'revassure.customer',
  grant_type: 'password',
  baseUrl: 'https://api.normsmiway.com/revassure',
  tenant: 'Customer'
}
