import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import Layout from '@/components/layout'
import {
  setSelectCountry,
  setSelectToppic,
} from '@/redux/actions/toppicMenuActions'
//#region -> styled

//#endregion

const AddInternationalRelationsTopics = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const {
    country,
    toppic,
    id,
    mode = 'view',
  }: {
    country?: string
    toppic?: string
    id?: string
    mode?: 'view' | 'edit'
  } = router.query
  const [modeData, setModeData] = useState('view')

  useEffect(() => {
    if (country && toppic && id) {
      console.log('country :>> ', country)
      console.log('toppic :>> ', toppic)
      console.log('id :>> ', id)
      dispatch(setSelectToppic(toppic))
      dispatch(setSelectCountry(country))
      setModeData(mode === 'view' || mode === 'edit' ? mode : 'view')
    }
  }, [country, toppic, id])
  return (
    <Layout>
      <div>ยินดีต้นรับ ({modeData})</div>
    </Layout>
  )
}

export default AddInternationalRelationsTopics
