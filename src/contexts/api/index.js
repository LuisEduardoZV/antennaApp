/* eslint-disable consistent-return */
import { BASE_URL_API } from '../../config'

export async function apiCallRoutine (type) {
  try {
    await fetch(`${BASE_URL_API}/UpdateTeam?type=${type}`, {
      method: 'POST',
      body: JSON.stringify({}),
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }),
      mode: 'cors'
    })
      .then(async (response) => {
        if (response.ok) {
          if (response.status === 204) return true
          return await response.json() ?? response.ok
        }
        return false
      })
      .then((data) => data)
      .catch((error) => {
        console.log(error)
        return error
      })
  } catch (error) {
    Promise.reject(error)
  }
}

export async function apiCall ({
  url,
  method = 'GET',
  headers = new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  })
}) {
  try {
    const datos = await fetch(url, {
      method,
      headers
    })
      .then(async (response) => {
        if (response.ok) {
          if (response.status === 204) return true
          return await response.json() ?? response.ok
        }
        return false
      })
      .then((data) => data)
      .catch((error) => {
        console.log(error)
        return error
      })
    return datos
  } catch (error) {
    Promise.reject(error)
    return error
  }
}

export async function apiCallWithBody ({
  url,
  method = 'POST',
  body = JSON.stringify({}),
  headers = new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }),
  extras = {}
}) {
  try {
    const datos = await fetch(url, {
      method,
      body,
      headers,
      ...extras
    })
      .then((response) => {
        if (response.ok) {
          if (response.status === 204) return []
          return response.json()
        }
        return false
      })
      .then((data) => data)
    return datos
  } catch (error) {
    Promise.reject(error)
  }
}
