import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

// mui imports
import { ExpandMoreTwoTone, LooksOneTwoTone } from '@mui/icons-material'
import BackspaceIcon from '@mui/icons-material/Backspace'
import { Accordion, AccordionDetails, AccordionSummary, Box, IconButton, List, ListItemText, Skeleton, Slide, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// third
import PerfectScrollbar from 'react-perfect-scrollbar'

// project imports
import { BASE_URL_API } from '../../../config'
import { apiCall } from '../../../contexts/api'
import { CustomListItemButtonPrimary as CustomListItemButton } from '../../../ui-components/CustomListItemButton'
import InputSearch from '../../../ui-components/InputSearch'
import MainMirrorFade from '../../../ui-components/MainMirrorFade'

import 'react-perfect-scrollbar/dist/css/styles.css'

const skeltonsLoaders = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const ClientList = ({ handleChange, inView }) => {
  const theme = useTheme()

  const matchDown2Xl = useMediaQuery(theme.breakpoints.down('2xl'))

  const [data, setData] = useState([])
  const [clients, setClients] = useState(data)
  const [loading, setLoading] = useState(true)

  const [selected, setSelected] = useState(null)

  const handleSearch = (e, filters) => {
    if (filters.length === 0) {
      setClients(data)
    } else {
      const newRows = []
      const available = data

      for (let j = 0; j < filters.length; j += 1) {
        for (let i = 0; i < available.length; i += 1) {
          if (
            available[i].name.toLowerCase().includes(filters[j].trim().toLowerCase()) ||
            available[i].rfc.toLowerCase().includes(filters[j].trim().toLowerCase()) ||
            available[i].email.toLowerCase().includes(filters[j].trim().toLowerCase()) ||
            available[i].clinumber.toLowerCase().includes(filters[j].trim().toLowerCase()) ||
            available[i].address.toLowerCase().includes(filters[j].trim().toLowerCase()) ||
            available[i].phone.toLowerCase().includes(filters[j].trim().toLowerCase())
          ) {
            if (!newRows.find((value) => value === available[i])) { newRows.push(available[i]) }
          }
        }
      }
      setClients(newRows)
    }
  }

  const handleChangeSelected = (id, name) => {
    const available = [...data]
    const indexClient = available.findIndex((op) => (op.id === id))
    const clientInfo = available.splice(indexClient, 1)

    handleChange('client', clientInfo[0].id)
    handleChange('name', name)
    setSelected(clientInfo[0])
    setClients(available)
  }

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiCall({ url: `${BASE_URL_API}/Clientes` })
        data.sort((a, b) => {
          const nameA = a.name.toUpperCase()
          const nameB = b.name.toUpperCase()
          if (nameA < nameB) return -1
          if (nameA > nameB) return 1
          return 0
        })
        setData(data)
        setClients(data)

        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    })()

    return () => setLoading(true)
  }, [])

  return (
    <MainMirrorFade
      componentTransition={Slide} direction='right' in={inView === 1} sx={{
        maxHeight: matchDown2Xl ? '75vh' : '85vh',
        height: '100%',
        position: 'relative',
        maxWidth: '25%',
        minWidth: '23%',
        width: 'max-content'
      }}
    >
      <Box display='flex' flexDirection='column' rowGap={3} position='relative'>
        <Typography component='div' variant='h2' display='flex' gap={1} alignItems='center' sx={{ color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white }}>
          <LooksOneTwoTone color='primary' /> Selección de cliente *
        </Typography>
        <Box>
          <InputSearch handleSearch={handleSearch} />
        </Box>
        <PerfectScrollbar style={{ height: 'fit-content', maxHeight: matchDown2Xl ? '55vh' : '67vh', paddingLeft: 10, paddingRight: 15 }}>
          <List component={Box}>
            <Accordion defaultExpanded sx={{ backgroundColor: 'transparent', width: '100%' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreTwoTone />}
              >
                <Typography variant='h4' sx={{ color: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[800] : theme.palette.grey[400] }}>{selected ? 'Cliente Seleccionado:' : 'Cliente(s) Disponible(s):'}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {selected
                  ? (
                    <Box display='flex' width='100%' position='relative'>
                      <CustomListItemButton
                        key='client-selected'
                        selected
                      >
                        <ListItemText
                          primary={selected?.name} secondary={selected?.email} sx={{
                            '& .MuiListItemText-primary': {
                              color: (theme) => theme.palette.grey[400]
                            }
                          }}
                        />
                      </CustomListItemButton>
                      <IconButton size='small' sx={{
                          position: 'absolute', right: 0, top: 0, zIndex: 5,
                          color: 'primary.800'
                        }}
                        onClick={() => {
                          setClients(data)
                          handleChange('client', null)
                          setSelected(null)
                        }}
                      >
                        <BackspaceIcon fontSize='small' />
                      </IconButton>
                    </Box>)
                  : (
                      loading
                        ? skeltonsLoaders.map((op) => (<Skeleton key={op} height={70} />))
                        : clients.map(({ id, name, email }, index) => (
                          <CustomListItemButton
                            key={id}
                            onClick={() => handleChangeSelected(id, name)}
                          >
                            <ListItemText
                              primary={name} secondary={email} sx={{
                                '& .MuiListItemText-primary': {
                                  color: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[600] : theme.palette.grey[400]
                                }
                              }}
                            />
                          </CustomListItemButton>
                        ))
                    )}
              </AccordionDetails>
            </Accordion>
          </List>
        </PerfectScrollbar>
      </Box>
    </MainMirrorFade>
  )
}

ClientList.propTypes = {
  handleChange: PropTypes.func,
  inView: PropTypes.number
}

export default ClientList
