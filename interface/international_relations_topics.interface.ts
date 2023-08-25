export interface international_relations_topicsAttributes {
  data: {
    id: string
    name: string
    guide_line_specific_field?: object
    last_node?: boolean
    parent_id?: string
    sort?: number
    is_use: boolean
    created_by?: string
    created_date?: Date
    updated_by?: string
    updated_date?: Date
    children: international_relations_topicsAttributes[] | []
  }
}

export type TMapReason = {
  topic_reason_name: string
  sub_reason_name: Array<{ name: string; value: string }>
}[]