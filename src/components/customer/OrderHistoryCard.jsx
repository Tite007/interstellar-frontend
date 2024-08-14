import React, { useState } from 'react'
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
          <OrderCard key={index} item={order} />
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
