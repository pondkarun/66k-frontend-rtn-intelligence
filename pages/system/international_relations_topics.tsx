import Layout from '@/components/layout'
import { setBackground } from '@/redux/actions/configActions';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux';

const InternationalRelationsTopics = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setBackground("#fff"));
    }, [])

    return (
        <Layout>
            <>
                InternationalRelationsTopics
            </>
        </Layout>
    )
}

export default InternationalRelationsTopics