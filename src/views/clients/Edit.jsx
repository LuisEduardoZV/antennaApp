import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

// mui imports
import { Box, Typography } from '@mui/material'

// third
import { Formik } from 'formik'
import PerfectScrollBar from 'react-perfect-scrollbar'
import { toast } from 'sonner'
import * as Yup from 'yup'

// project imports
import { useDispatch, useSelector } from '../../store'
import { editClient, getClientInfo } from '../../store/slices/clients'
import LoadingInfo from '../../ui-components/LoadingInfo'
import AuthContainer from './components/AuthContainer'

import { emailerrorText, phonelenghtText, requiredText } from '../../utils/labelsErrorsFormik'

const Edit = ({ handleCancel, selected, toastId }) => {
  const dispatch = useDispatch()

  const { clientInfo, success } = useSelector((state) => state.clients)

  const [initVal, setInitVal] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadingContact, setLoadingContact] = useState(true)

  const [preContacts, setPreContacts] = useState([])
  const [contacts, setContacts] = useState([])
  const [contact, setContact] = useState({ id: 0, clientid: 0, name: '', position: '', phone: '', active: 1, note: '', client: '' })
  const [contactsDeleted, setContactsDeleted] = useState([])

  const handleAddNewContact = (e, clientid) => {
    e.preventDefault()
    if (contact.name !== '' && contact.position !== '' && contact.phone !== '') {
      setContacts([...contacts, contact])
      setContact({ id: 0, clientid, name: '', position: '', phone: '', active: 1, note: '', client: '' })
    }
  }

  const handleChangeContact = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value })
  }

  const handleDeleteContact = async (e, index) => {
    e.preventDefault()
    setLoadingContact(true)
    const newContacts = contacts
    await newContacts.splice(index, 1)
    await setContacts(newContacts)
    setLoadingContact(false)
  }

  const handleDeletePreContact = async (e, index) => {
    e.preventDefault()
    setLoadingContact(true)
    const newPreContacts = [...preContacts]
    const deleted = newPreContacts?.splice(index, 1)
    setContactsDeleted([...contactsDeleted, ...deleted])
    setPreContacts(newPreContacts)
    setLoadingContact(false)
  }

  useEffect(() => {
    if (selected) dispatch(getClientInfo(selected))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    (async () => {
      try {
        if (clientInfo) {
          setInitVal({ ...clientInfo, active: clientInfo.active === 1, submit: null })
          setPreContacts(clientInfo.contactos)
          setContact({ ...contact, clientid: clientInfo.clientid })
          setLoading(false)
          setLoadingContact(false)
        }
      } catch (error) {
        console.log(error)
      }
    })()

    return () => {
      setInitVal({})
      setLoading(true)
      setLoadingContact(true)
      setPreContacts([])
      setContacts([])
      setContactsDeleted([])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientInfo])

  if (loading) return <LoadingInfo />
  return (
    <Box sx={{ display: 'flex', flex: 1, width: '100%', height: '100%', alignItems: 'flex-start', bgcolor: 'transparent', flexDirection: 'column', gap: 5, maxHeight: '70vh' }}>
      <Typography variant='h2' sx={{ color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.grey[200] }}>Editar un cliente</Typography>
      <PerfectScrollBar style={{ maxHeight: 'calc(100vh-200px)', height: '100%', overflowX: 'hidden' }}>
        <Formik
          initialValues={initVal}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(200, 'La longitud debe ser menor a 200 caracteres'),
            clinumber: Yup.string().max(50, 'La longitud debe ser menor a 50 caracteres'),
            address: Yup.string().max(2000, 'La longitud debe ser menor a 2000 caracteres').required(requiredText),
            phone: Yup.string()
              .min(10, phonelenghtText)
              .required(requiredText)
              .typeError(requiredText),
            zip: Yup.string().required(requiredText),
            email: Yup.string().email(emailerrorText).max(255).required(requiredText).required(requiredText),
            rfc: Yup.string().max(20, 'La longitud debe ser menor a 20 caracteres'),
            active: Yup.boolean(),
            note: Yup.string().max(4000, 'La longitud debe ser menor a 4000 caracteres')
          })}
          validateOnMount
          onSubmit={async (values, { setStatus, setSubmitting }) => {
            setSubmitting(true)
            delete values.submit
            values.contacts = []
            values.users = []
            values.active = values.active ? 1 : 0
            const toastId = toast.loading('Cargando...')
            dispatch(editClient(values, selected, contactsDeleted, contacts))
            if (success) toast.success(`El cliente ${values.name} se editó correctamente`, { id: toastId })
            setStatus({ success: true })
            setSubmitting(false)
            handleCancel('', true)

            setInitVal({})
            setLoading(true)
            setLoadingContact(true)
            setPreContacts([])
            setContacts([])
            setContactsDeleted([])
          }}
        >
          {({ values, touched, errors, isSubmitting, handleSubmit, handleBlur, handleChange }) => (
            <form noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>

              <AuthContainer
                values={values}
                touched={touched}
                errors={errors}
                isSubmitting={isSubmitting}
                handleBlur={handleBlur}
                handleChange={handleChange}
                contact={contact}
                contacts={contacts}
                handleAddNewContact={handleAddNewContact}
                handleCancel={handleCancel}
                handleChangeContact={handleChangeContact}
                handleDeleteContact={handleDeleteContact}
                loading={loadingContact}
                preContacts={preContacts}
                handleDeletePreContact={handleDeletePreContact}
              />

            </form>
          )}
        </Formik>
      </PerfectScrollBar>
    </Box>
  )
}

Edit.propTypes = {
  handleCancel: PropTypes.func,
  selected: PropTypes.number,
  toastId: PropTypes.number
}

export default Edit
