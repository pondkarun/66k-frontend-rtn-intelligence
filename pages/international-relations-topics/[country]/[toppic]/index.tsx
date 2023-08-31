import Router, { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from "styled-components";
import Layout from "@/components/layout";
import { setSelectCountry, setSelectToppic } from '@/redux/actions/toppicMenuActions';
import ManageInternationalRelationsTopics from '@/components/page/international-relations-topics/manage-international-relations-topics';
//#region -> styled

//#endregion

const AddInternationalRelationsTopics = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { country, toppic }: { country?: string, toppic?: string } = router.query;

    useEffect(() => {
        if (country && toppic) {
            console.log('country :>> ', country);
            console.log('toppic :>> ', toppic);
            dispatch(setSelectToppic(toppic))
            dispatch(setSelectCountry(country))
        }
    }, [country, toppic]);
    return (
        <Layout>
            <>
                <ManageInternationalRelationsTopics mode='add' />
            </>
        </Layout>
    )
}

export default AddInternationalRelationsTopics