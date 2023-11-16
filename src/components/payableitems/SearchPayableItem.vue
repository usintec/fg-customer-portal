<script setup lang="ts">
import TypeHead from '@/components/inputs/typehead/TypeHead.vue'
import { type PayableItemModel, type IOption } from '@/services/types'
import { computed, ref, watch } from 'vue'
import PayableDynamicForm from './PayableDynamicForm.vue'

const props = defineProps<{ class?: string; payableItems: PayableItemModel[] }>()

const emit = defineEmits<{
  (e: 'onRowClick', value: PayableItemModel): void
}>()

const text = ref('')
const loading = ref(false)
const payableItemsList = ref<PayableItemModel[]>([])
const showForm = ref(false)
const payableItemId = ref('')
const additionalInformation = ref<Record<string, any>>({})

watch(text, async (value) => {
  loading.value = true
  payableItemsList.value = []
  if (text.value) {
    props.payableItems.forEach((item) => {
      console.log(item.name)
      if (item.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())) {
        console.log(item)
        payableItemsList.value.push(item)
      }
    })
  }
  loading.value = false
})

const mapper = (item: PayableItemModel) => {
  return {
    label: `${item.name} - ${item.gifmisCode}`,
    value: item.payableItemId
  }
}

const options = computed({
  get() {
    return props.payableItems.map(mapper)
  },
  set(value) {
    console.log(value)
  }
})
const searchOptions = computed({
  get() {
    return payableItemsList.value.map(mapper)
  },
  set(value) {
    console.log(value)
  }
})

const onRowClick = (v: IOption) => {
  const item = props.payableItems.find((c) => c.payableItemId === v.value)
  if (!item) return
  emit('onRowClick', item)
  if (Object.keys(item.additionalInformation ?? {}).length > 0) {
    additionalInformation.value = item.additionalInformation
    payableItemId.value = item.payableItemId
    showForm.value = true
  }
  text.value = ''
}
</script>
<template>
  <TypeHead
    label="Search and Add Items"
    important
    :value="text"
    :options="text ? searchOptions : options"
    @onChange="(value) => (text = value)"
    placeholder="Search"
    :class="props.class"
    @onRowSelect="onRowClick"
    :loading="loading"
  />
  <PayableDynamicForm
    :show="showForm"
    :form="additionalInformation"
    :id="payableItemId"
    @close="() => (showForm = false)"
  />
</template>
