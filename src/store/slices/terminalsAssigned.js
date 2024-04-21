import { createSlice } from '@reduxjs/toolkit'

// project imports
import { BASE_URL_API } from '../../config'
import { apiCall } from '../../contexts/api'
import { dispatch } from '../index'

const initialState = {
  error: null,
  terminals: [],
  pureData: [],
  loading: false,
  success: false
}

const slice = createSlice({
  name: 'terminalsAssigned',
  initialState,
  reducers: {
    hasError (state, action) {
      state.error = action.payload
    },
    resetError (state, action) {
      state.error = action.payload
    },
    setTerminalsInfoSuccess (state, action) {
      state.terminals = action.payload
    },
    setTerminalsMainInfoSuccess (state, action) {
      state.pureData = action.payload
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

export async function convertToTreeViewData (info) {
  const jsonArray = [...info]
  // Organizar el arreglo por clientid y fullname
  jsonArray.sort((a, b) => {
    if (a.clientid !== b.clientid) {
      return a.clientid.toString().localeCompare(b.clientid.toString())
    } else {
      return a.fullname.localeCompare(b.fullname)
    }
  })

  const result = []

  let currentUser = null
  let currentClientId = null
  let clientGroup = null
  let userGroup = null
  let childrenGroup = null

  jsonArray.forEach(({ fullname, dashboardName, name, clientid, assignid, clientname, id, alias, email, service, assignuserid }, index) => {
    if (clientid !== currentClientId && currentClientId !== null) result.push(clientGroup)
    if (clientid !== currentClientId) {
      currentClientId = clientid

      clientGroup = {
        key: currentClientId,
        data: { fullname: '', dashboardName: '', name: '', clientid: '', assignid: '', clientname, id: '', alias: '', service: '', assignuserid: '' },
        children: []
      }
    }

    if (fullname !== currentUser) {
      currentUser = fullname
      childrenGroup = [{
        key: fullname + assignid + id + clientid,
        data: { fullname: '', dashboardName, name, clientid, assignid, clientname: '', id, alias, service, assignuserid }
      }]
      userGroup = {
        key: fullname + assignid + id,
        data: { fullname: `${fullname} (${email})`, dashboardName, name, clientid, assignid, clientname: '', id, alias, service, assignuserid }
      }
      clientGroup.children.push(userGroup)
    } else {
      userGroup.data = { fullname: `${fullname} (${email})` }
      userGroup.children = childrenGroup
      userGroup.children.push({
        key: fullname + assignid + id + clientid,
        data: { fullname: '', dashboardName, name, clientid, assignid, clientname: '', id, alias, service, assignuserid }
      })
    }
  })
  result.push(clientGroup)

  return result
}

export function parseObject (data) {
  return async () => {
    dispatch(slice.actions.setTerminalsMainInfoSuccess(data))
    if (Array.isArray(data)) {
      const info = await convertToTreeViewData(data)
      dispatch(slice.actions.setTerminalsInfoSuccess(info))
      dispatch(slice.actions.setLoader(false))
      dispatch(slice.actions.setSuccess(true))
    }
  }
}

export function getAllTerminalsAssigned (clientid) {
  return async () => {
    try {
      dispatch(slice.actions.setLoader(true))
      let { data } = await apiCall({ url: `${BASE_URL_API}/getAsigment` })
      if (clientid) data = data.filter((op) => (op.clientid === clientid))
      await parseObject(data)()
    } catch (error) {
      console.log(error)
      dispatch(slice.actions.hasError(new Error('Error al obtener la lista de terminales')))
      dispatch(slice.actions.setLoader(false))
      dispatch(slice.actions.setSuccess(false))
    }
  }
}

export function getTerminalsByUser (id) {
  return async () => {
    try {
      dispatch(slice.actions.setLoader(true))
      const { data: res } = await apiCall({ url: `${BASE_URL_API}/getAsigmentUser?UserId=${id}` })
      if (res) {
        dispatch(slice.actions.setTerminalsMainInfoSuccess(res))
        await parseObject(res)()
      } else throw new Error('error')
    } catch (error) {
      dispatch(slice.actions.hasError(new Error('Error al obtener la lista de terminales del usuario')))
      dispatch(slice.actions.setLoader(false))
      dispatch(slice.actions.setSuccess(false))
    }
  }
}

export function deleteTerminal (email, id) {
  return async () => {
    try {
      dispatch(slice.actions.setLoader(true))
      const res = await apiCall({ url: `${BASE_URL_API}/Assigns/${id}`, method: 'DELETE' })
      if (res) {
        return true
      } else {
        dispatch(slice.actions.setLoader(false))
        dispatch(slice.actions.setSuccess(false))
        dispatch(slice.actions.hasError(new Error('Error al eliminar la terminal')))
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error))
      dispatch(slice.actions.hasError(new Error('Error al eliminar la terminal')))
      dispatch(slice.actions.setLoader(false))
      dispatch(slice.actions.setSuccess(false))
    }
  }
}

export function resetErrorUsed () {
  return async () => { dispatch(slice.actions.resetError(null)) }
}
