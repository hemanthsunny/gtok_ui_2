import React, { Component } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { connect } from 'react-redux'
import Routes from 'routes/Routes'
import {
  getQuery,
  firestore,
  auth,
  update,
  timestamp
} from './firebase_config'
import './App.css'

import { CookieNotification, NoInternetNotification, LoadingComponent, ScrollIntoViewComponent } from 'components'
import { SetDbUser, SetUser, SetLoggedIn } from 'store/actions'

export const AuthContext = React.createContext()

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: true,
      user: null,
      dbUser: null,
      loggedIn: false
    }
  }

  componentDidMount () {
    const { bindUser, bindLoggedIn, bindDbUser } = this.props
    auth.onAuthStateChanged(async (user) => {
      const isAuthenticated = user != null
      if (isAuthenticated) {
        bindUser(user.toJSON())
        bindLoggedIn(true)
        user.getIdToken().then(async (accessToken) => {
          window.sessionStorage.setItem('token', accessToken)
          /* Get user details */
          const currentUser = user.toJSON()
          const orgUser = await getQuery(
            firestore.collection('users').where('email', '==', currentUser.email).get()
          )
          await update('users', orgUser[0].id, { lastSigninTime: timestamp })
          bindDbUser(orgUser[0])
          this.setState({
            ...this.state, loading: false
          })
        })
      } else {
        this.setState({
          ...this.state, loading: false
        })
      }
    })
  }

  render () {
    return (
      this.state.loading
        ? <div><LoadingComponent /></div>
        : <div>
          <CookieNotification />
          <NoInternetNotification />
          <Router>
            <ScrollIntoViewComponent>
              <Routes />
            </ScrollIntoViewComponent>
          </Router>
        </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { currentUser, dbUser, loggedIn } = state.authUsers
  return { currentUser, dbUser, loggedIn }
}

const mapDispatchToProps = (dispatch) => {
  return {
    bindUser: (content) => dispatch(SetUser(content)),
    bindDbUser: (content) => dispatch(SetDbUser(content)),
    bindLoggedIn: (content) => dispatch(SetLoggedIn(content))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
