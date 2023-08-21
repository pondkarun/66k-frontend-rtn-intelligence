import { AxiosResponse } from 'axios'
import Api from './Api'
import {
  TallFieldInternationalRelationsdatas,
  Tforminternational,
  international_relations_datasAttributes,
} from '@/interface/international_relations_datas.interface'

export const addInternationalDataRelationsTopicsService = async (
  payload: Omit<Tforminternational, 'event_date'>,
) => {
  const response: AxiosResponse<international_relations_datasAttributes> =
    await Api.post(`/international_relations_dates`, payload)
  return response.data
}

export const getAllCountryInternationalDataRelationsTopicsServices = async (
  country_id: string,
) => {
  const response: AxiosResponse<TallFieldInternationalRelationsdatas> = await Api.get(
    `/international_relations_dates/country/${country_id}`,
  )
  return response.data
}
