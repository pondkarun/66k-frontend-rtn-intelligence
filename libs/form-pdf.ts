import { PDFDocument, PageSizes, StandardFonts, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import downloadjs from 'downloadjs'
import { Tforminternational } from '@/interface/international_relations_datas.interface'

type createFormPDFT = {
  coverPhoto: {
    name: string
    url: string
  }
  responseDatas: Tforminternational
}

export const createFormPDF = async (props: Readonly<createFormPDFT>) => {
  const { coverPhoto, responseDatas } = props

  // config start
  const nametype = coverPhoto.name.split('.')[1]

  const fetchBuffer = await fetch(coverPhoto.url).then((res) =>
    res.arrayBuffer(),
  )
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage(PageSizes.A4)

  const imageRender =
    nametype === 'png'
      ? await pdfDoc.embedPng(fetchBuffer)
      : nametype === 'jpeg' || nametype === 'jpg'
      ? await pdfDoc.embedJpg(fetchBuffer)
      : ''

  const timesRomanFont = await fetch('/fonts/DBHeaventRounded.ttf').then(
    (res) => res.arrayBuffer(),
  )
  pdfDoc.registerFontkit(fontkit)

  const customFont = await pdfDoc.embedFont(timesRomanFont)
  page.setFont(customFont)
  // config end

  const textContentToppic = responseDatas.event_name
  const NotImgtextContent = '<ไม่มีรูปหน้าปก>'
  const fontsizeTitle = 22
  const Notfontsize = 26

  const NotfontImage = customFont.widthOfTextAtSize(
    NotImgtextContent,
    Notfontsize,
  )

  const fontTitle = customFont.widthOfTextAtSize(
    textContentToppic,
    fontsizeTitle,
  )

  let scalePhoto: {
    width: number
    height: number
  } = { width: 0, height: 0 }

  if (imageRender !== '') {
    scalePhoto = imageRender.scale(0.2)

    page.drawImage(imageRender, {
      x: page.getWidth() / 2 - scalePhoto.width / 2,
      y: page.getHeight() / 2 - scalePhoto.height / 2 + 240,
      width: scalePhoto.width,
      height: scalePhoto.height,
    })
  } else {
    page.drawText(NotImgtextContent, {
      x: (page.getWidth() - NotfontImage) / 2,
      y: page.getHeight() / 2 - scalePhoto.height / 2 + 300,
      size: Notfontsize,
    })
  }

  const textX = (page.getWidth() - fontTitle) / 2
  const textY =
    (page.getHeight() - fontsizeTitle) / 2 + (scalePhoto.width === 0 ? 200 : 80)

  page.drawText(textContentToppic, {
    x: textX,
    y: textY,
    size: fontsizeTitle,
  })

  const separatorY = textY - 30
  page.drawLine({
    start: { x: 50, y: separatorY },
    end: { x: 550, y: separatorY },
    thickness: 1,
  })

  const fontsize = 16
  const xTitle = 70
  const xValue = 70 * 3.2
  page.drawText('ชื่อกิจกรรม:', {
    x: xTitle,
    y: separatorY - 40,
    size: fontsize,
  })
  page.drawText(responseDatas.event_name, {
    x: xValue,
    y: separatorY - 40,
    size: fontsize,
  })
  page.drawText('สถานที่จัดกิจกรรม:', {
    x: xTitle,
    y: separatorY - 40 - 40,
    size: fontsize,
  })
  page.drawText(responseDatas.event_venue ?? '-', {
    x: xValue,
    y: separatorY - 40 - 40,
    size: fontsize,
  })
  page.drawText('หัวหน้าคณะฝ่ายไทย:', {
    x: xTitle,
    y: separatorY - 40 - 40 - 40,
    size: fontsize,
  })
  page.drawText(responseDatas.leader_name_thai ?? 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus facere amet optio. Consequuntur veritatis doloremque sunt nesciunt architecto nobis commodi officiis eos. Quisquam voluptatibus doloribus ipsa soluta, cum voluptatum ab, sit beatae dolorum esse ipsum maiores! Voluptatem officia ratione vitae sapiente incidunt molestiae, iusto consequuntur facilis, nostrum assumenda quaerat aut.', {
    x: xValue,
    y: separatorY - 40 - 40 - 40,
    size: fontsize,
  })
  page.drawText('หัวหน้าคณะฝ่ายต่างประเทศ:', {
    x: xTitle,
    y: separatorY - 40 - 40 - 40 - 40,
    size: fontsize,
  })
  page.drawText(responseDatas.leader_name_foreign ?? '-', {
    x: xValue,
    y: separatorY - 40 - 40 - 40 - 40,
    size: fontsize,
  })
  page.drawText('ห้วงเวลา:', {
    x: xTitle,
    y: separatorY - 40 - 40 - 40 - 40 - 40,
    size: fontsize,
  })
  const start_date = new Date(
    responseDatas.event_date_start,
  ).toLocaleDateString('th-TH', {
    year: '2-digit',
    month: 'short',
    day: 'numeric',
  })
  const start_end = new Date(responseDatas.event_date_end).toLocaleDateString(
    'th-TH',
    {
      year: '2-digit',
      month: 'short',
      day: 'numeric',
    },
  )
  page.drawText(`${start_date} - ${start_end}`, {
    x: xValue,
    y: separatorY - 40 - 40 - 40 - 40 - 40,
    size: fontsize,
  })
  pdfDoc.insertPage(1)

  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}
