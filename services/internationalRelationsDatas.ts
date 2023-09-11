import {
  IgetByInternational,
  TallFieldInternationalRelationsdatas,
  Tforminternational,
  international_relations_datasAttributes,
} from '@/interface/international_relations_datas.interface'
import Api from './Api'
import type { AxiosResponse } from 'axios'

export const addInternationalDataRelationsTopicsService = async (
  payload: Omit<Tforminternational, 'event_date' | 'field_id' | 'id'>,
) => {
  const response: AxiosResponse<international_relations_datasAttributes> =
    await Api.post(`/international_relations_dates`, payload)
  return response.data
}

export const getAllCountryInternationalDataRelationsTopicsServices =
  async (payload: { country_id?: string; search?: string }) => {
    const response: AxiosResponse<TallFieldInternationalRelationsdatas> =
      await Api.get(
        `/international_relations_dates/country/${payload.country_id || ''}${payload.search || ''
        }`,
      )
    return response.data
  }

export const getAllCountryTopicInternationalDataRelationsTopicsServices =
  async (payload: { country_id?: string; search?: string; topic_id?: string }) => {
    const response: AxiosResponse<TallFieldInternationalRelationsdatas> =
      await Api.get(
        `/international_relations_dates/country/${payload.country_id || ''}/topic/${payload.topic_id}${payload.search || ''
        }`,
      )
    return response.data
  }

export const getByInternationalDatasService = async (id: string) => {
  const response: AxiosResponse<IgetByInternational> = await Api.get(
    `international_relations_dates/${id}`,
  )
  return response.data
}

export const editInternationalDatasService = async (
  payload: unknown,
  id: string,
) => {
  const response: AxiosResponse = await Api.put(
    `international_relations_dates/${id}`,
    payload,
  )
  return response.data
}

export const removeByInternationalDatasService = async (id: string) => {
  const response: AxiosResponse<IgetByInternational> = await Api.delete(
    `international_relations_dates/${id}`,
  )
  return response.data
}
