import React from 'react'

function CreateWalletComponent ({ save }) {
  return (
    <div className='text-center create-wallet-wrapper'>
      No wallet found <br/>
      <div className='btn btn-next' onClick={save}>
        Create wallet
      </div>
    </div>
  )
}

export default CreateWalletComponent
