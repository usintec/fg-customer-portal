import { defineStore } from 'pinia'
import type { IBill, IBillInvoiceModel, Invoice } from '@/services/types'
import CustomerService from '@/services/CustomerService'

interface State {
  bill: Partial<IBill>
  billInvoice: IBillInvoiceModel | null
  detailBillId?: string
  previewBill: Partial<IBill>
}

export const useBillStore = defineStore('billStore', {
  state: () =>
    ({
      bill: {}
    }) as State,
  actions: {
    storePreviewBill(activeBill: Partial<IBill>) {
      this.previewBill = activeBill
    },
    async refreshBill() {
      if (this.billInvoice?.billNumber) {
        const _bill = await CustomerService.getBill(this.billInvoice.billNumber ?? '')
        if (_bill) {
          this.setBillInvoice(_bill)
        }
      }
    },
    storeBill(activeBill: Partial<IBill>) {
      this.bill = activeBill
    },
    setBillInvoice(billInvoice: IBillInvoiceModel | null) {
      this.billInvoice = billInvoice
    },
    clearBill() {
      this.bill = {}
    },
    setDetailBill(bill: string) {
      this.detailBillId = bill
    },
    getInvoice(id: string) {
      return this.billInvoice?.invoices.find((invoice) => invoice.id === id)
    },
    convertInvoiceToBill(invoice: Invoice | undefined) {
      if (invoice && invoice.customer && invoice.organisation) {
        const bill: IBillInvoiceModel = {
          billNumber: invoice.bill.billNumber ?? '',
          note: invoice.note ?? '',
          dueDate: invoice.dueDate ?? '',
          customer: invoice.customer,
          additionalInformation: invoice.additionalInformation ?? '',
          organisation: invoice.organisation,
          invoices: [invoice],
          status: invoice.status,
          lineItems: [],
          isPartial: false
        }
        this.billInvoice = bill
      }
    }
  }
})
