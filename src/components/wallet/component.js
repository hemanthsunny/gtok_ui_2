import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { LoadingComponent } from 'components'
import HeaderComponent from './header'
import CreateWalletComponent from './steps/create_wallet/component'
import DuplicateWalletComponent from './steps/duplicate_wallet/component'
import WalletDetailsComponent from './steps/wallet_details/component'

import { add, update } from 'firebase_config'

// https://stackoverflow.com/questions/41658552/how-to-create-a-7-character-underline-input-text-field-in-html-and-cssscreensho
// https://stackoverflow.com/questions/41698357/how-to-partition-input-field-to-appear-as-separate-input-fields-on-screen

function WalletComponent ({ currentUser, wallet }) {
  const [loading, setLoading] = useState(true)
  const [walletExists, setWalletExists] = useState(true)
  const [walletDetails, setWalletDetails] = useState('')
  const [duplicateWallet, setDuplicateWallet] = useState(false)
  // const [walletAmount, setWalletAmount] = useState(0)
  // const [walletCurrency, setWalletCurrency] = useState('INR')
  const [requestSent, setRequestSent] = useState(false)
  // const [result, setResult] = useState({})

  useEffect(() => {
    if (wallet.length === 1) {
      setWalletDetails(wallet)
    } else if (wallet.length > 1) {
      setWalletDetails(wallet)
      setDuplicateWallet(true)
      setRequestSent(!!wallet.find(w => w.requestSent))
    } else {
      setWalletExists(false)
    }
    setLoading(false)
  }, [wallet, setWalletExists, setWalletDetails, setDuplicateWallet, setRequestSent, setLoading])

  const createWallet = async () => {
    const data = {
      userId: currentUser.id,
      amount: 0,
      currency: 'INR'
    }
    const res = await add('wallets', data)
    if (res.status === 200) {
      setWalletDetails(data)
      setWalletExists(true)
    }
    // setResult(res)
  }

  const unlockRequest = async () => {
    const data = {
      requestSent: true
    }
    let result
    walletDetails.map(async (item, i) => {
      result = await update('wallets', item.id, data)
      if (result.status === 200) {
        setRequestSent(true)
      }
    })
  }

  // const withdrawAmount = () => {
  //   if (walletAmount < 50) {
  //     alert(`Atleast 50 ${walletCurrency} required to withdraw.`)
  //     return null
  //   }
  //   setWalletAmount(100)
  //   setWalletCurrency('INR')
  // }

  return (
    <div>
      <HeaderComponent />
      <div className='container wallet-wrapper'>
        {
          loading
            ? <LoadingComponent />
            : <div>
            {!walletExists && <CreateWalletComponent save={createWallet} />}
            {duplicateWallet && <DuplicateWalletComponent requestSent={requestSent} save={unlockRequest} />}
            {walletExists && !duplicateWallet && <WalletDetailsComponent wallet={walletDetails[0]} />}
          </div>
        }
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const { wallet } = state.wallet
  return { wallet }
}

export default connect(
  mapStateToProps,
  null
)(WalletComponent)
