import { Button } from 'antd'
import React from 'react'

type ModalFooterType = {
  mode: string;
  onOk: () => void;
  onCancel: () => void;
}
const ModalFooter = ({ mode, onOk, onCancel }: ModalFooterType) => {
  return (
    mode != "view" ?
      <>
        <Button onClick={onCancel}>ยกเลิก</Button>
        <Button type='primary' onClick={onOk}>บันทึก</Button>
      </>
      :
      <>
        <Button onClick={onCancel}>ปิด</Button>
      </>
  )
}

export default ModalFooter