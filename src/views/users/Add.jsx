import PropTypes from 'prop-types'

// mui imports
import { Box, Typography } from '@mui/material'

// third imports
import { Formik } from 'formik'
import { toast } from 'sonner'
import * as Yup from 'yup'

// project improts
import { useDispatch, useSelector } from '../../store'
import { addUser } from '../../store/slices/users'
import AddAuth from './components/AddAuth'

import { emailerrorText, requiredText } from '../../utils/labelsErrorsFormik'

const Add = ({ handleReset, client, backBtn }) => {
  const dispatch = useDispatch()

  const { success } = useSelector((state) => state.users)
  return (
    <Box sx={{ display: 'flex', flex: 1, width: '100%', height: '100%', alignItems: 'flex-start', bgcolor: 'transparent', flexDirection: 'column', gap: 5, maxHeight: '70vh' }}>
      <Typography variant='h2' sx={{ color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white }}>Agregar nuevo usuario</Typography>
      <Formik
        initialValues={{
          id: 0,
          clientid: Number(client),
          name: '',
          email: '',
          password: '',
          type: false,
          active: true
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(200, 'La longitud debe ser menor a 200 caracteres').required(requiredText),
          email: Yup.string().email(emailerrorText).max(255).required(requiredText).required(requiredText),
          password: Yup.string().required(requiredText),
          type: Yup.boolean(),
          active: Yup.boolean()
        })}
        onSubmit={async (values, { setStatus, setSubmitting, resetForm }) => {
          setSubmitting(true)
          delete values.submit
          const dataForm = { ...values }
          dataForm.type = values.type ? 1 : 0
          dataForm.active = 1
          toast.loading('Cargando...')
          dispatch(addUser(dataForm))
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
            <AddAuth
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

Add.propTypes = {
  handleReset: PropTypes.func,
  client: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  backBtn: PropTypes.bool
}

export default Add
