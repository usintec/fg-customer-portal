import { BaseService } from './BaseService'
import type { IOrganization, RootAPIResponse, PaginatedResult } from './types'

class OrganizationService extends BaseService {
  constructor() {
    super('organizations')
  }

  readonly getAll = async (): Promise<IOrganization[]> => {
    const response = await this.doRequest<RootAPIResponse<PaginatedResult<IOrganization>>>({
      method: 'GET',
      options: {
        noToken: true
      }
    })
    return response.value.result
  }
}

export default new OrganizationService()
