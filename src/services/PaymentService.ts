import { BaseService } from './BaseService'
import type { RootAPIResponse } from './types'

interface IBody {
  status: string
  provider: string
  reference: string
}

export interface VerifyRes {
  message: string
  paymentStatus: string
}

class PaymentService extends BaseService {
  constructor() {
    super('payments')
  }

  readonly verifyPayment = async (data: IBody): Promise<VerifyRes> => {
    const url = this.getUrl('verify')
    const response = await this.doRequest<RootAPIResponse<VerifyRes>>({
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

export default new PaymentService()
