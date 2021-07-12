import React from 'react'
import { Switch, Route, Redirect, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import AuthRoute from './index'

import {
  LoginComponent,
  LogoutComponent,
  SignupComponent,
  SignupSuccessComponent,
  AlertsComponent,
  DisplayComponent,
  PaymentsComponent,
  SearchComponent,
  PendingRequestsComponent,
  SearchFollowersComponent,
  SearchFollowingComponent,
  ForgotPasswordComponent,
  DeleteProfileComponent,
  ErrorComponent,
  CreateChatComponent,
  SupportComponent,
  ChatsComponent,
  ShowChatComponent,
  CreatePostComponent,
  CreateActivityComponent,
  SettingsComponent,
  PermissionsComponent,
  ChangePasswordComponent,
  EditProfileComponent,
  ProfileComponent,
  ChallengesComponent,
  ShowPostsComponent,
  ShowActivitiesComponent,
  ShowUserPostsComponent,
  ShowUserActivitiesComponent,
  PaymentCardsComponent,
  AddPaymentCardComponent,
  WalletComponent,
  AddPriceComponent,
  UnlockProfileComponent,
  PurchaseOrdersComponent,
  ShowPostComponent,
  ShowOpenPostsComponent,
  ShowOpenActivitiesComponent
} from 'components'

const LandingComponent = () => {
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    return (<Redirect to="/login" />)
  }
  return (<Redirect to="/app/posts" />)
}

export const Routes = (props) => {
  const location = useLocation()
  return (
    <main style={{ position: 'relative', overflow: 'hidden' }}>
      <AnimatePresence exitBeforeEnter>
        <Switch location={location} key={location.pathname}>
          <Route exact path="/" component={LandingComponent} />
          <Route path="/login" component={LoginComponent} />
          <Route path="/logout" component={LogoutComponent} />
          <Route exact path="/signup" component={SignupComponent} />
          <Route exact path="/signup_success" component={SignupSuccessComponent} />
          <Route exact path="/forgot_password" component={ForgotPasswordComponent} />
          <Route exact path="/profile_deleted" component={DeleteProfileComponent} />
          <Route exact path="/error" component={ErrorComponent} />
          <Route exact path="/posts" component={ShowOpenPostsComponent} />
          <Route exact path="/activities" component={ShowOpenActivitiesComponent} />
          <AuthRoute exact path="/app" component={LandingComponent} />
          <AuthRoute exact path="/app/alerts" component={AlertsComponent} />
          <AuthRoute exact path="/app/create_post" component={CreatePostComponent} />
          <AuthRoute exact path="/app/create_activity" component={CreateActivityComponent} />
          <AuthRoute exact path="/app/posts" component={ShowPostsComponent} />
          <AuthRoute exact path="/app/posts/:post_id" component={ShowPostComponent} />
          <AuthRoute exact path="/app/activities" component={ShowActivitiesComponent} />
          <AuthRoute exact path="/app/profile" component={ProfileComponent} />
          <AuthRoute exact path="/app/profile/:user_id" component={ProfileComponent} />
          <AuthRoute exact path="/app/profile/:user_id/posts" component={ShowUserPostsComponent} />
          <AuthRoute exact path="/app/profile/:user_id/activities" component={ShowUserActivitiesComponent} />
          <AuthRoute exact path="/app/profile/:user_id/unlock_profile" component={UnlockProfileComponent} />
          <AuthRoute exact path="/app/profile/:user_id/add_price" component={AddPriceComponent} />
          <AuthRoute exact path="/app/profile/:user_id/wallet" component={WalletComponent} />
          {/* <AuthRoute exact path="/app/profile/:name" component={PublicProfileComponent} /> */}
          <AuthRoute exact path="/app/settings" component={SettingsComponent} />
          <AuthRoute exact path="/app/settings/edit_profile" component={EditProfileComponent} />
          <AuthRoute exact path="/app/settings/permissions" component={PermissionsComponent} />
          <AuthRoute exact path="/app/settings/change_password" component={ChangePasswordComponent} />
          <AuthRoute exact path="/app/settings/purchase_orders" component={PurchaseOrdersComponent} />
          <AuthRoute exact path="/app/settings/payment_cards" component={PaymentCardsComponent} />
          <AuthRoute exact path="/app/settings/add_payment_card" component={AddPaymentCardComponent} />
          <AuthRoute exact path="/app/payments" component={PaymentsComponent} />
          <AuthRoute exact path="/app/search" component={SearchComponent} />
          <AuthRoute exact path="/app/requests" component={PendingRequestsComponent} />
          <AuthRoute exact path="/app/following" component={SearchFollowingComponent} />
          <AuthRoute exact path="/app/followers" component={SearchFollowersComponent} />
          <AuthRoute exact path="/app/question/:id" component={DisplayComponent} />
          <AuthRoute exact path="/app/chats" component={ChatsComponent} />
          <AuthRoute exact path="/app/chats/:id" component={ShowChatComponent} />
          <AuthRoute exact path="/app/chats/new/:id" component={CreateChatComponent} />
          <AuthRoute exact path="/app/new_chat" component={CreateChatComponent} />
          <AuthRoute exact path="/app/support" component={SupportComponent} />
          <AuthRoute exact path="/app/challenges" component={ChallengesComponent} />
          <Redirect to="/" />
        </Switch>
      </AnimatePresence>
    </main>
  )
}

export default Routes
