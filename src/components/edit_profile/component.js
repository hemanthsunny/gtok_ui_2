import React, { useState } from 'react'
import { connect } from 'react-redux'
import MultiSelect from 'react-multi-select-component'
import { toast } from 'react-toastify'
import './style.css'

import HeaderComponent from './header'
import { SetDbUser } from 'store/actions'
import { InterestedCategories } from 'constants/categories'
import { add, update, getQuery, firestore, timestamp, uploadFile } from 'firebase_config'
import { CustomImageComponent } from 'components'

function EditProfileComponent (props) {
  const { user, currentUser, bindDbUser } = props
  const [name, setName] = useState(currentUser.displayName)
  const [username, setUsername] = useState(currentUser.username)
  const [bio, setBio] = useState(currentUser.bio || '')
  const [dob, setDob] = useState(currentUser.dob)
  const [selected, setSelected] = useState(currentUser.interestedTopics || [])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  const saveDetails = async (e) => {
    e.preventDefault()
    if (!name || !name.trim()) {
      toast.error('Name is mandatory')
      return null
    }
    if (!username || !username.trim()) {
      toast.error('Username is mandatory')
      return null
    }
    let data = {}
    if (name) { data = Object.assign(data, { displayName: name.trim() }) }
    if (username) { data = Object.assign(data, { username: username.toLowerCase().trim().replace(/ /g, '_') }) }
    if (dob) { data = Object.assign(data, { dob }) }
    data = Object.assign(data, { interestedTopics: selected, bio })

    // Verify username in database: Only if its different
    if (data.username !== currentUser.username) {
      const user = await getQuery(
        firestore.collection('users').where('username', '==', data.username).get()
      )
      if (user[0]) {
        toast.error('Username is already in use. Attempt anything new.')
        return null
      }
    }

    setLoading(true)
    await updateDbUser(data)
    /* Log the activity */
    await add('logs', {
      text: 'Profile edited',
      userId: currentUser.id,
      collection: 'users',
      timestamp
    })
    setLoading(false)
  }

  const updateDbUser = async (data) => {
    /* Update in firestore, instead of firebase auth */
    /* let res = await updateProfile(data); */
    const res = await update('users', currentUser.id, data)
    await bindDbUser({ ...currentUser, ...data })
    if (res.status === 200) {
      toast.success('Successfully updated')
    }
  }

  const uploadImage = async (file) => {
    if (!file) {
      toast.error('New image required')
      return null
    }
    setUploading(true)
    await uploadFile(file, 'image', async (url, err) => {
      if (err) {
        alert(err)
        return null
      }
      await update('users', currentUser.id, { photoURL: url })
      bindDbUser({ ...currentUser, photoURL: url })
      setUploading(false)
    })
  }

  // const deleteImage = async () => {
  //   if (window.confirm('Are you sure you want to remove profile image?')) {
  //     /* Don't remove source image. Affects in chats & alerts */
  //     // await removeImage(fileUrl);
  //     /* Log the activity */
  //     await add('logs', {
  //       text: `${user.displayName} removed profile image`,
  //       photoURL: '',
  //       receiverId: '',
  //       userId: user.id,
  //       actionType: 'update',
  //       collection: 'users',
  //       actionId: user.id,
  //       actionKey: 'photoURL',
  //       timestamp
  //     })
  //     await update('users', user.id, { photoURL: '' })
  //   }
  // }

  return (
    <div>
      <HeaderComponent save={saveDetails} loading={loading}/>
      <div>
        <div className='dashboard-content'>
          <div className='edit-profile-wrapper desktop-align-center'>
            <div className='upload-image'>
                <label htmlFor='staticImage'>
                  {
                    !uploading
                      ? <CustomImageComponent user={currentUser} size='lg' style={{ textAlign: 'center' }} />
                      : <i className='fa fa-spinner fa-spin'></i>
                  }
                </label>
                <input type='file' className='form-control-plaintext d-none' id='staticImage' onChange={e => uploadImage(e.target.files[0])} accept='image/*' />
                <label className='camera-icon-wrapper' htmlFor='staticImage'>
                  <img src={require('assets/svgs/Camera.svg').default} className='camera-icon' alt='Save' />
                </label>
              </div>
            <div className='form-group'>
              <label htmlFor='username' className='form-label'>Username</label>
              <div className=''>
                <input type='text' className='form-control' id='username' value={username} placeholder='Username' onChange={e => setUsername(e.target.value)} />
              </div>
            </div>
            <div className='form-group'>
              <label htmlFor='name' className='form-label'>Name</label>
              <div className=''>
                <input type='text' className='form-control' id='name' value={name} placeholder='Name' onChange={e => setName(e.target.value)} />
              </div>
            </div>
            <div className='form-group'>
              <label htmlFor='userName' className='form-label'>
                Bio
              </label>
              <div className=''>
                <textarea className='form-control' placeholder='Add your intro here' value={bio} onChange={e => setBio(e.target.value)} rows='5'></textarea>
              </div>
            </div>
            <div className='form-group'>
              <label htmlFor='dob' className='form-label'>Date of birth</label>
              <div className=''>
                <input type='date' className='form-control' id='dob' value={currentUser.dob} placeholder='DD/MM/YYYY' onChange={e => setDob(e.target.value)} />
              </div>
            </div>
            <div className='form-group'>
              <label htmlFor='staticEmail' className='form-label'>
                Email
                <i className={`ml-2 fa fa-${user && user.emailVerified ? 'check text-success' : 'warning text-warning'}`} data-container='body' data-toggle='tooltip' data-placement='top' title={`${user.emailVerified ? 'Verified' : 'Not verified'}`}></i>
              </label>
              <div className=''>
                <input type='text' className='form-control' id='email' value={currentUser.email} readOnly />
              </div>
            </div>
            <div className='form-group d-none'>
              <label htmlFor='staticEmail' className='form-label'>Interested topics</label>
              <div className=''>
                <MultiSelect
                  options={InterestedCategories}
                  value={selected}
                  onChange={setSelected}
                  labelledBy={'select'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const { user } = state.authUsers
  return { user }
}

const mapDispatchToProps = (dispatch) => {
  return {
    bindDbUser: (content) => dispatch(SetDbUser(content))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditProfileComponent)
