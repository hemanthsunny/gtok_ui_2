import { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'

// This component solves the ScrollToTop issue in BrowserRouter
// Ref: https://stackoverflow.com/questions/55112136/scroll-restore-to-top-on-navigation-change
class ScrollIntoView extends PureComponent {
  componentDidMount = () => window.scrollTo(0, 0)

  componentDidUpdate = prevProps => {
    if (this.props.location !== prevProps.location) window.scrollTo(0, 0)
  }

  render = () => this.props.children
}

export default withRouter(ScrollIntoView)
