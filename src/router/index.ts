import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import UiElement from '@/components/ui-elements/UiElement.vue'
import SelectBillOptionVue from '@/views/SelectBillOption.vue'
import PaymentWithBillNumberVue from '@/views/PaymentWithBillNumber.vue'
import PaymentWithoutBillNumberVue from '@/views/PaymentWithoutBillNumber.vue'
import InvoicePageVue from '@/views/InvoicePage.vue'
import PayAmountVue from '@/views/payment/PayAmount.vue'
import InvoiceListVue from '@/views/dashboard/InvoiceListVue.vue'
import CreateBill from '@/views/dashboard/CreateBillVue.vue'
import CreateBillNoAuth from '@/views/CreateBillVue.vue'
import RouteParent from '@/views/dashboard/RouteParent.vue'
import PaymentProviderVue from '@/components/payment/PaymentProvider.vue'
import PaymentConfirmVue from '@/components/payment/PaymentConfirm.vue'
import NotFoundVue from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '/',
          name: 'choose options',
          component: SelectBillOptionVue
        },
        {
          path: '/payment-with-bill-number',
          name: 'payment with bill number',
          component: PaymentWithBillNumberVue
        },
        {
          path: '/payment-with-out-bill',
          name: 'payment with out number',
          component: PaymentWithoutBillNumberVue
        },
        {
          path: '/invoice/:invoiceId/payment',
          name: 'Enter Amount',
          component: PayAmountVue
        },
        {
          path: '/invoice/:invoiceId/payment-providers',
          name: 'Select Payment Providers',
          component: PaymentProviderVue
        },
        {
          path: '/bill/:billId/invoice/:invoiceId/:provider/confirm-payment',
          name: 'Verify Payment Providers',
          component: PaymentConfirmVue
        }
      ]
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: RouteParent,
      children: [
        {
          path: '/dashboard',
          name: 'invoice-list',
          component: InvoiceListVue
        },
        {
          path: '/dashboard/create-bill',
          name: 'create-bill',
          component: CreateBill
        },
        {
          path: '/dashboard/invoice/:invoiceId',
          name: 'Invoice Page',
          component: InvoicePageVue
        },
        {
          path: '/dashboard/preview-invoice/:invoiceId',
          name: 'Preview Invoice Page',
          props: {preview: true},
          component: InvoicePageVue
        },
        {
          path: '/dashboard/ui-elements',
          name: 'ui-elements',
          component: UiElement
        }
      ]
    },
    {
      path: '/invoice/:invoiceId/amount',
      name: 'Payment Providers',
      props: { singleInvoice: true, noAuth: true },
      component: InvoicePageVue
    },
    {
      path: '/invoice/:invoiceId',
      name: 'Payment Providers No Auth',
      props: { noAuth: true },
      component: InvoicePageVue
    },
    {
      path: '/preview-invoice/:invoiceId',
      name: 'Preview Invoice Page No Auth',
      props: {preview: true, noAuth: true},
      component: InvoicePageVue
    },
    {
      path: '/create-bill',
      name: 'Create Bill No Auth',
      component: CreateBillNoAuth
    },
    {
      path: '/:catchAll(.*)',
      name: '404',
      component: NotFoundVue
    }
  ]
})

const protectedRoutes = ['/dashboard']

router.beforeEach((to, _, next) => {
  const protectedRoute = protectedRoutes.findIndex((d) => to.path?.toString().startsWith(d)) > -1
  if (protectedRoute && !localStorage.getItem('refreshToken')) next({ name: 'choose options' })
  else next()
})

router.afterEach((to, from, failure) => {
  if (failure) {
    console.error(to, from, failure)
  }
})

export default router
