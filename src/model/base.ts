// base response model
export type BaseResp<T> = {
  code: string
  message: string
  data: T
}

export type BasePaginatorResp<T> = BaseResp<{
  list: Array<T>
  paginator: {
    total_page: number
    total_record: number
    current_page: number
    page_size: number
  }
}>
