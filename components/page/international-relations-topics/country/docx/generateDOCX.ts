import download from 'downloadjs'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  ImageRun,
} from 'docx'
import { TfieldInternationdata } from '@/interface/international_relations_datas.interface'

/* eslint-disable import/no-anonymous-default-export */
type DocConfigT = TfieldInternationdata[]

const configParagraph = {
  fontSize: 14,
  fontFamily: 'Thai SarabunPSK'
}

export default async (data: DocConfigT, file_name?: string) => {
  let mergeCommonToppic: Paragraph[] = []
  let addToppicSpecifices: string[] = []
  let addToppicSpecificesParagraph: Paragraph[] = []
  let addNameSpecifices: string[] = []
  let addNameSpecificesParagraph: Paragraph[] = []

  const countPages = []

  const itemsCount = data.length
  for (let z = 0; z < itemsCount; z++) {
    const _data = data[z]

    const createImageParagraph = []

    if (_data.image_documents) {
      if (typeof _data.image_documents !== 'undefined') {
        if (_data.image_documents.img_haader) {
          const getImage = _data.image_documents.img_haader[0]?.url ? await (
            await fetch(_data.image_documents.img_haader[0]?.url)
          ).arrayBuffer() : null

          const data: any = {
            alignment: AlignmentType.CENTER,
            spacing: {
              before: 200,
            },
            children: [],
          }

          if (getImage) {
            const img: any = new ImageRun({
              data: getImage,
              transformation: {
                width: 200,
                height: 200,
              },
            })
            data.children.push(img)
          }

          const paragraph_data = new Paragraph(data)
          createImageParagraph.push(paragraph_data)
        }
      }
    }
    mergeCommonToppic.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 200,
        },
        children: [
          new TextRun({
            text: _data.event_name,
            allCaps: true,
            font: configParagraph.fontFamily,
            size: configParagraph.fontSize
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 200,
        },
        children: [
          new TextRun({
            text: _data.event_venue,
            allCaps: true,
            font: configParagraph.fontFamily,
            size: configParagraph.fontSize
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 200,
        },
        children: [
          new TextRun({
            text: _data.leader_name_thai,
            allCaps: true,
            font: configParagraph.fontFamily,
            size: configParagraph.fontSize
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 200,
        },
        children: [
          new TextRun({
            text: _data.leader_name_foreign,
            allCaps: true,
            font: configParagraph.fontFamily,
            size: configParagraph.fontSize
          }),
        ],
      }),
      ...createImageParagraph,
    )

    for (let x = 0; x < _data.specific_field.length; x++) {
      const keyname = _data.specific_field[x]
      if (keyname) {
        const checkDupicateToppic = addToppicSpecifices.findIndex(
          (x) => x === keyname.topic_reason_name,
        )
        if (checkDupicateToppic === -1) {
          addToppicSpecifices.push(keyname.topic_reason_name)
          addToppicSpecificesParagraph.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${x + 1}.${keyname.topic_reason_name}`,
                  bold: true,
                  font: configParagraph.fontFamily,
            size: configParagraph.fontSize
                }),
              ],
            }),
          )
        }

        for (let p = 0; p < keyname.sub_reason_name.length; p++) {
          const sub_reason = keyname.sub_reason_name[p]

          const checkDupicate = addNameSpecifices.findIndex(
            (x) => x === sub_reason.name,
          )
          if (checkDupicate === -1) {
            addNameSpecifices.push(sub_reason.name)
            addToppicSpecificesParagraph = [
              ...addToppicSpecificesParagraph,
              new Paragraph({
                spacing: {
                  before: 200,
                },
                children: [
                  new TextRun({
                    text: `${sub_reason.name}:  `,
                    bold: true,
                    font: configParagraph.fontFamily,
                    size: configParagraph.fontSize,
                  }),
                  new Paragraph({
                    spacing: {
                      after: 200,
                    },
                    rightTabStop: 1,
                    children: [
                      new TextRun({
                        text: sub_reason.value,
                        font: configParagraph.fontFamily,
                        size: configParagraph.fontSize,
                      }),
                    ],
                  }),
                ],
              }),
            ]
          }
        }
      }
    }

    countPages.push({
      properties: {},
      children: [
        ...mergeCommonToppic,
        ...addToppicSpecificesParagraph,
        ...addNameSpecificesParagraph,
      ],
    })
    mergeCommonToppic = []
    addToppicSpecifices = []
    addToppicSpecificesParagraph = []
    addNameSpecifices = []
    addNameSpecificesParagraph = []
  }

  const doc = new Document({
    sections: [...countPages],
  })
  Packer.toBlob(doc).then((blob) => {
    download(
      blob,
      `${file_name || 'word-export'}`,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    )
  })
}
