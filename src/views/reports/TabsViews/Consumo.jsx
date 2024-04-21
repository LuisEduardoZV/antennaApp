/* eslint-disable new-cap */
import { useEffect, useState } from 'react'

// third imports
import dayjs from 'dayjs'

// mui imports
import TableChartTwoToneIcon from '@mui/icons-material/TableChartTwoTone'
import { Autocomplete, Box, Button, Collapse, Divider, IconButton, TextField, Typography, createFilterOptions } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

// project imports
import CustomTooltipBtns from '../../../ui-components/CustomTooltipBtns'
import LoadingInfo from '../../../ui-components/LoadingInfo'
import NoInfoOverlay from '../../../ui-components/NoInfoOverlay'
import ChartConsume from '../components/ChartConsume'

// services
import useAuth from '../../../hooks/useAuth'
import { useDispatch, useSelector } from '../../../store'
import { getAllClients } from '../../../store/slices/clients'
import { getAllTerminals, getTerminalsByClient } from '../../../store/slices/terminals'
import { consumeReport } from '../func/generador'
import { pdfConsumeOne } from '../func/pdfs'


const Consumo = () => {
  const { user } = useAuth()
  const theme = useTheme()
  const dispatch = useDispatch()

  const { list: clients } = useSelector((state) => state.clients)
  const { terminals, loading } = useSelector((state) => state.terminals)

  const [terminalSelected, setTerminalSelected] = useState(null)
  const [clientSelected, setClientSelected] = useState(null)

  const [firstDate, setFirstDate] = useState(dayjs(new Date()))
  const [secondDate, setSecondDate] = useState(dayjs(new Date()))

  const [data, setData] = useState(null)

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option) => (option.kit + option.service)
  })

  const filterOptionsClients = createFilterOptions({
    matchFrom: 'any',
    stringify: (option) => (option.name + option.email)
  })


  const div2PDF = async (e) => {
    await pdfConsumeOne([terminalSelected], dayjs(firstDate).format('DD/MM/YYYY'), dayjs(secondDate).format('DD/MM/YYYY'), data)
  }

  useEffect(() => {
    (async () => {
      dispatch(getAllClients())
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    (async () => {
      if ((clientSelected && clientSelected.id) || (user && user.user && !(user.user.isPowerUser))) {
        const id = !(user.user.isPowerUser) ? user.user.clientid : clientSelected.id
        dispatch(getTerminalsByClient(id))
        setTerminalSelected(null)
      } else dispatch(getAllTerminals())
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientSelected, user])

  if (loading) return <LoadingInfo />
  return (
    <>
      <Box width='100%' display='flex' justifyContent='space-between' alignItems='center' gap={2} position='relative'>
        {user?.user?.isPowerUser
          ? <Autocomplete
              disablePortal
              filterOptions={filterOptionsClients}
              size='small'
              id='auto-combo-users'
              options={clients}
              value={clientSelected}
              onChange={(e, nue) => setClientSelected(nue)}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(a, b) => (a.id === b.id)}
              renderOption={(props, option) => (
                <Box key={option.id} component='li' sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'start' }} {...props}>
                  <Typography variant='body2' textAlign='start' width='100%' sx={{ color: (theme) => theme.palette.mode === 'light' ? 'grey.800' : 'grey.400' }}>{option.name}</Typography>
                  <Typography variant='subtitle2' textAlign='start' width='100%' sx={{ color: (theme) => theme.palette.mode === 'light' ? 'primary.dark' : 'grey.700' }}>{option.email}</Typography>
                </Box>
              )}
              renderInput={(params) => <TextField
                {...params}
                label='Seleccione un cliente'
                sx={{
                  '& .MuiButtonBase-root': {
                    color: (theme) => theme.palette.secondary.main
                  },
                  '& .MuiChip-root': {
                    color: 'black',
                    bgcolor: (theme) => theme.palette.secondary.main
                  },
                  '& .MuiChip-root.Mui-disabled': {
                    color: 'black',
                    bgcolor: (theme) => theme.palette.secondary[800]
                  },
                  '& .MuiButtonBase-root.Mui-disabled': {
                    color: (theme) => theme.palette.secondary[800]
                  },
                  '.Mui-disabled': {
                    bgcolor: (theme) => alpha(theme.palette.grey[600], 1)
                  }
                }}
                                       />}
              sx={{
                width: '25%',
                bgcolor: (theme) => alpha(theme.palette.background.paper, 1),
                color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white,
                '.Mui-disabled': {
                  bgcolor: (theme) => alpha(theme.palette.grey[600], 1),
                  color: (theme) => theme.palette.grey[700]
                },
                '& .MuiInputBase-input, & .MuiInputBase-root': {
                  bgcolor: (theme) => alpha(theme.palette.background.paper, 1),
                  color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white
                }
              }}
            />
          : null}
        <Autocomplete
          disablePortal
          filterOptions={filterOptions}
          size='small'
          id='auto-combo-users'
          options={terminals}
          value={terminalSelected}
          onChange={(e, nue) => setTerminalSelected(nue)}
          getOptionLabel={(option) => option.kit}
          isOptionEqualToValue={(a, b) => (a.id === b.id)}
          renderOption={(props, option) => (
            <Box key={option.service} component='li' sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'start' }} {...props}>
              <Typography variant='body2' textAlign='start' width='100%' sx={{ color: (theme) => theme.palette.mode === 'light' ? 'grey.800' : 'grey.400' }}>{option.kit}</Typography>
              <Typography variant='subtitle2' textAlign='start' width='100%' sx={{ color: (theme) => theme.palette.mode === 'light' ? 'primary.dark' : 'grey.700' }}>{option.service}</Typography>
            </Box>
          )}
          renderInput={(params) => <TextField
            {...params}
            label='Seleccione una terminal'
            sx={{
              '& .MuiButtonBase-root': {
                color: (theme) => theme.palette.primary.main
              },
              '& .MuiChip-root': {
                color: 'black',
                bgcolor: (theme) => theme.palette.primary.main
              },
              '& .MuiChip-root.Mui-disabled': {
                color: 'black',
                bgcolor: (theme) => theme.palette.primary[800]
              },
              '& .MuiButtonBase-root.Mui-disabled': {
                color: (theme) => theme.palette.primary[800]
              },
              '.Mui-disabled': {
                bgcolor: (theme) => alpha(theme.palette.grey[600], 1)
              }
            }}
                                   />}
          sx={{
            width: user?.user?.isPowerUser ? '25%' : '45%',
            bgcolor: (theme) => alpha(theme.palette.background.paper, 1),
            color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white,
            '.Mui-disabled': {
              bgcolor: (theme) => alpha(theme.palette.grey[600], 1),
              color: (theme) => theme.palette.grey[700]
            },
            '& .MuiInputBase-input, & .MuiInputBase-root': {
              bgcolor: (theme) => alpha(theme.palette.background.paper, 1),
              color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white
            }
          }}
        />


        <Box display='flex' flex={1} justifyContent='flex-end' alignSelf='end' gap={2} width='50%'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Fecha de inicio'
              value={firstDate}
              onChange={(newValue) => {
                setFirstDate(newValue)
              }}
              disableFuture
              sx={{
                '& .MuiInputLabel-root': { color: (theme) => theme.palette.primary.main },
                '& .MuiTextField-root': { bgcolor: 'transparent' },
                '& .MuiOutlinedInput-root': { bgcolor: 'transparent' },
                '& .MuiOutlinedInput-input': { bgcolor: 'transparent' }
              }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Fecha de termino'
              value={secondDate}
              onChange={(newValue) => setSecondDate(newValue)}
              disableFuture
              minDate={firstDate}
              sx={{
                '& .MuiInputLabel-root': { color: (theme) => theme.palette.primary.main },
                '& .MuiTextField-root': { bgcolor: 'transparent' },
                '& .MuiOutlinedInput-root': { bgcolor: 'transparent' },
                '& .MuiOutlinedInput-input': { bgcolor: 'transparent' }
              }}
            />
          </LocalizationProvider>
          <Button
            variant='outlined' sx={{ alignSelf: 'center' }} onClick={async () => {
              const res = await consumeReport(terminalSelected, null, dayjs(firstDate).format('YYYY-MM-DD'), dayjs(secondDate).format('YYYY-MM-DD'), null)
              console.log(res)
              setData(res)
            }}
          >Generar
          </Button>
        </Box>
      </Box>
      <Divider sx={{ width: '100%', borderColor: theme.palette.mode === 'light' ? theme.palette.grey[400] : theme.palette.grey[700], my: 2 }} />
      <Collapse in={!!data} sx={{ mt: 1 }}>
        <Box
          width='100%'
          display='flex'
          flexDirection='column'
          alignItems='end'
        >
          {(data && (data.labels.length === 0 || data.data.length === 0)) ? <NoInfoOverlay /> : null}
          {(data && (data.labels.length !== 0 || data.data.length !== 0))
            ? (
              <>
                <Box display='flex' position='absolute' zIndex={1} left={0}>
                  <CustomTooltipBtns type='primary' title='Exportar a PDF'>
                    <IconButton size='small' type='submit' onClick={div2PDF}>
                      <TableChartTwoToneIcon color='primary' />
                    </IconButton>
                  </CustomTooltipBtns>
                </Box>
                <ChartConsume data={data} terminal={terminalSelected?.kit} />
              </>
              )
            : null}
        </Box>
      </Collapse>
    </>
  )
}

export default Consumo
