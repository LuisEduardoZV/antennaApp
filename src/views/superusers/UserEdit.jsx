import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

// third
import { Formik } from 'formik'
import { toast } from 'sonner'
import * as Yup from 'yup'

// material-ui
import { useMediaQuery } from '@mui/material'
import { createTheme } from '@mui/material/styles'

// project imports
import MainMirrorCard from '../../ui-components/MainMirrorCard'
import { emailerrorText, requiredText } from '../../utils/labelsErrorsFormik'
import FormAuth from './components/FormAuth'

// services
import { useDispatch, useSelector } from '../../store'
import { addUser, modifyUser } from '../../store/slices/superUsers'

// ==============================|| CONTACT CARD/LIST USER EDIT ||============================== //

const ContactEdit = ({ user, isAdd, onFinish, onCloseEdit, onCloseAdd, ...others }) => {
  const dispatch = useDispatch()
  const { success } = useSelector((state) => state.superUsers)

  const [initVal, setInitVal] = useState({ ...user, active: user.active === 1 })
  const [showPass, setShowPass] = useState(false)

  useEffect(() => {
    setInitVal({ ...user, active: user.active === 1 })
  }, [user, isAdd])

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
        '2xl': 1900
      }
    }
  })

  const matchDown2Xl = useMediaQuery(theme.breakpoints.down('2xl'))

  const lastPassword = user?.password
  const lastEmail = user.email

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
          email: Yup.string().email(emailerrorText).max(255).required(requiredText).required(requiredText),
          password: Yup.string().required(requiredText),
          type: Yup.boolean(),
          active: Yup.boolean()
        })}
        onSubmit={async (values, { setStatus, setSubmitting }) => {
          setSubmitting(true)
          delete values.submit
          values.active = values.active ? 1 : 0
          const toastId = toast.loading('Cargando...')
          if (isAdd) {
            dispatch(addUser(values))
          } else {
            dispatch(modifyUser({ ...values, hasNewPassword: lastPassword !== values.password, lastEmail }))
          }

          if (success) {
            setStatus({ success: true })
            setSubmitting(false)
            onFinish(values)
            if (isAdd) toast.success(`El Super Usuario ${values.name} se agregó correctamente`, { id: toastId })
            else toast.success(`El Super Usuario ${values.name} se editó correctamente`, { id: toastId })
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <form noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
            <FormAuth
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              setShowPass={setShowPass}
              isAdd={isAdd}
              showPass={showPass}
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
