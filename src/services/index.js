import axios from 'axios'
import { ENV } from 'constants/env_keys'

export const post = async (url, data = {}) => {
  const res = await axios.post(
    ENV.BASE_URL + url,
    data,
    {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${window.sessionStorage.getItem('token')}`
      }
    }
  )
  return res
}

export const get = async (url, data = {}) => {
  const res = await axios.get(
    ENV.BASE_URL + url,
    data,
    {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${window.sessionStorage.getItem('token')}`
      }
    }
  )
  return res
}
