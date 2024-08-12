import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 40,
    lineHeight: 1.5,
    flexDirection: 'column',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 20,
    color: '#333',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  leftColumn: {
    flexDirection: 'column',
    width: '60%',
  },
  rightColumn: {
    flexDirection: 'column',
    width: '40%',
    textAlign: 'right',
  },
  text: {
    marginBottom: 4,
    color: '#333',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#555',
  },
  table: {
    display: 'table',
    width: '100%',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  tableColHeader: {
    width: '25%',
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  tableColHeaderDescription: {
    width: '50%',
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left', // Align text to the left for header description column
  },
  tableCol: {
    width: '25%',
    padding: 8,
    fontSize: 10,
    color: '#333',
    textAlign: 'right',
  },
  tableColDescription: {
    width: '50%',
    padding: 8,
    fontSize: 10,
    color: '#333',
    textAlign: 'left', // Align text to the left for description column
  },
  totalSection: {
    marginTop: 18,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  totalTable: {
    display: 'table',
    width: '50%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 4,
    marginBottom: 4,
  },
  totalTextLeft: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
  },
  totalTextRight: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  link: {
    color: '#007bff',
    textDecoration: 'underline',
    marginTop: 10,
    fontSize: 12,
  },
})

const MyDocument = ({ order, userDetails }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.topSection}>
        <View style={styles.leftColumn}>
          <Text style={styles.header}>Invoice</Text>
          <Text style={styles.text}>
            Invoice Number: {order?.orderNumber || 'N/A'}
          </Text>
          <Text style={styles.text}>
            Date of Issue: {order?.createdAt || 'N/A'}
          </Text>
          <Text style={styles.text}>Date Due: {order?.dueDate || 'N/A'}</Text>
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.text}>CoffeeShop</Text>
          <Text style={styles.text}>+1 604-300-5347</Text>
        </View>
      </View>

      <View style={styles.topSection}>
        <View style={styles.leftColumn}>
          <Text style={styles.sectionHeader}>Bill to</Text>
          <Text style={styles.text}>
            {userDetails?.name || 'N/A'} {userDetails?.lastName || 'N/A'}
          </Text>
          <Text style={styles.text}>
            {userDetails?.address?.street || 'N/A'}
          </Text>
          <Text style={styles.text}>
            {order?.shippingInfo?.address?.city || 'N/A'},{' '}
            {order?.shippingInfo?.address?.state || 'N/A'}{' '}
            {order?.shippingInfo?.address?.postal_code || 'N/A'}
          </Text>
          <Text style={styles.text}>
            {userDetails?.address?.country || 'N/A'}
          </Text>
          <Text style={styles.text}>{userDetails?.email || 'N/A'}</Text>
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.sectionHeader}>Ship to</Text>
          <Text style={styles.text}>
            {userDetails?.name || 'N/A'} {userDetails?.lastName || 'N/A'}
          </Text>
          <Text style={styles.text}>
            {order?.shippingInfo?.address?.line1 || 'N/A'}
          </Text>
          <Text style={styles.text}>
            {order?.shippingInfo?.address?.city || 'N/A'},{' '}
            {order?.shippingInfo?.address?.state || 'N/A'}{' '}
            {order?.shippingInfo?.address?.postal_code || 'N/A'}
          </Text>
          <Text style={styles.text}>
            {order?.shippingInfo?.address?.country || 'N/A'}
          </Text>
        </View>
      </View>

      <View>
        <Text style={styles.sectionHeader}>
          ${order?.totalPrice?.toFixed(2) || 'N/A'} USD due{' '}
          {order?.dueDate || 'N/A'}
        </Text>
        <Link
          style={styles.link}
          src="https://invoice.stripe.com/i/acct_1OnnI6K4ADNUSG0o/test_YWNjdF8xT25uSTZLNEFETlVTRzBvLF9RTnM5cTA0YzFYVTVrZUxPbGFqc0tTeGlZS04xWThSLDExMDYwNTYyMg0200Z0Z9xTaM?s=pd"
        >
          Pay online
        </Link>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Your purchase description</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeaderDescription}>Description</Text>
            <Text style={styles.tableColHeader}>Qty</Text>
            <Text style={styles.tableColHeader}>Unit Price</Text>
            <Text style={styles.tableColHeader}>Amount</Text>
          </View>
          {order?.items?.map((item) => (
            <View style={styles.tableRow} key={item._id}>
              <Text style={styles.tableColDescription}>
                {item.name || 'N/A'}
              </Text>
              <Text style={styles.tableCol}>{item.quantity || 'N/A'}</Text>
              <Text style={styles.tableCol}>${item.price || 'N/A'}</Text>
              <Text style={styles.tableCol}>${item.total || 'N/A'}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.totalSection}>
        <View style={styles.totalTable}>
          <View style={styles.totalRow}>
            <Text style={styles.totalTextLeft}>Subtotal:</Text>
            <Text style={styles.totalTextRight}>
              ${order?.subtotal?.toFixed(2) || 'N/A'}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalTextLeft}>
              Shipping (Standard Shipping):
            </Text>
            <Text style={styles.totalTextRight}>
              ${order?.shippingInfo?.shippingCost?.toFixed(2) || 'N/A'}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalTextLeft}>Total:</Text>
            <Text style={styles.totalTextRight}>
              ${order?.totalPrice?.toFixed(2) || 'N/A'}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalTextLeft}>Amount Due:</Text>
            <Text style={styles.totalTextRight}>
              ${order?.totalPrice?.toFixed(2) || 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Thank you for your purchase!</Text>
      </View>
    </Page>
  </Document>
)

export default MyDocument
