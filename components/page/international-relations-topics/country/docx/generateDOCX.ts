import download from 'downloadjs'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  ImageRun,
  FrameAnchorType,
  HorizontalPositionAlign,
  VerticalPositionAlign,
} from 'docx'
import { TfieldInternationdata } from '@/interface/international_relations_datas.interface'

/* eslint-disable import/no-anonymous-default-export */
type DocConfigT = TfieldInternationdata[]

export default async (data: DocConfigT) => {
  if (data.length === 1) {
    const header: Paragraph[] = []
    const content: Paragraph[] = []
    const contentReason: Paragraph[] = []

    for (let index = 0; index < data.length; index++) {
      const _data = data[index]

      const imageBufferTem: ArrayBuffer[] = []
      if (_data.image_documents) {
        if (_data.image_documents.length > 0) {
          const imageBuffer = await (
            await fetch(_data.image_documents[0].url)
          ).arrayBuffer()
          imageBufferTem.push(imageBuffer)
        }
      }

      for (let t = 0; t < _data.specific_field.length; t++) {
        const keyname = _data.specific_field[t]
        if (keyname) {
          for (let n = 0; n < keyname.sub_reason_name.length; n++) {
            const sub_reason = keyname.sub_reason_name[n]
            contentReason.push(
              new Paragraph({
                spacing: {
                  before: 200,
                },
                style: '',
                children: [
                  new TextRun({
                    text: sub_reason.name,
                  }),
                ],
              }),
            )
          }
        }
        content.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${t + 1}.${keyname.topic_reason_name}`,
              }),
            ],
          }),
          ...contentReason,
        )
      }

      header.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: {
            before: 200,
          },
          children: [
            new TextRun({
              text: _data.event_name,
              allCaps: true,
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
            }),
          ],
        }),
        new Paragraph({
          children: [
            new ImageRun({
              data: imageBufferTem[0],
              transformation: {
                width: 1000,
                height: 1000,
              },
            }),
          ],
        }),
      )
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [...header],
        },
        {
          properties: {},
          children: [...content],
        },
      ],
    })
    Packer.toBlob(doc).then((blob) => {
      download(blob, 'word-export')
    })
  }
}
