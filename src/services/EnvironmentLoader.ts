import { localHostConfig } from '@/config/environments/localhost'
import { netlifyConfig } from '@/config/environments/netlify'
import { type IEnvironmentConfig } from '@/config/environments/types'

export const envMap: { [host: string]: IEnvironmentConfig } = {
  [localHostConfig.host]: localHostConfig,
  [netlifyConfig.host]: netlifyConfig
}

class EnvironmentLoader {
  private config!: IEnvironmentConfig

  constructor() {
    this.initializeEnvironment(window.location.host)
  }

  public readonly initializeEnvironment = (host: string) => {
    const selectedEnvironmentConfig = envMap[host]
    if (!selectedEnvironmentConfig && !this.hostLocalIp(host)) {
      throw new Error(`No config found for host: ${host}`)
    }
    this.config = selectedEnvironmentConfig ?? localHostConfig
  }

  private hostLocalIp = (host: string): boolean => {
    return host.startsWith('192.168')
  }

  public readonly getConfig = () => this.config
}

export default new EnvironmentLoader()
