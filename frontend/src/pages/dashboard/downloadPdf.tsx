import React from 'react'
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from '@react-pdf/renderer'
import { Button } from '@mui/material'
import dayjs from 'dayjs'
import { formatDateBackend, formatDateFrontend } from 'utils/date'
import { endpoints } from 'services/endpoints'
import {
  formatPetsNamesString,
  PrenotazioniListType,
} from 'pages/prenotazioni/types'
import { Spin } from 'antd'
import useSWR from 'swr'

// Create styles
const styles = StyleSheet.create({
  title: {
    top: 15,
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  columnHeader: {
    flexDirection: 'row',
    position: 'absolute',
    fontSize: 14,
    top: 50,
    fontFamily: 'Helvetica-Bold',
  },
  rows_container: {
    top: 60,
  },
  row: {
    flexDirection: 'row',
    fontSize: 12,
    marginTop: 10,
  },
  column1: { left: 10, width: 70 }, // date_from
  column2: { left: 30, width: 60 }, // date_to
  column3: { left: 60, width: 150 }, // customer_name
  column4: { left: 70, width: 330 }, // pets_names
  column5: { left: 90, width: 80 }, // webcam
  column6: { left: 90, width: 80 }, // paid
})

// Create Document Component
const Template = ({
  data,
  title,
}: {
  data: PrenotazioniListType[] | undefined
  title: string
}) => {
  if (!data) return <Document />

  const getPaidValue = (item: PrenotazioniListType) => {
    if (item.payment_amount > 0) return 'Sì'
    if (
      (item.payment_amount === 0 || item.payment_amount === null) &&
      item.advance_payment_amount > 0
    )
      return 'Caparra'
    if (
      (item.payment_amount === 0 || item.payment_amount === null) &&
      (item.advance_payment_amount === 0 ||
        item.advance_payment_amount === null)
    )
      return 'No'
    return 'No'
  }

  return (
    <Document>
      <Page size="A4" orientation="landscape">
        <Text key="title" style={styles.title} fixed>
          {title}
        </Text>
        <View key="intestazioni" style={styles.columnHeader} fixed>
          <Text key="date_from" style={styles.column1}>
            Data da
          </Text>
          <Text key="date_to" style={styles.column2}>
            Data a
          </Text>
          <Text key="customer_name" style={styles.column3}>
            Cliente
          </Text>
          <Text key="pets_names" style={styles.column4}>
            Animali
          </Text>
          <Text key="webcam" style={styles.column5}>
            Webcam
          </Text>
          <Text key="paid" style={styles.column6}>
            Pagata
          </Text>
        </View>
        <View key="rows_container" style={styles.rows_container}>
          {data.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text key={item.id} style={styles.column1}>
                {formatDateFrontend(item.date_from)}
              </Text>
              <Text key={item.id} style={styles.column2}>
                {formatDateFrontend(item.date_to)}
              </Text>
              <Text
                key={item.id}
                style={styles.column3}
              >{`${item.first_name} ${item.last_name}`}</Text>
              <Text key={item.id} style={styles.column4}>
                {formatPetsNamesString(item.pets_names)}
              </Text>
              <Text key={item.id} style={styles.column5}>
                {item.webcam !== '0' ? 'Sì' : 'No'}
              </Text>
              <Text key={item.id} style={styles.column6}>
                {getPaidValue(item)}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}

export const DownloadTodayButton = ({ isCheckin }: { isCheckin: boolean }) => {
  const today = dayjs().format('DD-MM-YYYY')
  const title = isCheckin ? `Checkin ${today}` : `Checkout ${today}`

  const { data, isLoading } = useSWR<
    { records: PrenotazioniListType[]; total: number },
    Error
  >({
    mod: endpoints.reservation.list.mod,
    fnz: endpoints.reservation.list.fnz,
    body: {
      limit: 999,
      page: 1,
      date_from: formatDateBackend(dayjs()),
      date_to: formatDateBackend(dayjs()),
      to_checkin: isCheckin ? 1 : 0,
      to_checkout: isCheckin ? 0 : 1,
      history: 0,
    },
  })

  return isLoading ? (
    <Spin size="small" />
  ) : (
    <PDFDownloadLink
      document={<Template data={data?.records} title={title} />}
      fileName={`${title}.pdf`}
      style={{ textDecoration: 'none' }}
    >
      {() => (
        <Button size="small" variant="contained" style={{ width: '100%' }}>
          Scarica
        </Button>
      )}
    </PDFDownloadLink>
  )
}
