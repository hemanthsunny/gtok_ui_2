import React from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AuthRoute from "./index";

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
  CreateChatLayerComponent,
  SupportComponent,
  ChatsComponent,
  ShowChatComponent,
  CreatePostComponent,
  CreateActivityComponent,
  ResharePostComponent,
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
  WalletSettingsComponent,
  AddPriceComponent,
  TradePostComponent,
  PurchaseOrdersComponent,
  ShowPostComponent,
  ShowOpenPostsComponent,
  ShowOpenActivitiesComponent,
  ChangePasscodeComponent,
  WalletRechargeComponent,
  WalletWithdrawComponent,
  InviteFriendsComponent,
  ShowTransactionComponent,
  SendCompanyAlertsComponent,
  AnalysisComponent,
} from "components";

const LandingComponent = () => {
  const token = window.sessionStorage.getItem("token");
  if (!token) {
    return <Redirect to="/login" />;
  }
  return <Redirect to="/app/assets" />;
};

export const Routes = (props) => {
  const location = useLocation();

  return (
    <main style={{ position: "relative", overflow: "hidden" }}>
      <AnimatePresence exitBeforeEnter>
        <Switch location={location} key={location.pathname}>
          <Route exact path="/" component={LandingComponent} />
          <Route path="/login" component={LoginComponent} />
          <Route path="/logout" component={LogoutComponent} />
          <Route exact path="/signup" component={SignupComponent} />
          <Route exact path="/signup/:username" component={SignupComponent} />
          <Route
            exact
            path="/signup_success"
            component={SignupSuccessComponent}
          />
          <Route
            exact
            path="/forgot_password"
            component={ForgotPasswordComponent}
          />
          <Route
            exact
            path="/profile_deleted"
            component={DeleteProfileComponent}
          />
          <Route exact path="/error" component={ErrorComponent} />
          <Route exact path="/posts" component={ShowOpenPostsComponent} />
          <Route
            exact
            path="/activities"
            component={ShowOpenActivitiesComponent}
          />
          <AuthRoute exact path="/app" component={LandingComponent} />
          <AuthRoute exact path="/app/alerts" component={AlertsComponent} />
          <AuthRoute
            exact
            path="/app/create_asset"
            component={CreatePostComponent}
          />
          <AuthRoute
            exact
            path="/app/reshare_asset"
            component={ResharePostComponent}
          />
          <AuthRoute
            exact
            path="/app/create_activity"
            component={CreateActivityComponent}
          />
          <AuthRoute exact path="/app/assets" component={ShowPostsComponent} />
          <AuthRoute
            exact
            path="/app/assets/:post_id"
            component={ShowPostComponent}
          />
          <AuthRoute
            exact
            path="/app/activities"
            component={ShowActivitiesComponent}
          />
          <AuthRoute exact path="/app/profile" component={ProfileComponent} />
          <AuthRoute
            exact
            path="/app/profile/:username"
            component={ProfileComponent}
          />
          <AuthRoute
            exact
            path="/app/profile/:user_id/posts"
            component={ShowUserPostsComponent}
          />
          <AuthRoute
            exact
            path="/app/profile/:user_id/activities"
            component={ShowUserActivitiesComponent}
          />
          <AuthRoute
            exact
            path="/app/trade/:post_id"
            component={TradePostComponent}
          />
          <AuthRoute
            exact
            path="/app/profile/:user_id/add_price"
            component={AddPriceComponent}
          />
          <AuthRoute exact path="/app/wallet" component={WalletComponent} />
          <AuthRoute
            exact
            path="/app/wallet_settings"
            component={WalletSettingsComponent}
          />
          {/* <AuthRoute exact path="/app/profile/:name" component={PublicProfileComponent} /> */}
          <AuthRoute exact path="/app/settings" component={SettingsComponent} />
          <AuthRoute
            exact
            path="/app/settings/edit_profile"
            component={EditProfileComponent}
          />
          <AuthRoute
            exact
            path="/app/settings/permissions"
            component={PermissionsComponent}
          />
          <AuthRoute
            exact
            path="/app/settings/change_password"
            component={ChangePasswordComponent}
          />
          <AuthRoute
            exact
            path="/app/settings/purchase_orders"
            component={PurchaseOrdersComponent}
          />
          <AuthRoute
            exact
            path="/app/settings/payment_cards"
            component={PaymentCardsComponent}
          />
          <AuthRoute
            exact
            path="/app/settings/add_payment_card"
            component={AddPaymentCardComponent}
          />
          <AuthRoute exact path="/app/payments" component={PaymentsComponent} />
          <AuthRoute exact path="/app/search" component={SearchComponent} />
          <AuthRoute
            exact
            path="/app/requests"
            component={PendingRequestsComponent}
          />
          <AuthRoute
            exact
            path="/app/following"
            component={SearchFollowingComponent}
          />
          <AuthRoute
            exact
            path="/app/followers"
            component={SearchFollowersComponent}
          />
          <AuthRoute
            exact
            path="/app/question/:id"
            component={DisplayComponent}
          />
          <AuthRoute exact path="/app/chats" component={ChatsComponent} />
          <AuthRoute
            exact
            path="/app/chats/:id"
            component={ShowChatComponent}
          />
          <AuthRoute
            exact
            path="/app/chats/new/:id"
            component={CreateChatLayerComponent}
          />
          <AuthRoute
            exact
            path="/app/new_chat"
            component={CreateChatComponent}
          />
          <AuthRoute exact path="/app/support" component={SupportComponent} />
          <AuthRoute
            exact
            path="/app/challenges"
            component={ChallengesComponent}
          />
          <AuthRoute
            exact
            path="/app/change_passcode"
            component={ChangePasscodeComponent}
          />
          <AuthRoute
            exact
            path="/app/recharge"
            component={WalletRechargeComponent}
          />
          <AuthRoute
            exact
            path="/app/withdraw"
            component={WalletWithdrawComponent}
          />
          <AuthRoute
            exact
            path="/app/transactions/:id"
            component={ShowTransactionComponent}
          />
          <AuthRoute
            exact
            path="/app/invite_friends"
            component={InviteFriendsComponent}
          />
          <AuthRoute
            exact
            path="/app/send_company_alerts"
            component={SendCompanyAlertsComponent}
          />
          <AuthRoute exact path="/app/analysis" component={AnalysisComponent} />
          <Redirect to="/" />
        </Switch>
      </AnimatePresence>
    </main>
  );
};

export default Routes;
