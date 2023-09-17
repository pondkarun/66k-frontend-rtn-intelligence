import { Button } from 'antd'
import React from 'react'

type ModalFooterType = {
  mode: string;
  onOk: () => void;
  onCancel: () => void;
  loading?: boolean;
}
const ModalFooter = ({ mode, onOk, onCancel, loading }: ModalFooterType) => {
  return (
    mode != "view" ?
      <>
        <Button loading={loading} onClick={onCancel}>ยกเลิก</Button>
        <Button loading={loading} type='primary' onClick={onOk}>บันทึก</Button>
      </>
      :
      <>
        <Button loading={loading} onClick={onCancel}>ปิด</Button>
      </>
  )
}

export default ModalFooter