/* eslint-disable import/no-anonymous-default-export */
const properties = {
  //   font: { bold: true },
    border: {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
    },
  alignment: { horizontal: 'center' },
}

export default {
  '!ref': 'A1:B3',
  A1: {
    t: 's',
    v: 'ลำดับ',
    s: properties,
  },
}
