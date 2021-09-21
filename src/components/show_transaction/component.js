import React, { useState, useEffect } from 'react'
import { useHistory, withRouter } from 'react-router-dom'
import moment from 'moment'
import './style.css'

import { CustomImageComponent } from 'components'
import HeaderComponent from './header'
import { getId } from 'firebase_config'

function ShowTransactionComponent (props) {
  const { currentUser } = props
  const transactionId = props.match.params.id
  const [transaction, setTransaction] = useState('')
  const [transactionUser, setTransactionUser] = useState('')
  const history = useHistory()

  useEffect(() => {
    async function getTransaction () {
      const trn = await getId('transactions', transactionId)
      setTransaction(trn)
      await getTransactionUser(trn)
    }

    async function getTransactionUser (trn) {
      const u = await getId('users', trn.userId)
      setTransactionUser(u)
    }

    if (!transaction) {
      getTransaction()
    }
  })

  const redirectTo = () => {

  }

  const redirectToUser = (un) => {
    history.push(`/app/profile/${un}`)
  }

  return transactionUser && transaction && (
    <div className='container desktop-align-center'>
      <HeaderComponent />
      <div className='show-transaction-wrapper dashboard-content'>
        <div className='media p-2 pointer d-none'>
          <CustomImageComponent user={transactionUser} />
          <div className='media-body pl-2'>
            <div className='flex-row'>
              <div className='pull-left transaction-name'>{transactionUser.username}</div>
              <div className={`pull-right transaction-amount ${transaction.type === 'debit' ? 'debit' : 'credit'}`}>
                <span>{transaction.type === 'debit' ? '-' : '+'}</span>{transaction.amount} <span className='text-uppercase'>{transaction.currency}</span>
              </div>
            </div>
            <br/>
            <div className='text-secondary'>
              <div className='transaction-date'>{moment(transaction.createdAt).format('MMM D  \'YY, h:mma')}</div>
            </div>
          </div>
        </div>
        <div className='transaction-details'>
          <h4 className={`transaction-amount ${transaction.status === 'pending' ? 'pending' : (transaction.type === 'debit' ? 'debit' : 'credit')}`}>
            {transaction.amount} <span className='text-uppercase'>{transaction.currency}</span>
          </h4>
          <small>
            {transaction.status} &nbsp;<img src={require('assets/svgs/Middot.svg').default} alt='middot' />&nbsp; {moment(transaction.createdAt).format('MMM D  \'YY, h:mma')}
          </small>
        </div>
        <div className='invoice-table'>
          <div className='d-flex flex-row justify-content-between invoice-table-section'>
            <div className='key'>Transaction ID</div>
            <div className='value'>
              {transactionId.split('')}
            </div>
          </div>
          <hr className='invoice-table-divider'/>
          <div className='d-flex flex-row justify-content-between invoice-table-section'>
            <div className='key'>From:</div>
            <div className='value' onClick={e => redirectToUser(transactionUser.username)}>
              <div className='d-flex pointer'>
                <CustomImageComponent user={transactionUser} size='sm' />
                <span className='pl-1'>{transactionUser.username}</span>
              </div>
            </div>
          </div>
          <hr className='invoice-table-divider'/>
          <div className='d-flex flex-row justify-content-between invoice-table-section'>
            <div className='key'>To:</div>
            <div className='value' onClick={e => redirectToUser(currentUser.username)}>
              <div className='d-flex pointer'>
                <CustomImageComponent user={currentUser} size='sm' />
                <span className='pl-1'>{currentUser.username}</span>
              </div>
            </div>
          </div>
          <hr className={`invoice-table-divider ${!transaction.postId && 'd-none'}`}/>
          <div className={`flex-row justify-content-between invoice-table-section ${transaction.postId ? 'd-flex' : 'd-none'}`}>
            <div className='key'>Post ID:</div>
            <div className='value'>
              {transaction.postId}
            </div>
          </div>
        </div>
        <div className='transaction-note'>
          Payments may take upto 3 working days to be reflected in your account. <span className='text-violet pointer' onClick={redirectTo}>Is something wrong?</span>
        </div>
      </div>
    </div>
  )
}

export default withRouter(ShowTransactionComponent)
