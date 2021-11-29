import { combineReducers } from 'redux'
import authUsers from './AuthUsers'
import subscriptionPlans from './SubscriptionPlans'
import permissions from './Permissions'
import conversations from './Conversations'
import chatMessages from './ChatMessages'
import surveys from './SurveysList'
import alerts from './Alerts'
import posts from './Posts'
import users from './SearchUsers'
import relationships from './Relationships'
import chatbotMessages from './ChatbotMessages'
import purchaseOrders from './PurchaseOrders'
import wallet from './Wallets'
import prices from './Prices'
import transactions from './Transactions'
import audioPlayer from './AudioPlayer'

export default combineReducers({
  subscriptionPlans,
  permissions,
  authUsers,
  conversations,
  chatMessages,
  surveys,
  alerts,
  posts,
  users,
  relationships,
  chatbotMessages,
  purchaseOrders,
  wallet,
  prices,
  transactions,
  audioPlayer
})
