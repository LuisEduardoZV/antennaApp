import PropTypes from 'prop-types'

// mui imports
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone'
import { Button, Grid } from '@mui/material'

// third imports
import { PatternFormat } from 'react-number-format'

// project imports
import InputBase from '../../../ui-components/InputBase'
import NewContactRow from '../NewContactRow'

const ContactsContainer = ({ loading, contacts, contact, handleAddNewContact, handleDeleteContact, handleChangeContact, preContacts, handleDeletePreContact }) => {
  return (
    <Grid item xs={12}>
      <Grid container spacing={5}>
        <Grid item xs={12} gap={3} display='flex' flexDirection='column'>
          {(!loading && preContacts) && preContacts.map((op, index) => (
            <NewContactRow key={index} handleDeleteContact={handleDeletePreContact} index={index} {...op} />
          ))}
          {!loading && contacts.map((op, index) => (
            <NewContactRow key={index} handleDeleteContact={handleDeleteContact} index={index} {...op} />
          ))}
          <Grid container spacing={3} alignItems='center'>
            <Grid item xs={12} md={3}>
              <InputBase
                value={contact.name}
                name='name'
                label='Nombre'
                onChange={handleChangeContact}
                variant='filled'
                size='small'
                fullWidth
                color='secondary'
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <InputBase
                value={contact.position}
                name='position'
                label='Posición de trabajo'
                onChange={handleChangeContact}
                variant='filled'
                size='small'
                fullWidth
                color='primary'
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <PatternFormat
                format='+52 (###) ###-####'
                mask='_'
                type='tel'
                customInput={InputBase}
                value={contact.phone}
                name='phone'
                label='Teléfono móvil'
                onChange={handleChangeContact}
                variant='filled'
                size='small'
                fullWidth
                color='secondary'
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <InputBase
                value={contact.note}
                name='note'
                label='Nota'
                onChange={handleChangeContact}
                variant='filled'
                size='small'
                fullWidth
                color='primary'
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <Button
                color='primary'
                size='small'
                startIcon={<AddCircleTwoToneIcon />}
                onClick={handleAddNewContact}
              >Agregar...
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

ContactsContainer.propTypes = {
  loading: PropTypes.bool,
  contacts: PropTypes.array,
  preContacts: PropTypes.array,
  contact: PropTypes.object,
  handleAddNewContact: PropTypes.func,
  handleDeleteContact: PropTypes.func,
  handleChangeContact: PropTypes.func,
  handleDeletePreContact: PropTypes.func
}

export default ContactsContainer
