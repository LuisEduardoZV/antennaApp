import PropTypes from 'prop-types'

// material-ui
import { Avatar, Button, Chip, Divider, Grid, IconButton, Typography, useMediaQuery } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

// project imports
import MainMirrorCard from '../../ui-components/MainMirrorCard'

// assets
import BadgeTwoToneIcon from '@mui/icons-material/BadgeTwoTone'
import CallTwoToneIcon from '@mui/icons-material/CallTwoTone'
import EditNoteTwoToneIcon from '@mui/icons-material/EditNoteTwoTone'
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone'
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone'
import NotInterestedTwoToneIcon from '@mui/icons-material/NotInterestedTwoTone'
import WorkTwoToneIcon from '@mui/icons-material/WorkTwoTone'

import { getContactAvatar } from '../../services/tableServices'

const ContactDetails = ({ user, onClose, onEditClick, onDelete, ...others }) => {
  const theme = useTheme()
  const matchDown2Xl = useMediaQuery(theme.breakpoints.down('2xl'))

  return (
    <MainMirrorCard
      sx={{
        width: '100%',
        maxWidth: 342,
        position: 'fixed',
        top: matchDown2Xl ? '16%' : '12.5%'
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container alignItems='start' spacing={1}>
            <Grid item alignSelf='center'>
              <Avatar sx={{ width: 64, height: 64, color: theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.grey[400], bgcolor: theme.palette.mode === 'light' ? alpha(theme.palette.common.black, 0.5) : alpha(theme.palette.grey[800], 0.2), backdropFilter: 'blur(10px)' }}>{getContactAvatar(user.name)}</Avatar>
            </Grid>
            <Grid item xs zeroMinWidth>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant='h5' component='div' sx={{ fontSize: '1rem', color: theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.grey[200] }}>
                    {user.name}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Chip
                    label={user.position}
                    size='small'
                    variant='outlined'
                    clickable
                    sx={{
                      color: theme.palette.mode === 'light' ? theme.palette.info.main : theme.palette.secondary.dark,
                      borderColor: theme.palette.mode === 'light' ? theme.palette.info.main : theme.palette.secondary.dark
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item height='max-content'>
              <IconButton onClick={onClose} size='large' sx={{ color: theme.palette.grey[500] }}>
                <HighlightOffTwoToneIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Button variant='outlined' fullWidth startIcon={<EditNoteTwoToneIcon />} onClick={onEditClick} sx={{ color: 'primary.main', borderColor: 'primary.main' }}>
                Editar
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button variant='outlined' color='error' fullWidth startIcon={<NotInterestedTwoToneIcon />} onClick={() => onDelete(user)}>
                Elminar
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ borderColor: 'grey.500' }} />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item>
              <BadgeTwoToneIcon sx={{ verticalAlign: 'sub', fontSize: '1.125rem', mr: 0.625, color: theme.palette.mode === 'light' ? 'primary.dark' : 'white' }} />
            </Grid>
            <Grid item xs zeroMinWidth>
              <Typography variant='body2' color={theme.palette.mode === 'light' ? theme.palette.grey[700] : theme.palette.grey[500]}>{user.name}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item>
              <WorkTwoToneIcon sx={{ verticalAlign: 'sub', fontSize: '1.125rem', mr: 0.625, color: theme.palette.mode === 'light' ? 'primary.dark' : 'white' }} />
            </Grid>
            <Grid item xs zeroMinWidth>
              <Typography variant='body2' color={theme.palette.mode === 'light' ? theme.palette.grey[700] : theme.palette.grey[500]}>{user.position}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item>
              <CallTwoToneIcon sx={{ verticalAlign: 'sub', fontSize: '1.125rem', mr: 0.625, color: theme.palette.mode === 'light' ? 'primary.dark' : 'white' }} />
            </Grid>
            <Grid item xs zeroMinWidth>
              <Typography variant='body2' color={theme.palette.mode === 'light' ? theme.palette.grey[700] : theme.palette.grey[500]} sx={{ mb: 0.625 }}>
                {user.phone}{' '}
                <Typography component='span' color='primary'>
                  Oficina
                </Typography>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item>
              <InfoTwoToneIcon sx={{ verticalAlign: 'sub', fontSize: '1.125rem', mr: 0.625, color: theme.palette.mode === 'light' ? 'primary.dark' : 'white' }} />
            </Grid>
            <Grid item xs zeroMinWidth>
              <Typography variant='body2' color={theme.palette.mode === 'light' ? theme.palette.grey[700] : theme.palette.grey[500]} sx={{ mb: 0.625 }}>
                {user.note}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainMirrorCard>
  )
}

ContactDetails.propTypes = {
  user: PropTypes.object,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
  onEditClick: PropTypes.func
}

export default ContactDetails
