import PropTypes from 'prop-types'
import { useState } from 'react'

// mui imports
import { Box, Typography } from '@mui/material'

// third
import { Formik } from 'formik'
import PerfectScrollBar from 'react-perfect-scrollbar'
import { toast } from 'sonner'
import * as Yup from 'yup'

// project imports
import { useDispatch, useSelector } from '../../store'
import { addNewClient } from '../../store/slices/clients'
import { REGEX_VALID_RFC } from '../../utils/constants'
import { emailerrorText, phonelenghtText, requiredText, ziplenghtText } from '../../utils/labelsErrorsFormik'
import AuthContainer from './components/AuthContainer'

import 'react-perfect-scrollbar/dist/css/styles.css'

const Add = ({ handleCancel, toastId }) => {
  const dispatch = useDispatch()
  const { success } = useSelector((state) => state.clients)

  const [contacts, setContacts] = useState([])
  const [contact, setContact] = useState({ id: 0, clientid: 0, name: '', position: '', phone: '', active: 1, note: '', client: '' })

  const [loading, setLoading] = useState(false)

  const handleAddNewContact = (e) => {
    e.preventDefault()
    if (contact.name !== '' && contact.position !== '' && contact.phone !== '') {
      setContacts([...contacts, contact])
      setContact({ id: 0, clientid: 0, name: '', position: '', phone: '', active: 1, note: '', client: '' })
    }
  }

  const handleChangeContact = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value })
  }

  const handleDeleteContact = async (e, index) => {
    e.preventDefault()
    setLoading(true)
    const newContacts = contacts
    await newContacts.splice(index, 1)
    await setContacts(newContacts)
    setLoading(false)
  }

  return (
    <Box sx={{ display: 'flex', flex: 1, width: '100%', height: '100%', alignItems: 'flex-start', bgcolor: 'transparent', flexDirection: 'column', gap: 5, maxHeight: '70vh' }}>
      <Typography variant='h2' sx={{ color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.grey[200] }}>Agregar nuevo cliente</Typography>
      <PerfectScrollBar style={{ maxHeight: 'calc(100vh-200px)', height: '100%', overflowX: 'hidden' }}>
        <Formik
          initialValues={{
            id: 0,
            name: '',
            clinumber: '',
            address: '',
            phone: '',
            zip: '',
            email: '',
            rfc: '',
            active: 1,
            note: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(200, 'La longitud debe ser menor a 200 caracteres').required(requiredText),
            clinumber: Yup.string().max(50, 'La longitud debe ser menor a 50 caracteres'),
            address: Yup.string().max(2000, 'La longitud debe ser menor a 2000 caracteres').required(requiredText),
            phone: Yup.string()
              .min(10, phonelenghtText)
              .required(requiredText)
              .typeError(requiredText),
            zip: Yup.string().min(5, ziplenghtText).max(5, ziplenghtText).required(requiredText),
            email: Yup.string().email(emailerrorText).max(255).required(requiredText).required(requiredText),
            rfc: Yup.string().max(20, 'La longitud debe ser menor a 20 caracteres').matches(REGEX_VALID_RFC, 'Debe ser un RFC válido').required(requiredText),
            active: Yup.number(),
            note: Yup.string().max(4000, 'La longitud debe ser menor a 4000 caracteres')
          })}
          onSubmit={async (values, { setStatus, setSubmitting }) => {
            setSubmitting(true)
            delete values.submit
            values.contacts = contacts
            // console.log(values)
            toast.loading('Cargando...', { id: toastId })
            dispatch(addNewClient(values))
            if (success) toast.success(`El cliente ${values.name} se agregó correctamente`, { id: toastId })
            handleCancel()
            setStatus({ success: true })
            setSubmitting(false)
          }}
        >
          {({ values, touched, errors, isSubmitting, handleSubmit, handleBlur, handleChange }) => (
            <form noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>

              <AuthContainer
                values={values}
                touched={touched}
                errors={errors}
                isSubmitting={isSubmitting}
                handleSubmit={handleSubmit}
                handleBlur={handleBlur}
                handleChange={handleChange}
                contact={contact}
                contacts={contacts}
                handleAddNewContact={handleAddNewContact}
                handleCancel={handleCancel}
                handleChangeContact={handleChangeContact}
                handleDeleteContact={handleDeleteContact}
                loading={loading}
                isAdding
              />

            </form>
          )}
        </Formik>
      </PerfectScrollBar>
    </Box>
  )
}

Add.propTypes = {
  handleCancel: PropTypes.func,
  toastId: PropTypes.number
}

export default Add
