import { useEffect } from 'react'
import Layout from '@/components/layout'
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setBackground } from '@/redux/actions/configActions';
import { setSelectCountry } from '@/redux/actions/toppicMenuActions';

const InternationalRelationsTopics = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { country }: { country?: string } = router.query;

  useEffect(() => {
    if (country) {
      dispatch(setSelectCountry(country))
      dispatch(setBackground("#fff"));
    }
  }, [country])

  return (
    <Layout>
      <>
        Table {country}
      </>
    </Layout>
  )
}

export default InternationalRelationsTopics