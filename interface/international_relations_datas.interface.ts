import { TMapReason } from './international_relations_topics.interface'

export interface international_relations_datasAttributes {
  data: {
    id: string
    name: string
    guide_line_specific_field: Array<InternationalRelationsdatasField>
    last_node: boolean
    parent_id: string
    sort: string
    is_use: boolean
    created_by: null
    created_date: null
    updated_by: string
    updated_date: Date
    parent: InternationalRelationsdatasFieldParent
  }
}

export type Tforminternational = {
  id: string
  event_date: { 0: Date; 1: Date }
  event_name: string
  event_venue?: string
  leader_name_thai?: string
  leader_name_foreign?: string
  event_date_end: string
  event_date_start: string
  specific_field: {
    reason: TMapReason
  }
  file_documents: Array<{ name: string; url: string }>
  image_documents: Array<{ name: string; url: string }>
  ir_topic_id: string
  country_id: string
  ir_topic_breadcrumb: null
}

export type InternationalRelationsdatasField = {
  groups: string
  value: string[]
}

export type InternationalRelationsdatasFieldParent = {
  id: string
  name: string
  guide_line_specific_field: null
  last_node: boolean
  parent_id: null
  sort: string
  is_use: boolean
}

export type TfieldInternationdata = {
  id: string
  is_use: boolean
  created_by: string
  created_date: Date
  updated_by: string
  updated_date: Date
  toppic_name?: string
  ir_topic: {
    id: string
    name: string
    last_node: true
    parent_id: string
    sort: string
    is_use: boolean
  }
} & Omit<Tforminternational, 'event_date'>

export type TallFieldInternationalRelationsdatas = {
  data: TfieldInternationdata
}

export type IgetByInternational = {
  data: Tforminternational
}
