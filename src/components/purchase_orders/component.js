import React, { useState, useEffect } from 'react'
import HeaderComponent from './header'

import { getQuery, firestore } from 'firebase_config'

function PaymentCardsComponent ({ currentUser }) {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    let orders = await getQuery(
      firestore.collection('purchaseOrders').where('userId', '==', currentUser.id).orderBy('createdAt', 'desc').get()
    )
    orders = orders.sort((a, b) => b.createdAt - a.createdAt)
    setOrders(orders)
  }

  return (
    <div>
      <HeaderComponent />
      <div className='container purchase-orders-wrapper'>
        {orders[0]
          ? orders.map((order, idx) => (
            <div className='card p-2 mb-2' key={idx}>
              <div className=''>
                <div className='order-name pull-left'>{order.purchaseOrder.profileName}</div>
                <div className='order-status pull-right'>{order.active ? 'Active' : 'Pending'}</div>
              </div>
              <div className='order-price pull-left'>{order.purchaseOrder.currency}&nbsp;{order.purchaseOrder.totalPrice}/-</div>
              <div className='pt-2'>
                <div className='order-validity pull-left'>Valid from {order.purchaseOrder.validFrom}</div>
                <div className='order-validity pull-right'>Valid till {order.purchaseOrder.validUntil}</div>
              </div>
            </div>
          ))
          : <div className='text-center font-sm'>No orders found.</div>
        }
      </div>
    </div>
  )
}

export default PaymentCardsComponent
