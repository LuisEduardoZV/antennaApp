/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// third
import { isEmpty } from 'lodash'
import { toast } from 'sonner'

// mui imports
import { Box, Grid } from '@mui/material'

// project imports
import useAuth from '../../hooks/useAuth'
import { useDispatch, useSelector } from '../../store'
import AsideBackButton from '../../ui-components/AsideBackButton'
import HeaderSearchBox from '../../ui-components/HeaderSearchBox'
import ModalDelete from '../../ui-components/ModalDelete'
import ContactDetails from './ContactDetails'
import ContactEdit from './ContactEdit'
import ContactListContainer from './components/ContactListContainer'

// services
import { deleteContact, getContacts, resetErrorUsed } from '../../store/slices/contacts'

const toastId = toast()

const Contacts = () => {
  const { user: userProfile } = useAuth()

  const { clientid } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { contacts: mainData, error, success, loading } = useSelector((state) => state.contacts)

  const [render, forceRender] = useState(false)

  const [contacts, setContacts] = useState(mainData)
  const [user, setUser] = useState({})
  const [data, setData] = useState({})

  const needRender = () => forceRender((prev) => !prev)

  const convertData = (userData) =>
    userData.reduce((a, curr) => {
      const firstLatter = curr.name[0].toUpperCase()
      if (Object.prototype.hasOwnProperty.call(a, firstLatter)) {
        a[firstLatter].push(curr)
      } else {
        a[firstLatter] = [curr]
      }
      return a
    }, {})

  const onCloseDetails = () => {
    setContactDetails(false)
    setContactEdit(false)
  }

  const handleDelete = async (id) => {
    const idToast = toast.loading('Cargando...')
    dispatch(deleteContact(id, clientid))
    if (success) {
      toast.success('Contacto eliminado correctamente', { id: idToast })
      setOpen(false)
      onCloseDetails()
      needRender()
    }
  }

  useEffect(() => {
    if (!clientid) { navigate(-1) }
    (async () => {
      dispatch(getContacts(clientid))
    })()
  }, [clientid, render])

  useEffect(() => {
    setContacts(mainData)
    setData(convertData(mainData))
  }, [mainData])

  useEffect(() => {
    setData(convertData(contacts))
    if (!isEmpty(user)) {
      const idx = contacts.findIndex((item) => item.id === user.id)
      if (idx > -1) setUser(contacts[idx])
    }
  }, [contacts, user])

  const [contactDetails, setContactDetails] = useState(false)
  const [contactEdit, setContactEdit] = useState(false)
  const [contactAdd, setContactAdd] = useState(false)

  const handleOnAdd = () => {
    setUser({
      id: 0,
      clientid,
      name: '',
      position: '',
      phone: '',
      active: 1,
      note: ''
    })
    setContactDetails(false)
    setContactEdit(true)
    setContactAdd(true)
  }

  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const onActive = (user) => {
    setUser(user)
    setContactDetails(true)
    setContactEdit(false)
    setContactAdd(false)
  }

  const onEdit = (user) => {
    setUser(user)
    setContactDetails(false)
    setContactEdit(true)
    setContactAdd(false)
  }

  const onDelete = (user) => {
    setUser(user)
    setContactEdit(false)
    setContactAdd(false)
    setOpen(true)
  }

  const onEditDetails = () => {
    setContactDetails(false)
    setContactEdit(true)
    setContactAdd(false)
  }

  const onFinish = (u) => {
    if (u) setUser(u)
    setContactDetails(true)
    setContactEdit(false)
    needRender()
  }
  const onCloseEdit = () => {
    setContactDetails(true)
    setContactEdit(false)
    setContactAdd(false)
  }
  const onCloseAdd = () => {
    setContactDetails(false)
    setContactEdit(false)
    setContactAdd(false)
  }

  const handleSearch = (e, filters) => {
    if (filters.length === 0) {
      setContacts(mainData)
    } else {
      const newRows = []
      const available = mainData

      for (let j = 0; j < filters.length; j += 1) {
        for (let i = 0; i < available.length; i += 1) {
          if (
            available[i].name.toLowerCase().includes(filters[j].trim().toLowerCase()) ||
            available[i].position.toLowerCase().includes(filters[j].trim().toLowerCase()) ||
            available[i].phone.toLowerCase().includes(filters[j].trim().toLowerCase())
          ) {
            if (!newRows.find((value) => value === available[i])) { newRows.push(available[i]) }
          }
        }
      }
      setContacts(newRows)
    }
  }

  useEffect(() => {
    if (error) {
      toast.error(error?.message, { id: toastId })
      dispatch(resetErrorUsed())
    }
  }, [error])

  return (
    <>
      {userProfile?.user?.isPowerUser && <AsideBackButton inFade />}
      <Box sx={{ display: 'flex', flex: 1, px: '10%' }}>

        <Grid container spacing={3} pl={0}>
          <Grid item xs zeroMinWidth sx={{ display: contactDetails || contactEdit ? { xs: 'none', md: 'block' } : 'block', pl: 0 }}>
            <Grid container spacing={3} pl={0}>

              <Grid item xs={12} sx={{ '&.MuiGrid-item': { pl: 0 } }}>
                <Grid container pl={0}>
                  <HeaderSearchBox title='Lista de contactos' handleOnAdd={handleOnAdd} handleSearch={handleSearch} />
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <ContactListContainer
                    data={data}
                    loading={loading}
                    onActive={onActive}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    tamContacts={contacts.length}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {contactDetails && (
            <Grid item sx={{ width: 342, margin: { xs: '0 auto', md: 'initial' }, mt: 0 }}>
              <ContactDetails
                user={user}
                onEditClick={onEditDetails}
                onClose={onCloseDetails}
                onDelete={onDelete}
              />
            </Grid>
          )}

          {contactEdit && (
            <Grid item sx={{ width: 342, margin: { xs: '0 auto', md: 'initial' } }}>
              <ContactEdit
                user={user}
                isAdd={contactAdd}
                onFinish={(u) => onFinish(u)}
                onCloseEdit={onCloseEdit}
                onCloseAdd={onCloseAdd}
              />
            </Grid>
          )}
        </Grid>
      </Box>
      {
        user &&
          <ModalDelete
            title='Eliminar contacto'
            subtitle={<><b>¿Estás seguro de eliminar el contacto {user?.name}?</b> Al dar click en aceptar, esta de acuerdo que no podrá recuperar la información.</>}
            handleClose={handleClose}
            handleDelete={handleDelete}
            open={open}
            id={user?.id}
          />
      }
    </>
  )
}

export default Contacts
