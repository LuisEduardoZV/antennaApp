import React from 'react'

import { TextField } from '@mui/material'
import PropTypes from 'prop-types'

const InputBase = React.forwardRef(({ error, extraSx, color, ...others }, ref) => (
  <TextField
    {...others}
    ref={ref}
    error={error}
    sx={{
      boxShadow: (theme) => theme.shadows[5],
      bgcolor: (theme) => theme.palette.background.default,
      '& .MuiInputBase-input': {
        color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white,
        WebkitTextFillColor: (theme) => theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white
      },
      '& .MuiFilledInput-root::after': {
        borderBottomColor: (theme) => `${theme.palette[color].main}!important`
      },
      '& .MuiInputLabel-root': {
        color: !error && ((theme) => theme.palette[color].main)
      },
      '& .Mui-disabled, & .Mui-readOnly': {
        WebkitTextFillColor: 'inherit'
      },
      '& .MuiInputLabel-root.Mui-disabled': {
        color: (theme) => theme.palette[color][800]
      },
      '& .MuiInputBase-input.MuiFilledInput-input.Mui-disabled ': {
        color: (theme) => theme.palette[color][800],
        WebkitTextFillColor: 'inherit'
      },
      ...extraSx
    }}
    inputProps={{ autoComplete: 'off', autoCorrect: 'off' }}
  />
))

InputBase.displayName = 'InputBase'

InputBase.propTypes = {
  error: PropTypes.bool,
  extraSx: PropTypes.object,
  color: PropTypes.string
}

export default InputBase
