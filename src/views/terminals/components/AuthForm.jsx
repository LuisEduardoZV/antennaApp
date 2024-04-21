import PropTypes from 'prop-types'

// third imports
import { NumericFormat } from 'react-number-format'

// mui imports
import { Box, Button, Grid, Tooltip } from '@mui/material'

// project imports
import CustomSwitch from '../../../ui-components/CustomSwitch'
import InputBase from '../../../ui-components/InputBase'

const AuthForm = ({ values, errors, touched, isSubmitting, handleBlur, handleCancel, handleChange, isAdding }) => {
  return (
    <>
      <Grid container spacing={5} width='100%'>
        <Grid item xs={12} md={6}>
          <Tooltip arrow followCursor disableInteractive {...errors.alias && { title: errors.alias }}>
            <InputBase
              value={values.alias}
              name='alias'
              label='Nombre de la terminal'
              onBlur={handleBlur}
              onChange={handleChange}
              variant='filled'
              size='small'
              fullWidth
              color='primary'
              error={Boolean(touched.alias && errors.alias)}
              required
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12} md={6}>
          <Tooltip arrow followCursor disableInteractive {...errors.name && { title: errors.name }}>
            <InputBase
              value={values.name}
              name='name'
              label='Nombre del sitio'
              onBlur={handleBlur}
              onChange={handleChange}
              variant='filled'
              size='small'
              fullWidth
              color='primary'
              error={Boolean(touched.name && errors.name)}
              required
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12} md={isAdding ? 4 : 3}>
          <Tooltip arrow followCursor disableInteractive {...errors.service && { title: errors.service }}>
            <InputBase
              value={values.service}
              name='service'
              label='Línea de servicio de la terminal'
              onBlur={handleBlur}
              onChange={handleChange}
              variant='filled'
              size='small'
              fullWidth
              color='primary'
              error={Boolean(touched.service && errors.service)}
              required
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12} md={isAdding ? 4 : 3}>
          <Tooltip arrow followCursor disableInteractive {...errors.serial && { title: errors.serial }}>
            <InputBase
              value={values.serial}
              name='serial'
              label='Número de seria'
              onBlur={handleBlur}
              onChange={handleChange}
              variant='filled'
              size='small'
              fullWidth
              color='primary'
              error={Boolean(touched.serial && errors.serial)}
              required
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12} md={isAdding ? 4 : 3}>
          <Tooltip arrow followCursor disableInteractive {...errors.kit && { title: errors.kit }}>
            <InputBase
              value={values.kit}
              name='kit'
              label='Número de Kit'
              onBlur={handleBlur}
              onChange={handleChange}
              variant='filled'
              size='small'
              fullWidth
              color='primary'
              error={Boolean(touched.kit && errors.kit)}
              required
            />
          </Tooltip>
        </Grid>
        {!isAdding && (
          <Grid item xs={12} md={3} position='relative'>
            <CustomSwitch
              value={values.active}
              handleChange={handleChange}
              name='active'
              label='Estatus'
              option1='Inactivo'
              option2='Activo'
            />
          </Grid>
        )}
        <Grid item xs={12} md={3}>
          <Tooltip arrow followCursor disableInteractive {...errors.number && { title: errors.number }}>
            <InputBase
              value={values.number}
              name='number'
              label='Número de la línea de servicio'
              onBlur={handleBlur}
              onChange={handleChange}
              variant='filled'
              size='small'
              fullWidth
              color='primary'
              error={Boolean(touched.number && errors.number)}
              required
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12} md={3}>
          <Tooltip arrow followCursor disableInteractive {...errors.lat && { title: errors.lat }}>
            <Box>
              <NumericFormat
                allowLeadingZeros
                customInput={InputBase}
                value={values.lat}
                name='lat'
                label='Latitud'
                onChange={handleChange}
                onBlur={handleBlur}
                variant='filled'
                size='small'
                fullWidth
                color='primary'
                required
                error={Boolean(touched.lat && errors.lat)}
              />
            </Box>
          </Tooltip>
        </Grid>
        <Grid item xs={12} md={3}>
          <Tooltip arrow followCursor disableInteractive {...errors.lng && { title: errors.lng }}>
            <Box>
              <NumericFormat
                allowLeadingZeros
                customInput={InputBase}
                value={values.lng}
                name='lng'
                label='Longitud'
                onChange={handleChange}
                onBlur={handleBlur}
                variant='filled'
                size='small'
                fullWidth
                color='primary'
                required
                error={Boolean(touched.lng && errors.lng)}
              />
            </Box>
          </Tooltip>
        </Grid>
      </Grid>
      <Box display='flex' width='100%' justifyContent='space-around' mt={5} mb={1}>
        <Button variant='outlined' color='error' onClick={handleCancel}>Cancelar</Button>
        <Button variant='outlined' color='info' type='submit' disabled={isSubmitting}>{isAdding ? 'Agregar' : 'Guardar'}</Button>
      </Box>
    </>
  )
}

AuthForm.propTypes = {
  values: PropTypes.object,
  errors: PropTypes.object,
  touched: PropTypes.object,
  isSubmitting: PropTypes.bool,
  isAdding: PropTypes.bool,
  handleBlur: PropTypes.func,
  handleCancel: PropTypes.func,
  handleChange: PropTypes.func
}

export default AuthForm
