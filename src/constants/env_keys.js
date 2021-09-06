export const ENV = {
  BASE_URL: ((process.env.REACT_APP_ENV === 'local' || location.hostname === 'localhost') && process.env.REACT_APP_API_URL) || (process.env.REACT_APP_ENV === 'development' && process.env.REACT_APP_API_URL_DEV) || (process.env.REACT_APP_ENV === 'production' && process.env.REACT_APP_API_URL_PROD),
  MAIL_ID: process.env.REACT_APP_MAIL_ID,
  MAIL_PASS: process.env.REACT_APP_MAIL_PASS
}
