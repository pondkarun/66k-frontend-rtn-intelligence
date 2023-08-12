import Layout from '@/components/layout'
import { setBackground } from '@/redux/actions/configActions';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux';

const Assign = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setBackground("#fff"));
    }, [])

    return (
        <Layout>
            <>
                Assign
            </>
        </Layout>
    )
}

export default Assign