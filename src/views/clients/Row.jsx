/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

// mui imports
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { Checkbox, Chip, IconButton, TableCell, TableRow } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const Row = ({ element, handleClick, isItemSelected, labelId, hasExtendedRow, RowTemplate, page }) => {
  const theme = useTheme()

  const [rowExpanded, setRowExpanded] = useState(false)

  const active = Number(element.active) === 1
  const mode = theme.palette.mode === 'light'

  useEffect(() => {
    setRowExpanded(false)
  }, [page])

  return (
    <>
      <TableRow hover aria-checked={isItemSelected} tabIndex={-1} selected={isItemSelected} sx={{ cursor: 'pointer' }} onClick={(event) => handleClick(event, element.id)}>
        <TableCell padding='checkbox'>
          <Checkbox
            color='secondary'
            checked={isItemSelected}
            inputProps={{
              'aria-labelledby': 'selection-row'
            }}
            name='selection-row'
          />
        </TableCell>
        <TableCell component='th' id={labelId} align='left' sx={{ color: theme.palette.mode === 'light' ? theme.palette.grey[700] : theme.palette.grey[400] }}>
          {element.clinumber?.trim() !== '' ? element.clinumber?.trim() : '####'}
        </TableCell>
        <TableCell align='left' sx={{ color: theme.palette.mode === 'light' ? theme.palette.grey[700] : theme.palette.grey[400] }}>{element.rfc}</TableCell>
        <TableCell align='left' sx={{ color: theme.palette.mode === 'light' ? theme.palette.grey[700] : theme.palette.grey[400] }}>{element.name}</TableCell>
        <TableCell align='left' sx={{ color: theme.palette.mode === 'light' ? theme.palette.grey[700] : theme.palette.grey[400] }}>{element.email}</TableCell>
        <TableCell align='left' sx={{ color: theme.palette.mode === 'light' ? theme.palette.grey[700] : theme.palette.grey[400] }}>{element.phone}</TableCell>
        <TableCell align='left' sx={{ color: theme.palette.mode === 'light' ? theme.palette.grey[700] : theme.palette.grey[400] }}>
          <Chip label={active ? 'Activo' : 'Inactivo'} size='small' variant='outlined' clickable sx={{ color: active ? mode ? theme.palette.success[800] : theme.palette.success.dark : theme.palette.error.main, borderColor: active ? mode ? theme.palette.success[800] : theme.palette.success.dark : theme.palette.error.main }} />
        </TableCell>
        {hasExtendedRow && (
          <TableCell>
            <IconButton aria-label='expand row' size='small' onClick={() => setRowExpanded(!rowExpanded)}>
              {rowExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
      </TableRow>
      {hasExtendedRow && <RowTemplate rowExpanded={rowExpanded} element={element} />}
    </>
  )
}

Row.propTypes = {
  element: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
  isItemSelected: PropTypes.bool.isRequired,
  labelId: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  hasExtendedRow: PropTypes.bool,
  RowTemplate: PropTypes.any
}

export default Row
