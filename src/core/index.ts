import { Provider } from '../providers'
import { Socket } from 'net'
import RequestManager, {
  BatchManager,
  ProvidersInterface
} from './requestManager'
import Method, { MethodOptions } from './method'
import Subscription, { SubscriptionOptions } from './subscription'

class Core {
  static providers: ProvidersInterface = RequestManager.providers
  provider: Provider
  providers: ProvidersInterface
  requestManager: RequestManager
  BatchRequest: BatchManager

  constructor(provider: string | Provider, net?: Socket) {
    this.requestManager = new RequestManager()
    this.requestManager.setProvider(provider, net)

    this.providers = RequestManager.providers
    this.provider = this.requestManager.provider

    this.BatchRequest = BatchManager.bind(null, this.requestManager)
  }

  get currentProvider(): Provider {
    return this.provider
  }

  set currentProvider(value) {
    this.setProvider(value)
  }

  setProvider(provider: string | Provider, net?: Socket): void {
    this.requestManager.setProvider(provider, net)
    this.provider = this.requestManager.provider
  }

  buildCall(options: MethodOptions): (...args: any[]) => any {
    return Method({
      ...options,
      requestManager: this.requestManager
    })
  }

  subscribe(options: SubscriptionOptions): (...args: any[]) => Subscription {
    return (...args: any[]): any => {
      return new Subscription({
        ...options,
        requestManager: this.requestManager
      }).subscribe(...args)
    }
  }
}

export default Core
