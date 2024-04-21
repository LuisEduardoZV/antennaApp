import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'

// mui imports
import { Autocomplete, Box, Button, Divider, TextField } from '@mui/material'
import { alpha } from '@mui/material/styles'

// project imports
import 'react-perfect-scrollbar/dist/css/styles.css'
import TransferList from '../../../ui-components/TransferList'

// services
import { BASE_URL_API } from '../../../config'
import { apiCall } from '../../../contexts/api'

const DashUserSelection = React.forwardRef(({ values, handleChangeAutocompleteInfo, handleAddUser, disabledBtns, cancelBtn, handleDeleteUser, finishBtn, users, loading, terminalsAsigned, setTerminalsUser, terminales }, ref) => {
  const { id } = values

  const [preSelected, setPreselected] = useState([])
  const [terminalsSelected, setTerminalSelected] = useState(terminalsAsigned ?? [])

  const isUserSelected = useMemo(() => (!!id), [id])

  const validFinish = useMemo(() => ((isUserSelected)), [isUserSelected])

  const disabled = useMemo(() => (terminalsAsigned && terminalsAsigned.length > 0), [terminalsAsigned])

  useEffect(() => {
    (async () => {
      try {
        if (id && id.id && !terminalsAsigned) {
          const { data } = await apiCall({ url: `${BASE_URL_API}/getAsigmentUser?UserId=${id.id}` })
          setPreselected(data)
          setTerminalSelected(data)
        }
      } catch (error) {
        console.log(error)
      }
    })()
  }, [terminalsAsigned, id])

  return (
    <Box ref={ref} display='flex' flexDirection='column' rowGap={3} mt={3}>
      <Box width='100%' display='flex' gap={5} alignItems='center'>
        {!loading && (
          <>
            <Autocomplete
              disablePortal
              fullWidth
              size='small'
              id='auto-combo-users'
              options={cancelBtn ? [] : users}
              value={id}
              onChange={(e, nue) => {
                handleChangeAutocompleteInfo('id', nue)
                if (!nue) setTerminalSelected([])
              }}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(a, b) => (a.id === b.id)}
              renderInput={(params) => <TextField
                {...params}
                label='Usuarios del cliente'
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
            <Box display='flex' minWidth='max-content' justifyContent='end' gap={5} alignItems='start'>
              {!disabledBtns && (
                <>
                  {cancelBtn
                    ? <Button variant='outlined' color='error' onClick={handleDeleteUser}>Eliminar</Button>
                    : <Button variant='outlined' color='primary' disabled={!validFinish} onClick={handleAddUser}>Guardar cambios</Button>}
                  {finishBtn && <Button variant='outlined' color='secondary' type='submit'>Terminar & Vincular</Button>}
                </>
              )}
            </Box>
          </>
        )}
      </Box>
      <Divider sx={{ borderColor: 'grey.900' }} />
      <Box display='flex' flexDirection='column' width='100%' maxHeight='35vh' height='100%'>
        <TransferList terminals={terminales} termSelected={terminalsSelected} setNewTerms={setTerminalsUser} disabled={disabled} preSelected={preSelected} />
      </Box>
    </Box>
  )
})

DashUserSelection.displayName = 'DashUserSelection'

DashUserSelection.propTypes = {
  values: PropTypes.object,
  users: PropTypes.array,
  disabledBtns: PropTypes.bool,
  cancelBtn: PropTypes.bool,
  finishBtn: PropTypes.bool,
  loading: PropTypes.bool,
  client: PropTypes.number,
  handleChangeAutocompleteInfo: PropTypes.func,
  handleAddUser: PropTypes.func,
  handleDeleteUser: PropTypes.func,
  terminalsAsigned: PropTypes.array,
  terminales: PropTypes.array,
  setTerminalsUser: PropTypes.func
}

export default DashUserSelection
