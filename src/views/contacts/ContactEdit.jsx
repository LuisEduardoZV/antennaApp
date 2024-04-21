import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

// third
import { Formik } from 'formik'
import { toast } from 'sonner'
import * as Yup from 'yup'

// material-ui
import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// project imports
import MainMirrorCard from '../../ui-components/MainMirrorCard'
import AuthEdit from './components/AuthEdit'

// services
import { useDispatch, useSelector } from '../../store'
import { addContact, modifyContact } from '../../store/slices/contacts'

import { phonelenghtText, requiredText } from '../../utils/labelsErrorsFormik'

const ContactEdit = ({ user, isAdd, onFinish, onCloseEdit, onCloseAdd, ...others }) => {
  const theme = useTheme()
  const matchDown2Xl = useMediaQuery(theme.breakpoints.down('2xl'))

  const dispatch = useDispatch()

  const { success } = useSelector((state) => state.contacts)

  const [initVal, setInitVal] = useState({ ...user, active: user.active === 1 })

  useEffect(() => {
    setInitVal({ ...user, active: user.active === 1 })
  }, [user, isAdd])

  return (
    <MainMirrorCard sx={{
      width: '100%',
      maxWidth: 342,
      p: 0,
      position: 'fixed',
      top: matchDown2Xl ? '16%' : '12.5%'
    }}
    >
      <Formik
        enableReinitialize
        initialValues={initVal}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(200, 'La longitud debe ser menor a 200 caracteres').required(requiredText),
          position: Yup.string().max(200, 'La longitud debe ser menor a 200 caracteres').required(requiredText),
          phone: Yup.string()
            .min(10, phonelenghtText)
            .required(requiredText)
            .typeError(requiredText),
          active: Yup.boolean(),
          note: Yup.string().max(4000, 'La longitud debe ser menor a 4000 caracteres')
        })}
        onSubmit={async (values, { setStatus, setSubmitting }) => {
          setSubmitting(true)
          delete values.submit
          values.active = values.active ? 1 : 0
          values.clientid = Number(values.clientid)
          const toastId = toast.loading('Cargando...')
          if (isAdd) {
            dispatch(addContact(values))
          } else {
            dispatch(modifyContact(values))
          }
          if (success) {
            onFinish(values)
            if (isAdd) {
              toast.success(`El contácto ${values.name} se agregó correctamente`, { id: toastId })
            } else {
              toast.success(`El contácto ${values.name} se editó correctamente`, { id: toastId })
            }
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <form noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
            <AuthEdit
              errors={errors}
              touched={touched}
              values={values}
              isAdd={isAdd}
              handleBlur={handleBlur}
              handleChange={handleChange}
              onCloseAdd={onCloseAdd}
              onCloseEdit={onCloseEdit}
            />
          </form>
        )}
      </Formik>
    </MainMirrorCard>
  )
}

ContactEdit.propTypes = {
  user: PropTypes.object,
  isAdd: PropTypes.bool,
  onFinish: PropTypes.func,
  onCloseEdit: PropTypes.func,
  onCloseAdd: PropTypes.func
}

export default ContactEdit
