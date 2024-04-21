import PropTypes from 'prop-types'

// thirs imports
import dayjs from 'dayjs'

// mui imports
import { Autocomplete, Box, Button, FormControl, Grid, MenuItem, Select, TextField, Typography, createFilterOptions } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

// auth
import useAuth from '../../../hooks/useAuth'

import { FORMAT_REPORT, REPORT_TYPES /*, UNITY_BYTES */ } from '../../../utils/constants'

const GeneratorForm = ({ clients, clientSelected, setClientSelected, terminals, terminalSelected, setTerminalSelected, firstDate, secondDate, setFirstDate, setSecondDate, handleChangeSelect, reportType, unityType, formatType, requestInfo }) => {
  const { user } = useAuth()

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option) => (option.kit + option.service)
  })

  const filterOptionsClients = createFilterOptions({
    matchFrom: 'any',
    stringify: (option) => (option.name + option.email)
  })

  return (
    <Grid container columnSpacing={2} rowSpacing={6} pt={3} position='relative'>
      <Grid item xs={2} display='flex' alignItems='center'>
        <Typography variant='subtitle1'>Cliente</Typography>
      </Grid>
      <Grid item xs={4}>
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
                placeholder='Seleccione un cliente'
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
      </Grid>
      <Grid item xs={2} display='flex' alignItems='center' justifyContent='end'>
        <Typography variant='subtitle1' component='div' display='flex' gap={0.5}>Terminal {reportType !== 3 && <Typography variant='inherit' color='primary' width='fit-content'>*</Typography>}</Typography>
      </Grid>
      <Grid item xs={4} zIndex={10}>
        <Autocomplete
          disablePortal
          multiple
          limitTags={3}
          filterOptions={filterOptions}
          disabled={reportType === 3}
          size='small'
          id='auto-combo-terminales'
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
            id='elegido'
            placeholder='Seleccione una terminal'
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
            zIndex: 10,
            bgcolor: (theme) => alpha(theme.palette.background.paper, 1),
            color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white,
            '.MuiFormControl-root': {
              maxHeight: 90,
              overflowY: 'auto',
              zIndex: 9999999
            },
            '& .MuiInputBase-input, & .MuiInputBase-root': {
              bgcolor: (theme) => alpha(theme.palette.background.paper, 1),
              color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white
            },
            '& .MuiButtonBase-root.Mui-disabled': {
              bgcolor: (theme) => alpha(theme.palette.background.paper, 0.4),
              color: (theme) => theme.palette.grey[600]
            },
            '& .MuiButtonBase-root.Mui-disabled > .MuiSvgIcon-root': {
              color: (theme) => theme.palette.grey[700]
            },
            '.Mui-disabled': {
              bgcolor: (theme) => alpha(theme.palette.background.paper, 0.4),
              color: (theme) => theme.palette.grey[700]
            }
          }}
        />
      </Grid>


      <Grid item xs={2} display='flex' alignItems='center'>
        <Typography variant='subtitle1'>Fecha de inicio</Typography>
      </Grid>
      <Grid item xs={4}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={firstDate}
            onChange={(newValue) => {
              setFirstDate(dayjs(newValue).set('hour', 0).set('minute', 0).set('second', 0))
            }}
            disableFuture
            sx={{
              width: '100%',
              '& .MuiSvgIcon-root': { color: (theme) => theme.palette.primary.main },
              '& .MuiTextField-root': { bgcolor: 'transparent' },
              '& .MuiOutlinedInput-root': { bgcolor: 'transparent' },
              '& .MuiOutlinedInput-input': { bgcolor: 'transparent' }
            }}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={2} zIndex={1} display='flex' alignItems='center' justifyContent='end'>
        <Typography variant='subtitle1'>Fecha de termino</Typography>
      </Grid>
      <Grid item xs={4} zIndex={1}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={secondDate}
            onChange={(newValue) => setSecondDate(dayjs(newValue).set('hour', 23).set('minute', 59).set('second', 59))}
            disableFuture
            minDate={firstDate}
            sx={{
              width: '100%',
              '& .MuiSvgIcon-root': { color: (theme) => theme.palette.primary.main },
              '& .MuiTextField-root': { bgcolor: 'transparent' },
              '& .MuiOutlinedInput-root': { bgcolor: 'transparent' },
              '& .MuiOutlinedInput-input': { bgcolor: 'transparent' }
            }}
          />
        </LocalizationProvider>
      </Grid>


      <Grid item xs={2} display='flex' alignItems='center'>
        <Typography variant='subtitle1' component='div' display='flex' gap={0.5}>Tipo de Reporte<Typography variant='inherit' color='primary' width='fit-content'>*</Typography></Typography>
      </Grid>
      <Grid item xs={4}>
        <FormControl fullWidth>
          <Select
            id='report'
            name='report'
            value={reportType}
            size='small'
            onChange={handleChangeSelect}
            renderValue={(selected) => {
              if (selected === 0) {
                return <Typography variant='body2' sx={{ color: 'grey.800' }}>Seleccione una opción</Typography>
              }

              return REPORT_TYPES[selected - 1].label
            }}
            sx={{
              bgcolor: 'transparent',
              color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white,
              '& .MuiInputBase-input, & .MuiInputBase-root': {
                bgcolor: 'transparent',
                color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white
              },
              '& .MuiSvgIcon-root': {
                color: (theme) => theme.palette.primary.main
              }
            }}
          >
            <MenuItem disabled value={0}>
              <em>Seleccione una opción</em>
            </MenuItem>
            {REPORT_TYPES.map(({ id, label }) => <MenuItem key={id} value={id} disabled={(id === 3 && !clientSelected)}>{label} {(id === 3 && !clientSelected) && '(Se necesita un cliente)'}</MenuItem>)}
          </Select>
        </FormControl>
      </Grid>
      {/* <Grid item xs={2} display='flex' alignItems='center' justifyContent='end'>
        <Typography variant='subtitle1'>Unidad de Medida</Typography>
      </Grid>
      <Grid item xs={4}>
        <FormControl fullWidth>
          <Select
            id='unity'
            name='unity'
            value={unityType}
            size='small'
            onChange={handleChangeSelect}
            renderValue={(selected) => {
              if (selected === 0) {
                return <Typography variant='body2' sx={{ color: 'grey.800' }}>Seleccione una opción</Typography>
              }

              return UNITY_BYTES[selected - 1].label
            }}
            sx={{
              bgcolor: 'transparent',
              color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white,
              '& .MuiInputBase-input, & .MuiInputBase-root': {
                bgcolor: 'transparent',
                color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white
              },
              '& .MuiSvgIcon-root': {
                color: (theme) => theme.palette.primary.main
              }
            }}
          >
            <MenuItem disabled value={0}>
              <em>Seleccione una opción</em>
            </MenuItem>
            {UNITY_BYTES.map(({ id, label, description }) => <MenuItem key={id} value={id}>{label} (<em>{description}</em>)</MenuItem>)}
          </Select>
        </FormControl>
      </Grid> */}

      <Grid item xs={2} display='flex' alignItems='center' justifyContent='end'>
        <Typography variant='subtitle1'>Formato</Typography>
      </Grid>
      <Grid item xs={4}>
        <FormControl fullWidth>
          <Select
            id='format'
            name='format'
            value={formatType}
            size='small'
            onChange={handleChangeSelect}
            renderValue={(selected) => {
              if (selected === 0) {
                return <Typography variant='body2' sx={{ color: 'grey.800' }}>Seleccione una opción</Typography>
              }

              return FORMAT_REPORT[selected - 1].label
            }}
            sx={{
              bgcolor: 'transparent',
              color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white,
              '& .MuiInputBase-input, & .MuiInputBase-root': {
                bgcolor: 'transparent',
                color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white
              },
              '& .MuiSvgIcon-root': {
                color: (theme) => theme.palette.primary.main
              }
            }}
          >
            <MenuItem disabled value={0}>
              <em>Seleccione una opción</em>
            </MenuItem>
            {FORMAT_REPORT.map(({ id, label }) => <MenuItem key={id} value={id}>{label}</MenuItem>)}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} display='flex' alignItems='center' justifyContent='end'>
        <Button variant='contained' onClick={requestInfo}>Generar Reporte</Button>
      </Grid>
    </Grid>
  )
}

GeneratorForm.propTypes = {
  clients: PropTypes.array,
  clientSelected: PropTypes.object,
  setClientSelected: PropTypes.func,
  terminals: PropTypes.array,
  terminalSelected: PropTypes.array,
  setTerminalSelected: PropTypes.func,
  firstDate: PropTypes.object,
  secondDate: PropTypes.object,
  setFirstDate: PropTypes.func,
  setSecondDate: PropTypes.func,
  handleChangeSelect: PropTypes.func,
  reportType: PropTypes.number,
  unityType: PropTypes.number,
  formatType: PropTypes.number,
  requestInfo: PropTypes.func
}

export default GeneratorForm
