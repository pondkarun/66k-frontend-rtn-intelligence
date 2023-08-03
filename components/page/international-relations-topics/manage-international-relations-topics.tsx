import React from 'react'
import { useSelector } from 'react-redux';

type ManageInternationalRelationsTopicsType = {
    mode: "add" | "edit"
}

const ManageInternationalRelationsTopics = ({ mode }: ManageInternationalRelationsTopicsType) => {

    const { toppic_obj } = useSelector(({ toppic_menu }) => toppic_menu);

    return (
        <>
            <h1>{mode == "add" ? "เพิ่ม" : "แก้ไข"}ข้อมูล {toppic_obj?.name}</h1>
        </>
    )
}

export default ManageInternationalRelationsTopics