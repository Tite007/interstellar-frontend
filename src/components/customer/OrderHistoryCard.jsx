import React, { useState } from 'react'
import Link from 'next/link'
import OrderCard from '@/src/components/customer/OrderCard' // Adjust the import path as necessary
import { Pagination } from '@nextui-org/pagination'

const ITEMS_PER_PAGE = 5

const OrderHistoryCard = ({ userOrders }) => {
  const [currentPage, setCurrentPage] = useState(1)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const paginatedOrders = userOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  return (
    <div>
      <div className="order-history">
        {paginatedOrders.map((order, index) => (
          <Link key={index} href={`/customer-profile/orders/${order._id}`}>
            <OrderCard item={order} />
          </Link>
        ))}
      </div>
      <div className="pagination">
        <Pagination
          total={Math.ceil(userOrders.length / ITEMS_PER_PAGE)}
          initialPage={currentPage}
          onChange={handlePageChange}
          className="mt-4"
        />
      </div>
    </div>
  )
}

export default OrderHistoryCard
