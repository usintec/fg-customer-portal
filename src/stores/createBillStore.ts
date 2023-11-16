import { defineStore } from 'pinia'
import type {
  IBill,
  IBillInvoiceModel,
  ICustomerRead,
  LineItem,
  PayableItemModel,
  IOption
} from '@/services/types'
import { usePayableItems } from './payableItemStore'

interface State {
  customer: ICustomerRead | null
  state: Partial<IBill>
  errorMessage?: Partial<IBill>
  payableItems: PayableItemModel[]
  type: string,
  selectedOrganisation: IOption | null
}

export const useCreateBillStore = defineStore('createBillStore', {
  state: () =>
    ({
      customer: null,
      state: {},
      errorMessage: undefined,
      payableItems: [],
      type: 'OneOff',
      selectedOrganisation: null
    }) as State,
  actions: {
    setState(key: keyof IBill, value: any) {
      this.state = { ...this.state, [key]: value }
      this.errorMessage = { ...this.errorMessage, [key]: undefined }
    },
    setErrorMessage(key: keyof IBill, message: string) {
      this.errorMessage = { ...this.errorMessage, [key]: message }
    },
    customerClick(v: ICustomerRead) {
      this.customer = v
      this.setState('customerId', v.id)
    },
    removeCustomer() {
      this.customer = null
      this.setState('customerId', '')
    },
    setOrganisation(option: IOption){
      this.selectedOrganisation = option
    },
    pushPayableItem(item: PayableItemModel) {
      const store = usePayableItems()
      const itemFound = this.payableItems.find((i) => i.payableItemId === item.payableItemId)
      if (itemFound) return
      this.setErrorMessage('lineItems', '')
      this.payableItems.push(item)
      store.pushItem(item)
    },
    removeItem(id: string) {
      const store = usePayableItems()
      this.payableItems = this.payableItems.filter((i) => i.payableItemId !== id)
      store.removeItem(id)
    },
    setType(type: string) {
      this.type = type
    },
    fromBill(bill: IBillInvoiceModel, items: PayableItemModel[]) {
      const store = usePayableItems()

      const lineItem = (item: LineItem): PayableItemModel | undefined => {
        const _item = store.originalItems.find((i) => i.payableItemId === item.id)
        if (_item) {
          _item.quantity = item.quantity
          this.pushPayableItem(_item)
          return _item
        }
        return undefined
      }

      store.setOriginalItems(items)
      this.customerClick(bill.customer)
      const _bill = bill as unknown as IBill
      this.state = { ...this.state, ..._bill }
      bill.lineItems.map(lineItem)
      this.type = 'OneOff'
    },
    clear() {
      const store = usePayableItems()
      this.customer = null
      this.state = {}
      this.errorMessage = undefined
      this.payableItems = []
      this.type = 'OneOff'
      store.clearAll()
    },
    clearPayableItems(){
      const store = usePayableItems()
      this.payableItems = []
      store.clearAll()
    },
    clearSelectedOrganisation(){
      this.selectedOrganisation = null
    }
  }
})
