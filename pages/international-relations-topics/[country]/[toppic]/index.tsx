import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Layout from '@/components/layout'
import {
  setSelectCountry,
  setSelectToppic,
} from '@/redux/actions/toppicMenuActions'
import InternationalRelationsTopics from '@/components/page/international-relations-topics/country'

const AddInternationalRelationsTopics = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { country, toppic }: { country?: string; toppic?: string } =
    router.query

  useEffect(() => {
    if (country && toppic) {
      dispatch(setSelectToppic(toppic))
      dispatch(setSelectCountry(country))
    }
  }, [country, toppic])
  return (
    <Layout>
      <InternationalRelationsTopics />
    </Layout>
  )
}

export default AddInternationalRelationsTopics
