/* eslint-disable new-cap */
import { useState } from 'react'

// mui imports
import { Box, Divider, Tab, Tabs, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// project imports
import MainMirrorCard from '../../ui-components/MainMirrorCard'
import CustomTabPanel from '../../ui-components/extended/CustomTabPanel'
import Consumo from './TabsViews/Consumo'
import Generador from './TabsViews/Generador'

import useAuth from '../../hooks/useAuth'

function a11yProps (index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  }
}

const Reportes = () => {
  const theme = useTheme()
  const { user } = useAuth()

  const [typeReport, setTypeReport] = useState(0)

  const handleSetTypeReport = (e, id) => {
    setTypeReport(id)
  }

  return (
    <Box width='100%' px={8} display='flex' maxHeight='100vh' height='75vh' position='relative' gap={7}>
      <MainMirrorCard sx={{ height: '100%', maxWidth: '15%', px: 2 }}>
        <Typography variant='h4' width='100%' sx={{ color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white, pl: 1 }}>Tipos de Reportes</Typography>
        <Divider sx={{ width: '100%', borderColor: theme.palette.mode === 'light' ? theme.palette.grey[400] : theme.palette.grey[700], mt: 1, mb: 2 }} />
        <Tabs
          orientation='vertical'
          variant='fullWidth'
          value={typeReport}
          textColor='secondary'
          indicatorColor='secondary'
          onChange={handleSetTypeReport}
          aria-label='Vertical tabs example'
          sx={{
            border: 0, borderColor: 'transparent'
          }}
        >
          <Tab label='Consumo de Datos' {...a11yProps(0)} />
          {user?.user?.isPowerUser && (<Tab label='Generador de Reportes' {...a11yProps(1)} />)}
        </Tabs>
      </MainMirrorCard>
      <MainMirrorCard sx={{ height: '100%' }}>
        <CustomTabPanel value={typeReport} index={0}>
          <Consumo />
        </CustomTabPanel>
        {user?.user?.isPowerUser
          ? (
            <CustomTabPanel value={typeReport} index={1}>
              <Generador />
            </CustomTabPanel>
            )
          : null}
      </MainMirrorCard>
    </Box>
  )
}

export default Reportes
