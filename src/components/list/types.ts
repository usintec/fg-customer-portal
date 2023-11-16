export interface IListColumn<T> {
  id: string
  name: string
  dataFiled: keyof T
  isSortable?: boolean
  isFilterable?: boolean
  cell?: boolean
  width: number
}

export interface IListState<T> {
  perPage: number
  page: number
  data: T[]
  totalPage: number
  hover?: number
}
