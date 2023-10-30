import { TfieldInternationdata } from '@/interface/international_relations_datas.interface'
import { Button, Col, Row } from 'antd'
import React, { memo, useEffect } from 'react'
import styled from 'styled-components'

interface ReactPDFDocProps {
  items: TfieldInternationdata[],
  hidePrint?: boolean,
}
const Report = ({ items, hidePrint }: Readonly<ReactPDFDocProps>) => {
  let num = 1
  useEffect(() => {
    if (!hidePrint) {
      setTimeout(() => {
        if (num == 1) {
          printDiv()
        }
        num++
      }, 1000);
    }
  }, [])

  function printDiv() {
    window.print();
  }
  return (
    <div>
      <Div id="printableArea">
        {hidePrint ? null : <div style={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: 10,
        }}>
          <Button className='hide-print' onClick={() => printDiv()}>Print</Button>
        </div>}
        {items.map((item, index) => {
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
            <>
              <div className={`${index != 0 ? "pagebreak" : ""}`}>
                <div style={{ textAlign: "center", paddingBottom: 20 }}>
                  <h2><b>{item.event_name}</b></h2>
                  <h2><b>{item.event_venue === '-' ? '' : item.event_venue}</b></h2>
                  <h2><b>{`${start_date} - ${start_end}`}</b></h2>
                  <h2><b>{item.leader_name_thai === '-' ? '' : item.leader_name_thai}</b></h2>
                  <h2><b>{item.leader_name_foreign === '-' ? '' : item.leader_name_foreign}</b></h2>
                  {typeof item.image_documents !== 'undefined' &&
                    typeof item.image_documents.img_haader !== 'undefined' ? (
                    typeof item.image_documents.img_haader?.[0] !== 'undefined' ? (
                      item.image_documents.img_haader?.[0]?.url !== '' ? (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: "center",
                            padding: '20px 20px',
                          }}
                        >
                          <img style={{
                            width: 170,
                            // height: 170,
                          }}
                            src={item.image_documents.img_haader[0].url}
                          />
                        </div>
                      ) : null
                    ) : null
                  ) : null}
                </div>
                <div style={{
                  height: 2,
                  border: '1px dashed black',
                }} />
                <br />
                {item.specific_field.map((specific, index) => (
                  <div key={index}>
                    <div style={{ fontSize: 20, paddingBottom: 5 }}>
                      <b>{`${index + 1}.${specific.topic_reason_name}`}</b>
                    </div>
                    {specific.sub_reason_name.map((subreason, index) => (
                      <div key={index} style={{ fontSize: 16, paddingBottom: 5 }}>
                        <Row>
                          <Col span={4}>
                            <b>{`${subreason.name} :`}</b>
                          </Col>
                          <Col span={20} style={{ textAlign: "justify", textJustify: "inter-word", }}>
                            {subreason.value}
                          </Col>
                        </Row>
                      </div>
                    ))}
                    <br />
                  </div>
                ))}

              </div>
              <br className='hide-print' />
            </>
          )
        })}
      </Div >
    </div >
  )
}

const Div = styled('div')`

  @font-face {
    font-family: THSarabun;
    src: url(/fonts/satabun_psk/THSarabun.ttf);
  }
  * {
    font-family: THSarabun;
  }
  @media print {
    * {
      font-family: THSarabun;

    }
    .hide-print {
      display: none;
    }
    .pagebreak {
        clear: both;
        page-break-before: always;
    }
   #printableArea {
      width: 210mm;
      height: 297mm;
    }
  }
`

export default memo(Report)