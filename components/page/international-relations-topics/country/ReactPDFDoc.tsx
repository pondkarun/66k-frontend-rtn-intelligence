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
      src: '/fonts/sarabun/Sarabun-Regular.ttf',
    },
    {
      src: '/fonts/sarabun/Sarabun-Medium.ttf',
    },
    {
      src: '/fonts/sarabun/Sarabun-SemiBold.ttf',
    },
    {
      src: '/fonts/sarabun/Sarabun-Bold.ttf',
    },
  ],
})

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    fontFamily: 'Sarabun',
    fontSize: 14,
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
})

interface ReactPDFDocProps {
  items: TfieldInternationdata[]
}

const ReactPDFDoc = ({ items }: Readonly<ReactPDFDocProps>) => {
  return (
    <Document>
      {items.map((item) => (
        <Page size='A4' style={styles.body} key={item.id}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              rowGap: 14,
            }}
          >
            <Text style={styles.textToppic}>{item.event_name}</Text>
            <Text style={styles.textToppic}>{item.event_venue}</Text>
            <Text style={styles.textToppic}>{item.leader_name_thai}</Text>
            <Text style={styles.textToppic}>{item.leader_name_foreign}</Text>
          </View>
          {typeof item.image_documents !== 'undefined' ? (
            item.image_documents.length > 0 ? (
              item.image_documents[0].url !== '' ? (
                <View
                  style={{
                    display: 'flex',
                    alignSelf: 'center',
                    padding: '20px 20px',
                  }}
                >
                  <Image
                    src={item.image_documents[0].url}
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
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: 4,
                }}
              >
                <Text style={{ fontWeight: 'semibold', paddingBottom: 10 }}>{`${
                  index + 1
                }.${specific.topic_reason_name}`}</Text>
                {specific.sub_reason_name.map((subreason, index) => (
                  <Fragment key={index}>
                    <View
                      style={{
                        display: 'flex',
                        flexWrap: 'nowrap',
                        flexDirection: 'row',
                      }}
                    >
                      <Fragment key={index}>
                        <View
                          style={{ flex: '1 0 80px', fontWeight: 'semibold' }}
                        >
                          <Text>{`${subreason.name} :`}</Text>
                        </View>
                        <View style={{ flex: '1 0 260px', paddingBottom: 10 }}>
                          <Text>{subreason.value}</Text>
                        </View>
                      </Fragment>
                    </View>
                  </Fragment>
                ))}
              </View>
            </Fragment>
          ))}
        </Page>
      ))}
    </Document>
  )
}

export default memo(ReactPDFDoc)
