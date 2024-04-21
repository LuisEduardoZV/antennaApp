import PropTypes from 'prop-types'

// mui imports
import { Box, Typography } from '@mui/material'

// third imports
import { Formik } from 'formik'
import { toast } from 'sonner'
import * as Yup from 'yup'

// project improts
import EditAuth from './components/EditAuth'

// services
import { useDispatch, useSelector } from '../../store'
import { modifyUser } from '../../store/slices/users'

import { emailerrorText, requiredText } from '../../utils/labelsErrorsFormik'

const Edit = ({ handleReset, data, backBtn }) => {
  const dispatch = useDispatch()

  const { success } = useSelector((state) => state.users)

  if (!data) return
  return (
    <Box sx={{ display: 'flex', flex: 1, width: '100%', height: '100%', alignItems: 'flex-start', bgcolor: 'transparent', flexDirection: 'column', gap: 5, maxHeight: '70vh' }}>
      <Typography variant='h2' sx={{ color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white }}>Editar usuario</Typography>
      <Formik
        initialValues={{
          ...data,
          lastPassword: data.password,
          lastEmail: data.email,
          type: data.type === 1,
          active: data.active === 1
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(200, 'La longitud debe ser menor a 200 caracteres').required(requiredText),
          email: Yup.string().email(emailerrorText).max(255).required(requiredText).required(requiredText),
          lastPassword: Yup.string(),
          password: Yup.string().required(requiredText),
          type: Yup.boolean(),
          active: Yup.boolean()
        })}
        onSubmit={async (values, { setStatus, setSubmitting, resetForm }) => {
          setSubmitting(true)
          delete values.submit
          const dataForm = { ...values }
          dataForm.type = values.type ? 1 : 0
          dataForm.active = values.active ? 1 : 0
          dataForm.name = values.name
          dataForm.hasNewPassword = values.password !== values.lastPassword
          // console.log(dataForm)
          toast.loading('Cargando...')
          dispatch(modifyUser(dataForm))
          if (success) {
            setStatus({ success: true })
            setSubmitting(false)
            handleReset()
            resetForm()
          }
        }}
      >
        {({ values, touched, errors, isSubmitting, handleSubmit, handleBlur, handleChange }) => (
          <form noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
            <EditAuth
              errors={errors}
              touched={touched}
              values={values}
              backBtn={backBtn}
              handleBlur={handleBlur}
              handleChange={handleChange}
              handleReset={handleReset}
              isSubmitting={isSubmitting}
            />
          </form>
        )}
      </Formik>
    </Box>
  )
}

Edit.propTypes = {
  handleReset: PropTypes.func,
  data: PropTypes.object,
  backBtn: PropTypes.bool
}

export default Edit
