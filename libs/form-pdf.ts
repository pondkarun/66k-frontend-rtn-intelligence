import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import downloadjs from 'downloadjs'

type createFormPDFT = {
  coverPhoto: {
    name: string
    url: string
  }
  titleName: string
}

export const createFormPDF = async (props: Readonly<createFormPDFT>) => {
  const { coverPhoto, titleName } = props

  const nametype = coverPhoto.name.split('.')[1]

  const fetchBuffer = await fetch(coverPhoto.url).then((res) =>
    res.arrayBuffer(),
  )

  const pdfDoc = await PDFDocument.create()
  const timesRomanFont = await fetch('/fonts/DBHeaventRounded.ttf').then((res) => res.arrayBuffer())
  const page = pdfDoc.addPage()
  
  pdfDoc.registerFontkit(fontkit)
  const customFont = await pdfDoc.embedFont(timesRomanFont)
  page.setFont(customFont)

  const imageRender =
    nametype === 'png'
      ? await pdfDoc.embedPng(fetchBuffer)
      : await pdfDoc.embedJpg(fetchBuffer)

  const scalePhoto = imageRender.scale(0.3)

  page.drawImage(imageRender, {
    x: page.getWidth() / 2 - scalePhoto.width / 2,
    y: page.getHeight() / 2 - scalePhoto.height / 2 + 100,
    width: scalePhoto.width,
    height: scalePhoto.height,
  })

  page.drawText('แปล', {
    x: page.getWidth() / 2 - scalePhoto.width / 2,
    y: 450,
    size: 35,
    color: rgb(0, 0.53, 0.71),
  })

  const pdfBytes = await pdfDoc.save()

  // downloadjs(pdfBytes, "pdf-lib_creation_example.pdf", "application/pdf")
  return pdfBytes
}
