import { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { BaseQueryFn, QueryActionCreatorResult, QueryDefinition } from "@reduxjs/toolkit/query"

export type LabelType = string | React.JSX.Element
export interface Result {
  isSuccess: boolean
  isError: boolean
  [key: string]: any
}
export type Refetch = () => QueryActionCreatorResult<
  QueryDefinition<any, BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>, never, any[], string>
>
interface TypeEditObjectFormComponentArgs {
  obj: any
  refetch: Refetch
}
export type TypeEditObjectFormComponent = ({ obj, refetch }: TypeEditObjectFormComponentArgs) => JSX.Element
