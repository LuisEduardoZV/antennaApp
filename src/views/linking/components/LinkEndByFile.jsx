import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

// mui imports
import { Box, Button, Typography } from '@mui/material'

import check from '../../../assets/image/check.gif'
import error from '../../../assets/image/error.gif'

const LinkEndByFile = ({ handleExport, handleContinue, typeEnd }) => {
  const [gif, setGif] = useState('')
  const [retriggerGif] = useState(true)

  const reloadGif = () => {
    setGif('')
    setTimeout(() => setGif(typeEnd === 2 ? check : error), 0)
  }

  useEffect(() => {
    reloadGif()
    return () => setGif('')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retriggerGif])

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      flexDirection: 'column'
    }}
    >
      {typeEnd === 2
        ? (
          <>
            <Typography variant='h1'>¡Vinculación exitosa!</Typography>
            <img src={gif} alt='Chech icon animated' width={200} height={200} />
            <Typography component='a' href='https://lordicon.com/' target='_blank' variant='caption' sx={{ color: 'grey.300', textDecoration: 'none', m: 0, p: 0, mt: -3, mb: 4, fontSize: 9 }}>
              Icon by LordIcon
            </Typography>
            <Typography variant='body2' maxWidth='35%' component='div'>
              Todos los registros ingresados han sido vinculados correctamente.
            </Typography>
            <Button variant='contained' sx={{ mt: 2 }} onClick={handleContinue}>Aceptar</Button>
          </>
          )
        : (
          <>
            <Typography variant='h1'>¡Vinculación inconclusa!</Typography>
            <img src={gif} alt='Chech icon animated' width={200} height={200} />
            <Typography component='a' href='https://lordicon.com/' target='_blank' variant='caption' sx={{ color: 'grey.300', textDecoration: 'none', m: 0, p: 0, mt: -3, mb: 4, fontSize: 9 }}>
              Icon by LordIcon
            </Typography>
            <Typography variant='body2' maxWidth='35%' component='div'>
              Algunos registros presentaron errores de escritura o problemas de conexión con el servidor, de click en <Button variant='text' size='small' onClick={handleExport}>Descargar</Button> para tener aquellos registros que presentaron problemas.
            </Typography>
            <Button variant='contained' sx={{ mt: 2 }} onClick={() => handleContinue(0)}>Cerrar</Button>
          </>
          )}
    </Box>
  )
}

LinkEndByFile.propTypes = {
  handleExport: PropTypes.func,
  handleContinue: PropTypes.func,
  typeEnd: PropTypes.number
}

export default LinkEndByFile
