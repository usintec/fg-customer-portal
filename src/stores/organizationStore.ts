import { defineStore } from 'pinia'
import type { IOrganization, PayableItemModel } from '@/services/types'

interface IState {
  organization?: IOrganization
  fg_id?: string,
  organisationPayableItems: PayableItemModel[]
}

export const useOrganizationStore = defineStore('organization', {
  state: () =>
    ({
      organization: undefined,
      fg_id: undefined,
      organisationPayableItems: []
    }) as IState,
  actions: {
    setOrganization(organization: IOrganization) {
      this.organization = organization
    },
    setOrganisationPayableItems(payableItems: PayableItemModel[]){
      this.organisationPayableItems = payableItems
    },
    clearOrganization() {
      this.organization = undefined
    },
    getId() {
      return this.organization?.organizationId ?? ''
    },
    setFgId(id: string) {
      this.fg_id = id
    },
    clearOrganisationPayableItems(){
      this.organisationPayableItems = []
    }
  }
})
