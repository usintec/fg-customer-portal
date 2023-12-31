import { BaseService } from './BaseService'
import EnvironmentLoader from './EnvironmentLoader'
import UpdateToken from './UpdateToken'
import type { ILoginResponse, IUserInfo } from './types'

class LoginService extends BaseService {
  constructor() {
    super('connect')
  }

  readonly verify = async (userName: string, password: string): Promise<string> => {
    const body = new URLSearchParams()
    body.append('grant_type', 'password')
    body.append('client_id', EnvironmentLoader.getConfig().client_id)
    body.append('username', userName)
    body.append('password', password)
    const url = this.getUrl('token')
    const response = await this.doRequest<ILoginResponse>({
      url,
      method: 'POST',
      body,
      options: {
        text: false,
        contentType: 'application/x-www-form-urlencoded',
        noToken: true
      }
    })
    console.log(response)
    UpdateToken.saveToken(response)
    return response.access_token
  }

  readonly userInfo = async (): Promise<IUserInfo> => {
    const url = this.getUrl('userinfo')
    const response = await this.doRequest<IUserInfo>({
      url,
      method: 'GET',
      options: {
        text: false,
        contentType: 'application/x-www-form-urlencoded'
      }
    })
    return response
  }
}

export default new LoginService()
