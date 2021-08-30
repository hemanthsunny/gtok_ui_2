import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import './style.css'

import HeaderComponent from './header'
import AdminZoneComponent from './admin_zone/component'
import { signout, update } from 'firebase_config'
import { SetUser, SetLoggedIn, SetDbUser } from 'store/actions'

function SettingsComponent ({ currentUser, bindLoggedIn, bindUser, bindDbUser }) {
  const history = useHistory()
  // const [installable, setInstallable] = useState(false)
  // let deferredPrompt

  // useEffect(() => {
  //   window.addEventListener('beforeinstallprompt', (e) => {
  //     // Prevent the mini-infobar from appearing on mobile
  //     e.preventDefault()
  //     console.log('e', e)
  //     // Stash the event so it can be triggered later.
  //     deferredPrompt = e
  //     // Update UI notify the user they can install the PWA
  //     setInstallable(true)
  //   })
  //
  //   window.addEventListener('appinstalled', () => {
  //     // Log install to analytics
  //     console.log('INSTALL: Success')
  //   })
  // }, [])

  const signoutUser = async () => {
    await signout()
    await bindLoggedIn(false)
    await bindDbUser(null)
    await bindUser(null)
    sessionStorage.clear()
    history.push('/')
  }

  const deactivateUser = async () => {
    if (window.confirm('Are you sure to deactivate?')) {
      const res = await update('users', currentUser.id, { deactivate: true })
      await bindDbUser({ ...currentUser, deactivate: true })
      if (res.status === 200) {
        alert('Successfully deactivated')
        await signoutUser()
      } else {
        alert('Successfully went wrong. Try later.')
      }
    }
  }

  const deleteUser = async () => {
    alert('To delete your account, please give us an email at letsgtok@gmail.com')
    // await remove('users', dbUser.id)
    // await removeProfile()
    // history.push('/profile_deleted')
  }

  const comeBackAlert = async () => {
    alert('We work hard for you here. Come back later please.')
    // await remove('users', dbUser.id)
    // await removeProfile()
    // history.push('/profile_deleted')
  }

  const contactUs = async () => {
    alert('Contact us at letsgtok@gmail.com')
  }

  const inviteFriend = async () => {
    alert('Share this app link - https://app.letsgtok.com')
  }

  const handlePrivateAcc = async () => {
    const res = await update('users', currentUser.id, { private: !currentUser.private })
    await bindDbUser({ ...currentUser, private: !currentUser.private })
    if (res.status !== 200) {
      alert('Successfully went wrong. Try later.')
    }
  }

  // const installPrompt = () => {
  //   deferredPrompt.prompt()
  //   deferredPrompt.userChoice().then((choiceResult) => {
  //     if (choiceResult.outcome === 'accepted') {
  //       console.log('User accepted A2HS prompt')
  //     } else {
  //       console.log('User denied A2HS prompt')
  //     }
  //     deferredPrompt = null
  //   })
  // }

  return (
    <div>
      <HeaderComponent />
      <div>
        <div className='dashboard-content'>
          <div className='container settings-wrapper desktop-align-center'>
            <div className='section'>
              <div className='section-header'>Personal zone</div>
              <ul className='section-list'>
                <li>
                  <div className='d-flex flex-row align-items-center justify-content-between'>
                    <span className='option-name' htmlFor="customSwitch1">Private account</span>
                    <div className="custom-control custom-switch">
                      <input type="checkbox" className="custom-control-input" id="private" onChange={handlePrivateAcc} checked={currentUser.private || false} />
                      <label className="custom-control-label" htmlFor="private"></label>
                    </div>
                  </div>
                </li>
                <li>
                  <Link to='/app/settings/change_password' className='d-flex flex-row align-items-center justify-content-between'>
                    <span className='option-name'>Change password</span>
                  </Link>
                </li>
                <li>
                  <Link to='/app/wallet_settings' className='d-flex flex-row align-items-center justify-content-between'>
                    <span className='option-name'>Wallet settings</span>
                  </Link>
                </li>
              </ul>
              <ul className='section-list d-none'>
                <li>
                  <Link to='/app/settings/edit_profile' className='row'>
                    <img src={require('assets/svgs/EditProfile.svg').default} className='scale-1-1 col-2' alt='Edit' />
                    <span className='option-name col-8'>Edit profile</span>
                    <img src={require('assets/svgs/AngleRight.svg').default} className='option-open col-2' alt='Open' />
                  </Link>
                </li>
                <li>
                  <Link to='/app/settings/change_password' className='row'>
                    <img src={require('assets/svgs/ChangePassword.svg').default} className='scale-1-1 col-2' alt='ChangePassword' />
                    <span className='option-name col-8'>Change password</span>
                    <img src={require('assets/svgs/AngleRight.svg').default} className='option-open col-2' alt='Open' />
                  </Link>
                </li>
                <li className=''>
                  <Link to='/app/settings/purchase_orders' className='row'>
                    <img src={require('assets/svgs/Payments.svg').default} className='scale-1-4 col-2' alt='Payments' />
                    <span className='option-name col-8'>Purchase orders</span>
                    <img src={require('assets/svgs/AngleRight.svg').default} className='option-open col-2' alt='Open' />
                  </Link>
                </li>
                <li className=''>
                  <Link to='/app/settings/payment_cards' className='row'>
                    <img src={require('assets/svgs/Payments.svg').default} className='scale-1-4 col-2' alt='Payments' />
                    <span className='option-name col-8'>Payment cards</span>
                    <img src={require('assets/svgs/AngleRight.svg').default} className='option-open col-2' alt='Open' />
                  </Link>
                </li>
                <li className=''>
                  <Link to='/app/settings/permissions' className='row'>
                    <img src={require('assets/svgs/Permission.svg').default} className='scale-1-2 col-2' alt='Permission' />
                    <span className='option-name col-8'>Permissions</span>
                    <img src={require('assets/svgs/AngleRight.svg').default} className='option-open col-2' alt='Open' />
                  </Link>
                </li>
                <li className=''>
                  <Link to='/app/settings' className='row' onClick={comeBackAlert}>
                    <img src={require('assets/svgs/Preferences.svg').default} className='scale-0-9 col-2' alt='Preferences' />
                    <span className='option-name col-8'>Notification preferences</span>
                    <img src={require('assets/svgs/AngleRight.svg').default} className='option-open col-2' alt='Open' />
                  </Link>
                </li>
              </ul>
            </div>
            <div className='section d-none'>
              <div className='section-header'>Legal zone</div>
              <ul className='section-list'>
                <li>
                  <Link to='/app/settings' className='row' onClick={comeBackAlert}>
                    <img src={require('assets/svgs/Terms.svg').default} className='col-2' alt='Terms' />
                    <span className='option-name col-8'>Terms of service</span>
                    <img src={require('assets/svgs/AngleRight.svg').default} className='option-open col-2' alt='Open' />
                  </Link>
                </li>
                <li>
                  <Link to='/app/settings' className='row' onClick={comeBackAlert}>
                    <img src={require('assets/svgs/PrivacyPolicy.svg').default} className='scale-1-4 col-2' alt='PrivacyPolicy' />
                    <span className='option-name col-8'>Privacy policy</span>
                    <img src={require('assets/svgs/AngleRight.svg').default} className='option-open col-2' alt='Open' />
                  </Link>
                </li>
                <li>
                  <Link to='/app/settings' className='row' onClick={comeBackAlert}>
                    <img src={require('assets/svgs/UserAgreement.svg').default} className='scale-1-4 col-2' alt='UserAgreement' />
                    <span className='option-name col-8'>User agreement</span>
                    <img src={require('assets/svgs/AngleRight.svg').default} className='option-open col-2' alt='Open' />
                  </Link>
                </li>
                <li>
                  <Link to='/app/settings' className='row' onClick={comeBackAlert}>
                    <img src={require('assets/svgs/DataPrivacy.svg').default} className='col-2' alt='DataPrivacy' />
                    <span className='option-name col-8'>Data policy</span>
                    <img src={require('assets/svgs/AngleRight.svg').default} className='option-open col-2' alt='Open' />
                  </Link>
                </li>
              </ul>
            </div>
            <div className='section d-none'>
              <div className='section-header'>Support Zone</div>
              <ul className='section-list'>
                <li>
                  <Link to='/app/settings' className='row'>
                    <img src={require('assets/svgs/Workflow.svg').default} className='scale-0-9 col-2' alt='Workflow' />
                    <span className='option-name col-8 bn'>Install app</span>
                    <img src={require('assets/svgs/AngleRight.svg').default} className='option-open col-2 d-none' alt='Open' />
                  </Link>
                </li>
                <li>
                  <Link to='/app/settings' className='row' onClick={inviteFriend}>
                    <img src={require('assets/svgs/Workflow.svg').default} className='scale-0-9 col-2' alt='Workflow' />
                    <span className='option-name col-8'>Invite my friend</span>
                    <img src={require('assets/svgs/AngleRight.svg').default} className='option-open col-2 d-none' alt='Open' />
                  </Link>
                </li>
                <li className=''>
                  <Link to='/app/settings' className='row' onClick={comeBackAlert}>
                    <img src={require('assets/svgs/Workflow.svg').default} className='scale-0-9 col-2' alt='Workflow' />
                    <span className='option-name col-8'>App workflow</span>
                    <img src={require('assets/svgs/AngleRight.svg').default} className='option-open col-2' alt='Open' />
                  </Link>
                </li>
                <li className=''>
                  <Link to='/app/settings' className='row' onClick={comeBackAlert}>
                    <img src={require('assets/svgs/Faq.svg').default} className='scale-1-1 col-2' alt='Faq' />
                    <span className='option-name col-8'>Faq's</span>
                    <img src={require('assets/svgs/AngleRight.svg').default} className='option-open col-2' alt='Open' />
                  </Link>
                </li>
                <li>
                  <Link to='/app/settings' className='row' onClick={contactUs}>
                    <img src={require('assets/svgs/Support.svg').default} className='scale-1-3 col-2' alt='Support' />
                    <span className='option-name col-8'>Contact us</span>
                    <img src={require('assets/svgs/AngleRight.svg').default} className='option-open col-2 d-none' alt='Open' />
                  </Link>
                </li>
              </ul>
            </div>
            <div className='section'>
              <div className='section-header'>Cautious zone</div>
              <ul className='section-list'>
                <li>
                  <div className='d-flex flex-row align-items-center justify-content-between'>
                    <span className='option-name' htmlFor="customSwitch1" onClick={signoutUser}>Logout</span>
                  </div>
                </li>
                <li className='d-none'>
                  <div className='d-flex flex-row align-items-center justify-content-between'>
                    <span className='option-name' htmlFor="customSwitch1" onClick={deactivateUser}>Deactivate account</span>
                  </div>
                </li>
                <li onClick={deleteUser} className='d-none'>
                  <div className='row pointer'>
                    <img src={require('assets/svgs/DeleteAccount.svg').default} className='scale-0-9 col-2' alt='DeleteAccount' />
                    <span className='option-name col-8'>Delete account</span>
                    <img src={require('assets/svgs/AngleRight.svg').default} className='option-open col-2 d-none' alt='Open' />
                  </div>
                </li>
              </ul>
            </div>
            {
              currentUser.admin && <AdminZoneComponent currentUser={currentUser} />
            }
          </div>
        </div>
      </div>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    bindLoggedIn: (content) => dispatch(SetLoggedIn(content)),
    bindUser: (content) => dispatch(SetUser(content)),
    bindDbUser: (content) => dispatch(SetDbUser(content))
  }
}

export default connect(
  null,
  mapDispatchToProps
)(SettingsComponent)
