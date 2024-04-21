import PropTypes from 'prop-types'

// mui imports
import { Box, Grid, Tooltip, Typography } from '@mui/material'

// third imports
import { PatternFormat } from 'react-number-format'

// project imports
import CustomSwitch from '../../../ui-components/CustomSwitch'
import InputBase from '../../../ui-components/InputBase'
import DefaultBtnsForms from '../../../ui-components/extended/DefaultBtnsForms'
import ContactsContainer from './ContactsContainer'

const AuthContainer = ({ values, touched, errors, isSubmitting, handleBlur, handleChange, loading, contacts, contact, handleAddNewContact, handleDeleteContact, handleChangeContact, handleCancel, preContacts, handleDeletePreContact, isAdding }) => {
  return (
    <Grid container spacing={5} width='100%'>
      <Grid item xs={12} md={5}>
        <Tooltip arrow followCursor disableInteractive {...errors.name && { title: errors.name }}>
          <InputBase
            value={values.name}
            name='name'
            label='Nombre del cliente'
            onBlur={handleBlur}
            onChange={handleChange}
            variant='filled'
            size='small'
            fullWidth
            required
            color='primary'
            error={Boolean(touched.name && errors.name)}
          />
        </Tooltip>
      </Grid>
      <Grid item xs={12} md={4}>
        <Tooltip arrow followCursor disableInteractive {...errors.rfc && { title: errors.rfc }}>
          <InputBase
            value={values.rfc}
            name='rfc'
            label='RFC / ID'
            onBlur={handleBlur}
            onChange={handleChange}
            variant='filled'
            size='small'
            fullWidth
            color='secondary'
            error={Boolean(touched.rfc && errors.rfc)}
            required
          />
        </Tooltip>
      </Grid>
      <Grid item xs={12} md={3}>
        <Tooltip arrow followCursor disableInteractive {...errors.clinumber && { title: errors.clinumber }}>
          <InputBase
            value={values.clinumber}
            name='clinumber'
            label='Número de cliente'
            onBlur={handleBlur}
            onChange={handleChange}
            variant='filled'
            size='small'
            fullWidth
            color='primary'
            error={Boolean(touched.clinumber && errors.clinumber)}
          />
        </Tooltip>
      </Grid>
      <Grid item xs={12} md={7}>
        <Tooltip arrow followCursor disableInteractive {...errors.address && { title: errors.address }}>
          <InputBase
            value={values.address}
            name='address'
            label='Dirección'
            onBlur={handleBlur}
            onChange={handleChange}
            variant='filled'
            size='small'
            fullWidth
            color='secondary'
            error={Boolean(touched.address && errors.address)}
            required
          />
        </Tooltip>
      </Grid>
      <Grid item xs={12} md={2}>
        <Tooltip arrow followCursor disableInteractive {...errors.zip && { title: errors.zip }}>
          <InputBase
            value={values.zip}
            name='zip'
            label='Código postal'
            onBlur={handleBlur}
            onChange={handleChange}
            variant='filled'
            size='small'
            fullWidth
            color='primary'
            error={Boolean(touched.zip && errors.zip)}
            required
          />
        </Tooltip>
      </Grid>
      <Grid item xs={12} md={3}>
        <Tooltip arrow followCursor disableInteractive {...errors.phone && { title: errors.phone }}>
          <Box>
            <PatternFormat
              format='+52 (###) ###-####'
              mask='_'
              type='tel'
              customInput={InputBase}
              value={values.phone}
              name='phone'
              label='Teléfono móvil'
              onBlur={handleBlur}
              onChange={handleChange}
              variant='filled'
              size='small'
              fullWidth
              color='secondary'
              required
              error={Boolean(touched.phone && errors.phone)}
            />
          </Box>
        </Tooltip>
      </Grid>
      <Grid item xs={12} md={isAdding ? 12 : 9}>
        <Tooltip arrow followCursor disableInteractive {...errors.email && { title: errors.email }}>
          <InputBase
            value={values.email}
            name='email'
            type='email'
            label='Correo eletrónico'
            onBlur={handleBlur}
            onChange={handleChange}
            variant='filled'
            size='small'
            fullWidth
            color='primary'
            error={Boolean(touched.email && errors.email)}
            required
          />
        </Tooltip>
      </Grid>
      {!isAdding && (
        <Grid item xs={12} md={3} position='relative'>
          <CustomSwitch
            value={!!values.active}
            handleChange={handleChange}
            name='active'
            label='Estatus'
            option1='Inactivo'
            option2='Activo'
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <Tooltip arrow followCursor disableInteractive {...errors.note && { title: errors.note }}>
          <InputBase
            value={values.note ?? ''}
            name='note'
            label='Notas'
            onBlur={handleBlur}
            onChange={handleChange}
            variant='filled'
            size='small'
            fullWidth
            multiline
            rows={3}
            color='secondary'
            error={Boolean(touched.note && errors.note)}
          />
        </Tooltip>
      </Grid>
      <Grid item xs={12}>
        <Typography
          variant='h4' sx={{ color: (theme) => theme.palette.grey[500] }}
        >Contactos
        </Typography>
      </Grid>
      <ContactsContainer
        contact={contact}
        contacts={contacts}
        loading={loading}
        handleAddNewContact={handleAddNewContact}
        handleChangeContact={handleChangeContact}
        handleDeleteContact={handleDeleteContact}
        preContacts={preContacts ?? null}
        handleDeletePreContact={preContacts && handleDeletePreContact}
      />
      <Grid item xs={12}>
        <DefaultBtnsForms
          handleCancel={handleCancel}
          isSubmitting={isSubmitting}
          okBtnLabel={isAdding && 'Finalizar'}
        />
      </Grid>
    </Grid>
  )
}

AuthContainer.propTypes = {
  values: PropTypes.object,
  touched: PropTypes.object,
  errors: PropTypes.object,
  isSubmitting: PropTypes.bool,
  isAdding: PropTypes.bool,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  loading: PropTypes.bool,
  contacts: PropTypes.array,
  contact: PropTypes.object,
  handleAddNewContact: PropTypes.func,
  handleDeleteContact: PropTypes.func,
  handleChangeContact: PropTypes.func,
  handleCancel: PropTypes.func,
  preContacts: PropTypes.array,
  handleDeletePreContact: PropTypes.func
}

export default AuthContainer
