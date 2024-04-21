/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

// third
import { toast } from 'sonner'

// mui imports
import { Box } from '@mui/material'

// project imports
import useAuth from '../../hooks/useAuth'
import { useDispatch, useSelector } from '../../store'
import AsideBackButton from '../../ui-components/AsideBackButton'
import HeaderSearchBox from '../../ui-components/HeaderSearchBox'
import MainMirrorFade from '../../ui-components/MainMirrorFade'
import ModalDelete from '../../ui-components/ModalDelete'
import Add from './Add'
import Edit from './Edit'
import UserTable from './components/UserTable'

// services
import { deleteUser, getUsers, resetErrorUsed } from '../../store/slices/users'

const toastId = toast()

const UserList = () => {
  const { user } = useAuth()
  const dispatch = useDispatch()

  const { users, error, success, loading, successMsg } = useSelector((state) => state.users)

  const navigate = useNavigate()
  const { clientid } = useParams()
  const { state } = useLocation()

  const [mainData, setMainData] = useState([])
  const [data, setData] = useState(mainData)

  const [dataSelected, setDataSelected] = useState(null)

  const [view, setView] = useState(null)
  const [collapsed, setCollapsed] = useState(false)

  const [open, setOpen] = useState(false)

  const handleCancel = async (e) => {
    setView(null)
    setCollapsed(false)
    setDataSelected(null)
    setOpen(false)
  }

  const handleAdd = (row) => {
    setDataSelected(row)
    setCollapsed(current => !current)
    setView(1)
  }

  const handleEdit = (row) => {
    setDataSelected(row)
    setCollapsed(current => !current)
    setView(0)
  }

  const handleClickOpen = (row) => {
    setDataSelected(row)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleDelete = (id) => {
    toast.loading('Cargando...', { id: toastId })
    dispatch(deleteUser(id, clientid, dataSelected.email))
    handleCancel()
  }

  const handleSearch = (e, filters) => {
    if (filters.length === 0) {
      setData(mainData)
    } else {
      const newRows = []
      const available = mainData

      for (let j = 0; j < filters.length; j += 1) {
        for (let i = 0; i < available.length; i += 1) {
          if (
            available[i].name.toLowerCase().includes(filters[j].trim().toLowerCase()) ||
            available[i].email.toLowerCase().includes(filters[j].trim().toLowerCase())
          ) {
            if (!newRows.find((value) => value === available[i])) { newRows.push(available[i]) }
          }
        }
      }
      setData(newRows)
    }
  }

  useEffect(() => { if (!clientid) { navigate(-1) } }, [clientid])

  useEffect(() => {
    setMainData(users)
    setData(users)
  }, [users])

  useEffect(() => {
    (async () => {
      dispatch(getUsers(clientid))
    })()

    return () => setDataSelected(null)
  }, [])

  useEffect(() => {
    if (error) {
      toast.error(error?.message, { id: toastId })
      dispatch(resetErrorUsed())
    }
  }, [error])

  useEffect(() => {
    if (success && successMsg) {
      toast.success(successMsg, { id: toastId })
      dispatch(resetErrorUsed())
    }
  }, [success, successMsg])

  const titleList = state?.client ? `Usuarios de ${state.client}` : 'Lista de usuarios'

  return (
    <>
      {(user && user.user && user.user.isPowerUser) && <AsideBackButton inFade handleBack={collapsed ? handleCancel : null} />}

      <Box sx={{ display: 'flex', flex: 1, px: '10%', position: 'relative', flexDirection: 'column' }}>
        <HeaderSearchBox title={titleList} handleOnAdd={handleAdd} handleSearch={handleSearch} open={!collapsed} />
        <MainMirrorFade open={!collapsed}>
          <UserTable
            loading={loading}
            data={data}
            handleClickOpen={handleClickOpen}
            handleEdit={handleEdit}
          />
        </MainMirrorFade>
        <MainMirrorFade open={collapsed} sx={{ position: 'absolute', width: '80%' }}>
          {view ? <Add handleReset={handleCancel} client={clientid} backBtn={user?.user?.isPowerUser === 0} /> : <Edit handleReset={handleCancel} data={dataSelected} backBtn={user?.user?.isPowerUser === 0} />}
        </MainMirrorFade>
      </Box>

      {
        dataSelected &&
          <ModalDelete
            title={data.length === 1 ? 'Precaución!' : 'Eliminar usuario'}
            subtitle={<><b>¿Estás seguro de eliminar al usuario {dataSelected?.name} <i>({dataSelected?.email})</i>?</b> Al dar click en aceptar, esta de acuerdo que no podrá recuperar la información.</>}
            handleClose={handleClose}
            handleDelete={handleDelete}
            open={open}
            id={dataSelected?.id}
          />
      }
    </>
  )
}

export default UserList
