/* eslint-disable import/no-anonymous-default-export */
import * as XLSX from 'xlsx'
import download from 'downloadjs'
import dayjs from 'dayjs'
import { TfieldInternationdata } from '@/interface/international_relations_datas.interface'

type SheelConfigT = TfieldInternationdata[]

export default (data: SheelConfigT, file_name?: string) => {
  const toppicName = [
    ['', 'ข้อมูลทั่วไป'],
    [
      'ลำดับ',
      'หัวข้อ',
      'ชื่อกิจกรรม',
      'สถานที่จัดกิจกรรม',
      'หัวหน้าคณะฝ่ายไทย',
      'หัวหน้าคณะฝ่ายต่างประเทศ',
      'วันที่เริ่มต้น',
      'วันที่สิ้นสุด',
      'แก้ไขล่าสุด',
      'แก้ไขโดย',
    ],
  ]
  const getData = data.map((item, num) => [
    num + 1,
    item.ir_topic.name,
    item.event_name,
    item.event_venue ?? '',
    item.leader_name_thai ?? '',
    item.leader_name_foreign ?? '',
    item.event_date_start,
    item.event_date_end,
    item.created_by,
    item.updated_date ? dayjs(item.updated_date).format('DD-MM-YYYY H:mm') : '' 
  ])

  const addToppicSpecifices: string[] = []
  const addNameSpecifices: string[] = []
  const addMergeCell: {
    s: { r: number; c: number }
    e: { r: number; c: number }
  }[] = []

  addMergeCell.push({ s: { r: 0, c: 1 }, e: { r: 0, c: 9 } })

  const itemsCount = data.length
  let startAddHeaderStr = 0

  const addDatas = []

  for (let index = 0; index < itemsCount; index++) {
    const items = data[index]
    const lengthofnull = getData[index].length - toppicName[0].length
    if (startAddHeaderStr === 0) {
      let count_toppic = 0
      while (count_toppic < lengthofnull) {
        addToppicSpecifices.push('')
        count_toppic++
      }
      startAddHeaderStr = itemsCount
    }

    const _addValuesSpecifices: string[] = []
    let endCell: number
    if (items.specific_field.length > 0) {
      for (let a = 0; a < items.specific_field.length; a++) {
        const specific = items.specific_field[a]
        const startCell =
          addMergeCell[a].e.c + items.specific_field.length - 1
        endCell = startCell

        const checkDupicateToppic = addToppicSpecifices.findIndex(
          (x) => x === specific.topic_reason_name,
        )
        if (checkDupicateToppic === -1) {
          addToppicSpecifices.push(specific.topic_reason_name)
        }

        let m = 1
        while (m < specific.sub_reason_name.length) {
          addToppicSpecifices.push(``)
          m++
          endCell++
        }

        for (let b = 0; b < specific.sub_reason_name.length; b++) {
          const subSpecific = specific.sub_reason_name[b]
          const checkDupicate = addNameSpecifices.findIndex(
            (x) => x === subSpecific.name,
          )
          if (checkDupicate === -1) {
            addNameSpecifices.push(subSpecific.name)
          }
          _addValuesSpecifices.push(subSpecific.value)
        }
        const modalMergeCell = {
          s: { r: 0, c: startCell },
          e: { r: 0, c: endCell },
        }
        addMergeCell.push(modalMergeCell)
      }

      addDatas.push([...getData[index], ..._addValuesSpecifices])
    } else {
      _addValuesSpecifices.push('')
      addDatas.push([...getData[index], ..._addValuesSpecifices])
    }
  }

  const headerColumn = [...toppicName[0], ...addToppicSpecifices]
  const dataColumn1 = [...toppicName[1], ...addNameSpecifices]
  const formatData = [headerColumn, dataColumn1, ...addDatas]

  const workbook = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet([])
  XLSX.utils.sheet_add_aoa(ws, formatData, { origin: 'A1' })

  const columnWidths = [
    { wch: 10 },
    { wch: 15 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
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
    `${file_name || 'excel-file'}`,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
}
