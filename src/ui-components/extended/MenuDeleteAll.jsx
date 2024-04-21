import PropTypes from 'prop-types'

// mui imports
import DeleteSweepTwoToneIcon from '@mui/icons-material/DeleteSweepTwoTone'
import { Box, Button, Fade, IconButton, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

// third imports
import { Popover } from '@headlessui/react'

// project imports
import CustomTooltipBtns from '../CustomTooltipBtns'
import MainMirrorCard from '../MainMirrorCard'

const MenuDeleteAll = ({ deleteAll, visibility, position, sx, sxPanel, noOverlay, type = 'usuario' }) => {
  const theme = useTheme()

  if (!visibility) return null
  return (
    <Popover key='deleteallbtn' style={{ position, ...sx, zIndex: 50 }}>
      {({ open, close }) => (
        <>
          <CustomTooltipBtns key='deleteallbtn' type='error' title='Desvincular todas las terminales'>
            <Popover.Button as={IconButton}>
              <DeleteSweepTwoToneIcon color='error' />
            </Popover.Button>
          </CustomTooltipBtns>

          <Fade in={open} style={{ zIndex: 50 }}>
            <Box zIndex={10}>
              {!noOverlay && <Popover.Overlay static style={{ position: 'fixed', inset: 0, backgroundColor: alpha(theme.palette.background.paper, 0.35), zIndex: 9999, width: '100vw', height: '100vh' }} />}
              <Popover.Panel static style={{ position: 'absolute', zIndex: 99999, ...sxPanel }}>
                <MainMirrorCard sx={{ minHeight: 'auto', mt: 0.5, ml: -1, width: 300 }}>
                  <Typography variant='h5'>¿Estás seguro de eliminar todas las terminales vinculadas al {type}?</Typography>
                  <Box display='flex' width='100%' justifyContent='space-between' mt={1.5}>
                    <Button variant='outlined' color='error' size='small' sx={{ fontSize: '0.7rem' }} onClick={close}>Cancelar</Button>
                    <Button variant='outlined' color='primary' size='small' sx={{ fontSize: '0.7rem' }} onClick={() => deleteAll(close)}>Eliminar</Button>
                  </Box>
                </MainMirrorCard>
              </Popover.Panel>
            </Box>
          </Fade>
        </>
      )}

    </Popover>
  )
}

MenuDeleteAll.propTypes = {
  deleteAll: PropTypes.func,
  visibility: PropTypes.bool,
  position: PropTypes.string,
  sx: PropTypes.object,
  sxPanel: PropTypes.object,
  noOverlay: PropTypes.bool,
  type: PropTypes.string
}

export default MenuDeleteAll
