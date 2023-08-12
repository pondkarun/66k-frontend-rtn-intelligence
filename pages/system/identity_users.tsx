import Layout from '@/components/layout'
import { setBackground } from '@/redux/actions/configActions';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux';

const IdentityUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setBackground("#fff"));
    }, [])

    return (
        <Layout>
            <>
                IdentityUsers
            </>
        </Layout>
    )
}

export default IdentityUsers