import PropTypes from 'prop-types'
import { useCallback, useEffect, useState } from 'react'

// mui imports
import { ExpandMoreTwoTone } from '@mui/icons-material'
import LooksOneTwoTone from '@mui/icons-material/LooksOneTwoTone'
import LooksTwoTwoToneIcon from '@mui/icons-material/LooksTwoTwoTone'
import RemoveCircleTwoToneIcon from '@mui/icons-material/RemoveCircleTwoTone'
import { Accordion, AccordionDetails, AccordionSummary, Box, List, ListItemText, Skeleton, Slide, Typography, useMediaQuery } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

// third
import PerfectScrollbar from 'react-perfect-scrollbar'

// project imports
import { BASE_URL_API } from '../../../config'
import { apiCall } from '../../../contexts/api'
import useAuth from '../../../hooks/useAuth'
import { CustomListItemButtonInfo as CustomListItemButton, CustomListItemButtonInfoDisable as CustomListItemButtonDisable } from '../../../ui-components/CustomListItemButton'
import CustomTooltipBtns from '../../../ui-components/CustomTooltipBtns'
import InputSearch from '../../../ui-components/InputSearch'
import MainMirrorFade from '../../../ui-components/MainMirrorFade'

import 'react-perfect-scrollbar/dist/css/styles.css'

const skeltonsLoaders = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const TermianlsList = ({ values, handleChange, inView, viewType, handleUnlinkWithClient, hasPreTerminals }) => {
  const { terminals, client } = values
  const theme = useTheme()
  const { user } = useAuth()

  const matchDown2Xl = useMediaQuery(theme.breakpoints.down('2xl'))

  const [data, setData] = useState([])
  const [allTerminal, setAllTerminals] = useState(data)
  const [preSelected, setPreselected] = useState(null)
  const [loading, setLoading] = useState(true)

  const [selected, setSelected] = useState([])

  const Icon = viewType ? LooksTwoTwoToneIcon : LooksOneTwoTone

  const handleClick = (event, id, name, service, kit) => {
    const selectedIndex = terminals.findIndex((op) => (op.id === id))
    const selectedInfoIndex = selected.findIndex((op) => (op.id === id))
    let newSelected = []
    let allInfoSelected = []
    const dataAvailable = [...data]

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(terminals, { id, name, service, kit })
      const info = dataAvailable.splice(dataAvailable.findIndex((op) => (op.id === id)), 1)
      allInfoSelected = allInfoSelected.concat(selected, info)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(terminals.slice(1))
      dataAvailable.push(selected[selectedInfoIndex])
      allInfoSelected = allInfoSelected.concat(selected.slice(1))
    } else if (selectedIndex === terminals.length - 1) {
      newSelected = newSelected.concat(terminals.slice(0, -1))
      dataAvailable.push(selected[selectedInfoIndex])
      allInfoSelected = allInfoSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        terminals.slice(0, selectedIndex),
        terminals.slice(selectedIndex + 1)
      )
      dataAvailable.push(selected[selectedInfoIndex])
      allInfoSelected = allInfoSelected.concat(
        selected.slice(0, selectedInfoIndex),
        selected.slice(selectedInfoIndex + 1)
      )
    }
    handleChange('terminals', newSelected)
    setSelected(allInfoSelected)
    setData(dataAvailable)
  }

  const handleSearch = (e, filters) => {
    if (filters.length === 0) {
      setAllTerminals(data)
    } else {
      const newRows = []
      const available = data

      for (let j = 0; j < filters.length; j += 1) {
        for (let i = 0; i < available.length; i += 1) {
          if (
            available[i]?.number.toLowerCase().includes(filters[j].trim().toLowerCase()) ||
            available[i]?.alias?.toLowerCase()?.includes(filters[j].trim().toLowerCase()) ||
            available[i]?.service.toLowerCase().includes(filters[j].trim().toLowerCase()) ||
            available[i]?.name.toLowerCase().includes(filters[j].trim().toLowerCase())
          ) {
            if (!newRows.find((value) => value === available[i])) { newRows.push(available[i]) }
          }
        }
      }
      setAllTerminals(newRows)
    }
  }

  const getPreSelected = useCallback(async () => {
    if (viewType && client) {
      const { data } = await apiCall({ url: `${BASE_URL_API}/getClientTerminalesAllCli?id=${client}` })
      setPreselected(data)
      if (Array.isArray(data) && data.length > 0) hasPreTerminals(true)
      else hasPreTerminals(false)
    }
    if (!client) setPreselected(null)
  }, [client, viewType, hasPreTerminals])

  useEffect(() => {
    (async () => {
      await getPreSelected()
    })()
  }, [getPreSelected])

  useEffect(() => {
    (async () => {
      if (viewType !== null) {
        try {
          let res = null
          if (viewType) res = await apiCall({ url: `${BASE_URL_API}/TerminalNotAsigment` })
          else res = await apiCall({ url: `${BASE_URL_API}/getClientTerminalesAllCli?id=${user.user.clientid}` })
          const { data } = res
          if (data) setData(data)
          else throw new Error('Error al obtener las terminales')

          setLoading(false)
        } catch (error) {
          console.log(error)
          setLoading(false)
        }
      }
    })()

    return () => setLoading(true)
  }, [viewType, user])

  useEffect(() => {
    setAllTerminals(data.sort((a, b) => {
      const nameA = a.name.toUpperCase()
      const nameB = b.name.toUpperCase()
      if (nameA < nameB) return -1
      if (nameA > nameB) return 1
      return 0
    }))
  }, [data])

  return (
    <MainMirrorFade
      componentTransition={Slide} direction='left' in={inView === 1} sx={{
        maxHeight: matchDown2Xl ? '70vh' : '80vh',
        height: '100%',
        position: 'relative',
        maxWidth: viewType ? '65%' : '90%',
        minWidth: viewType ? '50%' : '90%',
        width: '100%'
      }}
    >
      <Box display='flex' flexDirection='column' rowGap={3} position='relative'>
        <Typography component='div' variant='h2' display='flex' gap={1} alignItems='flex-start' sx={{ color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white }}>
          <Icon sx={{ color: 'secondary.dark' }} /> Selección de 1 o más terminales a vincular *
        </Typography>
        <Box>
          <InputSearch handleSearch={handleSearch} />
        </Box>
        <PerfectScrollbar style={{ height: 'fit-content', maxHeight: matchDown2Xl ? '50vh' : '55vh', paddingLeft: 10, paddingRight: 15 }}>
          <List component={Box} display='flex' flexWrap='wrap' columnGap={1} rowGap={2}>
            {client && (
              <Accordion defaultExpanded sx={{ backgroundColor: 'transparent', width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreTwoTone />}>
                  <Typography variant='h4' sx={{ color: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[800] : theme.palette.grey[400] }} width='100%'>Terminal(es) Seleccionada(s):</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box display='flex' flexWrap='wrap' columnGap={1} rowGap={2} width='100%'>
                    {selected.map(({ id, kit, number, name, service }) => (
                      <CustomListItemButton
                        key={id}
                        selected
                        sx={{ maxWidth: '31%', width: '100%', minWidth: '31%', position: 'relative' }}
                      >
                        <ListItemText
                          primary={kit} secondary={number} color='secondary' sx={{
                            '& .MuiTypography-root': {
                              color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.secondary.main
                            },
                            '& .MuiListItemText-secondary': {
                              color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.secondary.light,
                              fontWeight: 300
                            }
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            right: 3,
                            top: 3,
                            zIndex: 5,
                            color: 'secondary.200'
                          }}
                        >
                          <RemoveCircleTwoToneIcon fontSize='small' onClick={(e) => handleClick(e, id, name, service, kit)} color='inherit' sx={{ cursor: 'pointer' }} />
                        </Box>
                      </CustomListItemButton>
                    ))}
                    {user?.user?.isPowerUser
                      ? (
                          (preSelected)
                            ? preSelected.map(({ id, kit, number, assignid }) => (
                              <CustomTooltipBtns
                                key={id}
                                type='secondary'
                                title='Previamente vinculada al cliente'
                                followCursor
                                arrow={false}
                              >
                                <CustomListItemButtonDisable
                                  selected
                                  sx={{ maxWidth: '31%', width: '100%', minWidth: '31%' }}
                                >
                                  <ListItemText
                                    primary={kit} secondary={number} color='secondary' sx={{
                                      '& .MuiTypography-root': {
                                        color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.secondary.main
                                      },
                                      '& .MuiListItemText-secondary': {
                                        color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.secondary.light,
                                        fontWeight: 300
                                      }
                                    }}
                                  />
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      right: 3,
                                      top: 3,
                                      zIndex: 5,
                                      color: 'secondary.dark'
                                    }}
                                  >
                                    <RemoveCircleTwoToneIcon
                                      fontSize='small' color='inherit' sx={{ cursor: 'pointer' }} onClick={async () => {
                                        const res = await handleUnlinkWithClient(assignid)
                                        if (res) await getPreSelected()
                                      }}
                                    />
                                  </Box>
                                </CustomListItemButtonDisable>
                              </CustomTooltipBtns>
                            ))
                            : (
                              <>
                                <Skeleton sx={{ maxWidth: '31%', width: '100%', minWidth: '31%', height: 120, mt: -3, borderRadius: 0, bgcolor: theme.palette.mode === 'light' ? 'grey.300' : alpha(theme.palette.grey[900], 0.1) }} />
                                <Skeleton sx={{ maxWidth: '31%', width: '100%', minWidth: '31%', height: 120, mt: -3, borderRadius: 0, bgcolor: theme.palette.mode === 'light' ? 'grey.300' : alpha(theme.palette.grey[900], 0.1) }} />
                              </>
                              )
                        )
                      : null}

                  </Box>
                </AccordionDetails>
              </Accordion>
            )}
            {client && (
              <Accordion defaultExpanded sx={{ backgroundColor: 'transparent', height: 'fit-content', maxHeight: matchDown2Xl ? '55vh' : '60vh', width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreTwoTone />}>
                  <Typography variant='h4' sx={{ color: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[800] : theme.palette.grey[400] }} width='100%'>Terminales Disponibles:</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box display='flex' flexWrap='wrap' columnGap={1} rowGap={2} sx={{ height: 'fit-content', maxHeight: matchDown2Xl ? '55vh' : '60vh' }}>
                    {loading
                      ? skeltonsLoaders.map((op) => (<Skeleton key={op} height={70} />))
                      : (allTerminal.map(({ id, number, name, kit, service }) => (
                        <CustomListItemButton
                          key={id}
                          onClick={(e) => handleClick(e, id, name, service, kit)}
                          sx={{ maxWidth: '31%', width: '100%' }}
                        >
                          <ListItemText
                            primary={`${kit}`} secondary={number} color='info' sx={{
                              '& .MuiTypography-root': {
                                color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.grey[400],
                                fontWeight: 800
                              },
                              '& .MuiListItemText-secondary': {
                                color: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[500] : theme.palette.grey[700],
                                fontWeight: 400
                              }
                            }}
                          />
                        </CustomListItemButton>
                        )
                        ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            )}
          </List>
        </PerfectScrollbar>
      </Box>
    </MainMirrorFade>
  )
}

TermianlsList.propTypes = {
  values: PropTypes.object,
  viewType: PropTypes.bool,
  handleChange: PropTypes.func,
  handleUnlinkWithClient: PropTypes.func,
  hasPreTerminals: PropTypes.func,
  inView: PropTypes.number
}

export default TermianlsList
