import moment from 'moment'

const hideCurrentYear = (date) => {
  return (moment(date).format('YY') === moment().format('YY')) ? moment(date).format('D MMM') : moment(date).format('D MMM \'YY')
}

export default hideCurrentYear
