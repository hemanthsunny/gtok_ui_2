import React, { useState } from 'react'

const ModalComponent = ({
  header, subHeader = '', body, save, close, beforeSave, modalWidth = 'lg', btnSave = 'Save', hideSaveBtn = false
}) => {
  const [buttonSave, setButtonSave] = useState(btnSave)

  const saveModal = async () => {
    let checksPassed = true
    if (beforeSave) {
      checksPassed = await beforeSave()
    }
    if (checksPassed) {
      if (window.confirm('Are you sure to save?')) {
        setButtonSave('Saving...')
        await save()
        setButtonSave('Saved!')
      }
    }
  }

  return (
    <div className='modal fade' id='modal' tabIndex='-1' role='dialog' aria-labelledby='modalLabel' aria-hidden='true' data-backdrop='static' data-keyboard='false'>
      <div className={`modal-dialog model-${modalWidth}`} role='document'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h6 className='modal-title' id='modalLabel'>{header}</h6>
            {close
              ? <button type='button' className='btn btn-sm btn-outline-secondary' onClick={close}>Close</button>
              : <button type='button' className='btn btn-sm btn-outline-secondary' data-dismiss='modal'>Close</button>
            }
          </div>
          <div className='modal-body'>
            {subHeader && <p className='modal-subtitle text-center'>{subHeader}</p>}
            {body()}
          </div>
          <div className='modal-footer'>
            {
              save && buttonSave === 'Save' && !hideSaveBtn &&
              <small className='text-danger text-center'>
              *Make sure you entered everything correctly. You cannot edit once you save.
              </small>
            }
            {close
              ? <button type='button' className='btn btn-sm btn-outline-secondary' onClick={close}>Close</button>
              : <button type='button' className='btn btn-sm btn-outline-secondary' data-dismiss='modal'>Close</button>
            }
            {
              save && !hideSaveBtn &&
              <button type='button' className='btn btn-sm btn-success' onClick={e => saveModal(e)} disabled={buttonSave !== btnSave}>{buttonSave}</button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalComponent
