import {
  IgetByInternational,
  TallFieldInternationalRelationsdatas,
  Tforminternational,
  international_relations_datasAttributes,
} from '@/interface/international_relations_datas.interface'
import Api from './Api'
import type { AxiosResponse } from 'axios'

type EditInternationalProps = {
  country_id: string
  ir_topic_id: string
  [key: string]: string
}

export const addInternationalDataRelationsTopicsService = async (
  payload: Omit<Tforminternational, 'event_date' | 'field_id'>,
) => {
  const response: AxiosResponse<international_relations_datasAttributes> =
    await Api.post(`/international_relations_dates`, payload)
  return response.data
}

export const getAllCountryInternationalDataRelationsTopicsServices =
  async (payload: { country_id?: string; search?: string }) => {
    const response: AxiosResponse<TallFieldInternationalRelationsdatas> =
      await Api.get(
        `/international_relations_dates/country/${payload.country_id || ''}${
          payload.search || ''
        }`,
      )
    return response.data
  }

export const getByInternationalDatasService = async (id: string) => {
  const response: AxiosResponse<IgetByInternational> = await Api.get(`international_relations_dates/${id}`)
  return response.data
}

export const editInternationalDatasService = async (payload: EditInternationalProps, id: string) => {
  const response: AxiosResponse = await Api.put(`international_relations_dates/${id}`, payload)
  return response.data
}