import { createSlice } from '@reduxjs/toolkit'

// project imports
import { BASE_URL_API } from '../../config'
import { apiCall, apiCallWithBody } from '../../contexts/api'
import { dispatch } from '../index'

const initialState = {
  error: null,
  users: [],
  loading: false,
  success: false
}

const slice = createSlice({
  name: 'superUsers',
  initialState,
  reducers: {
    hasError (state, action) {
      state.error = action.payload
    },
    resetError (state, action) {
      state.error = action.payload
    },
    setUserInfoSuccess (state, action) {
      state.users = action.payload
    },
    setLoader (state, action) {
      state.loading = action.payload
    },
    setSuccess (state, action) {
      state.success = action.payload
    }
  }
})


export default slice.reducer


export function getUsers () {
  return async () => {
    try {
      dispatch(slice.actions.setLoader(true))
      const { data } = await apiCall({ url: `${BASE_URL_API}/Admins` })
      dispatch(slice.actions.setUserInfoSuccess(data))
      dispatch(slice.actions.setLoader(false))
      dispatch(slice.actions.setSuccess(true))
    } catch (error) {
      dispatch(slice.actions.hasError(new Error('Error al obtener la lista de Super Usuarios')))
      dispatch(slice.actions.setLoader(false))
      dispatch(slice.actions.setSuccess(false))
    }
  }
}

export function deleteUser (key, email) {
  return async () => {
    try {
      dispatch(slice.actions.setLoader(true))
      const res = await apiCall({ url: `${BASE_URL_API}/Admins/${key}`, method: 'DELETE' })
      if (res && res.message === 'deleted') await getUsers()()
      else {
        dispatch(slice.actions.setLoader(false))
        dispatch(slice.actions.setSuccess(false))
        dispatch(slice.actions.hasError(new Error('Error al eliminar el Super Usuario Tam Graph pero ha sido eliminado de Starlink Tangerine Metrics')))
      }
    } catch (error) {
      dispatch(slice.actions.hasError(new Error('Error al eliminar el Super Usuario')))
      dispatch(slice.actions.setSuccess(false))
      dispatch(slice.actions.setLoader(false))
    }
  }
}

export function addUser (data) {
  return async () => {
    try {
      dispatch(slice.actions.setLoader(true))
      const res = await apiCallWithBody({ url: `${BASE_URL_API}/Admins`, body: JSON.stringify(data) })
      if (res && res.message === 'success') await getUsers()()
      else {
        dispatch(slice.actions.setLoader(false))
        dispatch(slice.actions.setSuccess(false))
        dispatch(slice.actions.hasError(new Error('Error al agregar el Super Usuario, intente con otro correo electrónico')))
      }
    } catch (error) {
      dispatch(slice.actions.hasError(new Error('Error al agregar el Super Usuario, intente con otro correo electrónico')))
      dispatch(slice.actions.setLoader(false))
      dispatch(slice.actions.setSuccess(false))
    }
  }
}

export function modifyUser (data) {
  return async () => {
    // console.log(data)
    try {
      dispatch(slice.actions.setLoader(true))
      const res = await apiCallWithBody({ url: `${BASE_URL_API}/Admins/${data.id}`, method: 'PUT', body: JSON.stringify(data) })
      // console.log(res)
      if (res && res.message === 'success') await getUsers()()
      else {
        dispatch(slice.actions.setLoader(false))
        dispatch(slice.actions.setSuccess(false))
        dispatch(slice.actions.hasError(new Error('Error al editar el Super Usuario, intente con otro correo electrónico')))
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error))
      dispatch(slice.actions.hasError(new Error('Error al editar el Super Usuario, intente con otro correo electrónico')))
      dispatch(slice.actions.setLoader(false))
      dispatch(slice.actions.setSuccess(false))
    }
  }
}


export function resetErrorUsed () {
  return async () => { dispatch(slice.actions.resetError(null)) }
}
