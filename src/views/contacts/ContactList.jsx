import PropTypes from 'prop-types'

// material-ui
import { Avatar, Button, Grid, Typography } from '@mui/material'
import { alpha, styled, useTheme } from '@mui/material/styles'

// assets
import EditNoteTwoToneIcon from '@mui/icons-material/EditNoteTwoTone'
import PermContactCalendarTwoToneIcon from '@mui/icons-material/PermContactCalendarTwoTone'
import PersonRemoveTwoToneIcon from '@mui/icons-material/PersonRemoveTwoTone'

// project imports
import CustomTooltipBtns from '../../ui-components/CustomTooltipBtns'

// styles
const ListWrapper = styled('div')(({ theme }) => ({
  padding: '15px 0',
  borderBottom: theme.palette.mode === 'dark' ? 'none' : '1px solid',
  borderTop: theme.palette.mode === 'dark' ? 'none' : '1px solid',
  borderColor: `${theme.palette.grey[800]}!important`
}))

// ==============================|| USER CONTACT LIST ||============================== //

const ContactList = ({ avatar, phone, name, position, onActive, onEditClick, onDeleteClick }) => {
  const theme = useTheme()

  return (
    <ListWrapper sx={{ borderColor: theme.palette.mode === 'light' ? `${theme.palette.grey[300]}!important` : `${theme.palette.grey[700]}!important` }}>
      <Grid container alignItems='center' spacing={3}>
        <Grid item xs={12} sm={6} onClick={() => onActive && onActive()} style={{ cursor: 'pointer' }}>
          <Grid container alignItems='center' spacing={3} sx={{ flexWrap: 'nowrap' }}>
            <Grid item>
              <Avatar sx={{ width: 48, height: 48, fontSize: '15px', color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.grey[400], bgcolor: (theme) => theme.palette.mode === 'light' ? alpha(theme.palette.common.black, 0.5) : alpha(theme.palette.grey[800], 0.2), backdropFilter: 'blur(10px)' }}>{avatar}</Avatar>
            </Grid>
            <Grid item sm zeroMinWidth>
              <Grid container spacing={0}>
                <Grid item xs={12}>
                  <Typography variant='h4' component='div' sx={{ color: (theme) => theme.palette.mode === 'light' ? alpha(theme.palette.common.black, 0.85) : theme.palette.grey[300] }}>
                    {name} ({position})
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='caption' sx={{ color: (theme) => theme.palette.mode === 'light' && alpha(theme.palette.common.black, 0.85) }}>{phone}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid
            container
            spacing={1}
            sx={{ justifyContent: 'flex-end', [theme.breakpoints.down('md')]: { justifyContent: 'flex-start' } }}
          >
            <Grid item>
              <CustomTooltipBtns title='Mostrar' type='white' placement='top'>
                <Button variant='outlined' sx={{ minWidth: 32, height: 32, p: 0 }} color='secondary' onClick={() => onActive && onActive()}>
                  <PermContactCalendarTwoToneIcon fontSize='small' />
                </Button>
              </CustomTooltipBtns>
            </Grid>
            <Grid item>
              <CustomTooltipBtns title='Editar' type='primary' placement='top'>
                <Button variant='outlined' sx={{ minWidth: 32, height: 32, p: 0, color: theme.palette.mode === 'light' ? 'primary.main' : 'primary.main', borderColor: theme.palette.mode === 'light' ? 'primary.main' : 'primary.main' }} onClick={() => onEditClick && onEditClick()}>
                  <EditNoteTwoToneIcon fontSize='small' />
                </Button>
              </CustomTooltipBtns>
            </Grid>
            <Grid item>
              <CustomTooltipBtns title='Eliminar' type='error' placement='top'>
                <Button variant='outlined' color='error' sx={{ minWidth: 32, height: 32, p: 0 }} onClick={() => onDeleteClick && onDeleteClick()}>
                  <PersonRemoveTwoToneIcon fontSize='small' />
                </Button>
              </CustomTooltipBtns>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ListWrapper>
  )
}

ContactList.propTypes = {
  avatar: PropTypes.string,
  phone: PropTypes.string,
  name: PropTypes.string,
  onActive: PropTypes.func,
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  position: PropTypes.string
}

export default ContactList
