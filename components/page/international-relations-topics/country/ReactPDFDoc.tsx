import React, { Fragment, memo } from 'react'
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from '@react-pdf/renderer'
import { TfieldInternationdata } from '@/interface/international_relations_datas.interface'

Font.registerHyphenationCallback((word) => [word])
Font.register({
  family: 'Sarabun',
  fonts: [
    {
      src: '/fonts/satabun_psk/THSarabun.ttf',
    },
    {
      src: '/fonts/satabun_psk/THSarabun-Bold.ttf',
    },
  ],
})
// Font.register({
//   family: 'Sarabun',
//   fonts: [
//     {
//       src: '/fonts/sarabun/Sarabun-Regular.ttf',
//     },
//     {
//       src: '/fonts/sarabun/Sarabun-Medium.ttf',
//     },
//     {
//       src: '/fonts/sarabun/Sarabun-SemiBold.ttf',
//     },
//     {
//       src: '/fonts/sarabun/Sarabun-Bold.ttf',
//     },
//   ],
// })

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 20,
    fontFamily: 'Sarabun',
    fontSize: 16,
  },
  image: {
    width: 120,
    height: 120,
  },
  separator: {
    height: 2,
    marginVertical: 10,
    border: '1px dashed black',
  },
  textToppic: {
    textAlign: 'center',
  },
  section: {
    flexDirection: 'row',
    flexGrow: 1,
    marginBottom: 10,
  },
  column1: {
    fontWeight: 'semibold',
    width: '25%',
  },
  column2: {
    width: '75%',
  },
})

interface ReactPDFDocProps {
  items: TfieldInternationdata[]
}

const ReactPDFDoc = ({ items }: Readonly<ReactPDFDocProps>) => {
  return (
    <Document>
      {items.map((item) => {
        const start_date = new Date(item.event_date_start).toLocaleDateString(
          'th-TH',
          {
            year: '2-digit',
            month: 'short',
            day: 'numeric',
          },
        )
        const start_end = new Date(item.event_date_end).toLocaleDateString(
          'th-TH',
          {
            year: '2-digit',
            month: 'short',
            day: 'numeric',
          },
        )
        return (
          <Fragment key={item.id}>
            <Page size='A4' style={styles.body} key={item.id} wrap>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: 1                }}
              >
                <Text style={styles.textToppic}>{item.event_name}</Text>
                <Text style={styles.textToppic}>
                  {item.event_venue === '-' ? '' : item.event_venue}
                </Text>
                <Text
                  style={styles.textToppic}
                >{`${start_date} - ${start_end}`}</Text>
                <Text style={styles.textToppic}>
                  {item.leader_name_thai === '-' ? '' : item.leader_name_thai}
                </Text>
                <Text style={styles.textToppic}>
                  {item.leader_name_foreign === '-'
                    ? ''
                    : item.leader_name_foreign}
                </Text>
              </View>
              {typeof item.image_documents !== 'undefined' &&
                typeof item.image_documents.img_haader !== 'undefined' ? (
                typeof item.image_documents.img_haader[0] !== 'undefined' ? (
                  item.image_documents.img_haader[0].url !== '' ? (
                    <View
                      style={{
                        display: 'flex',
                        alignSelf: 'center',
                        padding: '20px 20px',
                      }}
                    >
                      <Image
                        src={item.image_documents.img_haader[0].url}
                        style={styles.image}
                      />
                    </View>
                  ) : null
                ) : null
              ) : null}
              <View style={styles.separator} />
              {item.specific_field.map((specific, index) => (
                <Fragment key={index}>
                  <View
                    style={{
                      flexDirection: 'column',
                      marginBottom: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: 'semibold',
                        marginBottom: 10,
                      }}
                    >
                      {`${index + 1}.${specific.topic_reason_name}`}
                    </Text>
                    {specific.sub_reason_name.map((subreason, index) => (
                      <Fragment key={index}>
                        <View style={styles.section}>
                          <View style={styles.column1}>
                            <Text>{`${subreason.name} :`}</Text>
                          </View>
                          <View style={styles.column2}>
                            <Text>{subreason.value}</Text>
                          </View>
                        </View>
                      </Fragment>
                    ))}
                  </View>
                </Fragment>
              ))}
            </Page>
          </Fragment>
        )
      })}
    </Document>
  )
}

export default memo(ReactPDFDoc)
