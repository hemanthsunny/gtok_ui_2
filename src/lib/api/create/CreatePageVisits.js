import { add, timestamp } from 'firebase_config'

export const createPageVisits = async (currentUser) => {
  if (currentUser.permissions.recordPageVisits) {
    let data = {
      userId: currentUser && currentUser.id,
      sourcePageUrl: window.location.pathname,
      timestamp
    }

    if (navigator.geolocation && currentUser.permissions.locationAccess) {
      navigator.geolocation.getCurrentPosition((position) => {
        data = Object.assign(data, {
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        })
      })
    }
    await fetch('https://extreme-ip-lookup.com/json/')
      .then(res => res.json())
      .then(response => {
        data = Object.assign(data, { deviceDetails: response })
      })
      .catch((data, status) => {
        console.log('Request failed')
      })
    const res = await add('pageVisits', data)
    return res
  }
  return {}
}
