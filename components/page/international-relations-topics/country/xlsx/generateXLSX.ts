/* eslint-disable import/no-anonymous-default-export */
import * as XLSX from 'xlsx'
import download from 'downloadjs'
import { TfieldInternationdata } from '@/interface/international_relations_datas.interface'

type SheelConfigT = TfieldInternationdata[]

export default (arr: SheelConfigT) => {
  const toppicName = [
    ['', 'หัวข้อทั่วไป'],
    [
      'ลำดับ',
      'ชื่อกิจกรรม',
      'สถานที่จัดกิจกรรม',
      'หัวหน้าคณะฝ่ายไทย',
      'หัวหน้าคณะฝ่ายต่างประเทศ',
      'วันที่เริ่มต้น',
      'วันที่สิ้นสุด',
    ],
  ]
  let getData = arr.map((item, num) => [
    num + 1,
    item.event_name,
    item.event_venue,
    item.leader_name_thai,
    item.leader_name_foreign,
    item.event_date_start,
    item.event_date_end,
  ])

  const addNameSpecifices: string[] = []
  const addMergeCell: {
    s: { r: number; c: number }
    e: { r: number; c: number }
  }[] = []
  const addToppicSpecifices: string[] = []
  // console.log('arr', arr)

  addMergeCell.push({ s: { r: 0, c: 1 }, e: { r: 0, c: 6 } })

  const itemsCount = arr.length
  for (let z = 0; z < itemsCount; z++) {
    const item = arr[z]
    for (let s = 0; s < getData.length; s++) {
      const lengthofnull = getData[s].length - toppicName[0].length
      let index = 0
      while (index < lengthofnull) {
        addToppicSpecifices.push(``)
        index++
      }
      for (let t = 0; t < item.specific_field.length; t++) {
        const keyname = item.specific_field[t]
        const startCell = addMergeCell[t].e.c + item.specific_field.length - 1
        let endCell = startCell
        if (keyname) {
          const checkDupicateToppic = addToppicSpecifices.findIndex(
            (x) => x === keyname.topic_reason_name,
          )
          if (checkDupicateToppic === -1) {
            addToppicSpecifices.push(keyname.topic_reason_name)
          }
          let m = 1
          while (m < keyname.sub_reason_name.length) {
            addToppicSpecifices.push(``)
            m++
            endCell++
          }
          const addValuesSpecifices: string[] = []
          for (let n = 0; n < keyname.sub_reason_name.length; n++) {
            const sub_reason = keyname.sub_reason_name[n]
            const checkDupicate = addNameSpecifices.findIndex(
              (x) => x === sub_reason.name,
            )
            const checkDupicateValue = addValuesSpecifices.findIndex(
              (x) => x === sub_reason.value,
            )
            if (checkDupicate === -1) addNameSpecifices.push(sub_reason.name)
            if (checkDupicateValue === -1) {
              addValuesSpecifices.push(sub_reason.value)
            }
          }
          getData = getData.map((data) => [...data, ...addValuesSpecifices])
        }
        const modalMergeCell = {
          s: { r: 0, c: startCell },
          e: { r: 0, c: endCell },
        }
        addMergeCell.push(modalMergeCell)
      }
    }
  }

  const headerColumn = [...toppicName[0], ...addToppicSpecifices]
  const dataColumn1 = [...toppicName[1], ...addNameSpecifices]
  const minusNumber = headerColumn.length - dataColumn1.length

  let count = 0
  /* pop remove values = ''*/
  while (count < minusNumber) {
    headerColumn.pop()
    count++
  }

  const formatData = [headerColumn, dataColumn1, ...getData]

  const workbook = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet([])
  XLSX.utils.sheet_add_aoa(ws, formatData, { origin: 'A1' })

  const columnWidths = [
    { wch: 10 },
    { wch: 15 },
    { wch: 20 },
    { wch: 20 },
    { wch: 40 },
    { wch: 40 },
    { wch: 10 },
    { wch: 20 },
    { wch: 20 },
  ]
  const cellRef = `B1`

  ws[cellRef] = {
    ...ws[cellRef],
    s: {
      horizontal: 'center',
      vertical: 'center',
      wrapText: true,
    },
  }
  ws['!merges'] = addMergeCell
  ws['!cols'] = columnWidths

  XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1')
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })
  download(
    buffer,
    `Excel-file`,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  // const blob = new Blob([buffer], {
  //   type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  // })
  // console.log('blob', blob)
  // const url = URL.createObjectURL(blob)

  // const a = document.createElement('a')
  // a.href = url
  // a.target = '_blank'
  // a.click()
}
