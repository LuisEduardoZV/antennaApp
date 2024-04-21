/* eslint-disable array-callback-return */
import PropTypes from 'prop-types'
import { useEffect, useMemo, useState } from 'react'

// mui imports
import TrendingFlatTwoToneIcon from '@mui/icons-material/TrendingFlatTwoTone'
import { Box, Button, Fade, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// project imports
import useAuth from '../../hooks/useAuth'
import ClientList from './Step1/ClientList'
import TermianlsList from './Step1/TermianlsList'
import ContainerIE from './components/ContainerIE'

// services
import { BASE_URL_API } from '../../config'
import { apiCall, apiCallWithBody } from '../../contexts/api'

const FirstContainer = ({ values, inView, handleChange, handleContinue, viewType, handleLinkWithClient, handleUnlinkWithClient, isImporting, setRowsWErrors }) => {
  const { user } = useAuth()
  const theme = useTheme()
  const { client, terminals } = values

  const [hasTerminalsPre, setHasTerPre] = useState(false)

  const btnActive = useMemo(() => (client !== null && terminals.length > 0 && inView === 1), [client, terminals, inView])

  const btnActiveJustPre = useMemo(() => (client !== null && inView === 1 && hasTerminalsPre), [client, inView, hasTerminalsPre])

  const matchDown2Xl = useMediaQuery(theme.breakpoints.down('2xl'))

  const handleSetDataImported = async (data) => {
    isImporting(1)
    const { data: clients } = await apiCall({ url: `${BASE_URL_API}/Clientes` })
    const { data: terminals } = await apiCall({ url: `${BASE_URL_API}/Terminales` })

    const linkInfoErrors = []
    for (const [index, row] of data.entries()) {
      const rowComplete = {
        Cliente: row.Cliente ?? '',
        Kit: row.Kit ?? '',
        EmailUser: row.EmailUser ?? ''
      }
      if (row.Cliente && row.Kit) {
        const mainInfo = {
          LinkWClient: null,
          LinkWUser: null
        }
        let msg = ''

        // GETTING CLIENT INFO
        const clientInfo = await clients.find((cl) => (cl.email.toString().toLowerCase() === row.Cliente.toString().toLowerCase()))
        if (!clientInfo) {
          msg = `No se encontró información de algún cliente vinculado a ${row.Cliente}. La entrada ${index + 2} no se efectuará.`
          linkInfoErrors.push({ ...rowComplete, Error: msg })
          continue
        }

        // GETTING TERMINAL INFO
        const terminalInfo = await terminals.find((ter) => (ter.kit.toString().toLowerCase() === row.Kit.toString().toLowerCase()))
        if (!terminalInfo) {
          msg = `No se encontró información de la terminal ${row.Kit}. La entrada ${index + 2} no se efectuará.`
          linkInfoErrors.push({ ...rowComplete, Error: msg })
          continue
        }

        // CHECK IF TERMINAL IS ALREADY LINKED TO CLIENT
        const { data: terminalsLinkedClient } = await apiCall({ url: `${BASE_URL_API}/getClientTerminalesAllCli?id=${clientInfo.id}` })
        const alreadyLink = await terminalsLinkedClient.find((op) => (op.id === terminalInfo.id))
        if (!alreadyLink) mainInfo.LinkWClient = { terminalId: terminalInfo.id, clientid: clientInfo.id }

        // CHECK USER AND DASHBOARD INFO EXIST
        if (row.EmailUser && clientInfo && clientInfo.id && terminalInfo) {
          const { data: users } = await apiCall({ url: `${BASE_URL_API}/getClientUser?id=${clientInfo.id}` })
          if (!Array.isArray(users) || users.length === 0) {
            msg = `El cliente ${row.Cliente} no tiene usuarios resgistrados. La entrada ${index + 2} no se efectuará.`
            linkInfoErrors.push({ ...rowComplete, Error: msg })
            continue
          }
          const userInfo = await users.find((us) => (us.email.toString().toLowerCase() === row.EmailUser.toString().toLowerCase()))
          if (!userInfo) {
            msg = `No se encontró ningún usuario con el correo ${row.EmailUser} vinculado al cliente. La entrada ${index + 2} no se efectuará.`
            linkInfoErrors.push({ ...rowComplete, Error: msg })
            continue
          }

          const { data: terminalsLinkUser } = await apiCall({ url: `${BASE_URL_API}/getAsigmentUser?UserId=${userInfo.id}` })
          const alreadyLink = await terminalsLinkUser.find((op) => op.id === terminalInfo.id)
          if (alreadyLink) continue

          mainInfo.LinkWUser = {
            clientid: clientInfo.id,
            userId: userInfo.id,
            terminalId: terminalInfo.id
          }
        }

        console.log(mainInfo)
        // JUST INCLUDE IF CAN LINK WITH CLIENT AND/OR USER
        const responseLink = await getFinalData(mainInfo)
        if (typeof responseLink === 'string') linkInfoErrors.push({ ...rowComplete, Error: responseLink })
      }
    }
    setRowsWErrors(linkInfoErrors)
    if (linkInfoErrors.length > 0) isImporting(3)
    else isImporting(2)
  }

  const getFinalData = async (data) => {
    try {
      const { LinkWClient, LinkWUser } = data
      console.log(data)
      if (LinkWClient) {
        const linkCkient = await apiCallWithBody({ url: `${BASE_URL_API}/Client_TerminalAll`, body: JSON.stringify([LinkWClient]) })
        if (linkCkient && linkCkient.message !== 'success') {
          throw new Error('No se ha vinculado la terminal con el cliente')
        }
      }
      if (LinkWUser) {
        const linkUser = await apiCallWithBody({ url: `${BASE_URL_API}/AssignsAll`, method: 'POST', body: JSON.stringify([LinkWUser]) })
        if (linkUser && linkUser.message !== 'success') {
          throw new Error('Error al vincular el usuario con la terminal')
        }
      }
      return true
    } catch (error) {
      console.log(error)
      return error.message
    }
  }

  useEffect(() => {
    if (client === null || terminals.length === 0) {
      handleChange('userVinculationInfo', [])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, terminals])

  return (
    <>
      {(user?.user?.isPowerUser && inView === 1) ? <ContainerIE handleSetDataImported={handleSetDataImported} /> : null}
      {viewType && <ClientList inView={inView} handleChange={handleChange} />}
      <TermianlsList inView={inView} values={values} handleChange={handleChange} viewType={viewType} handleUnlinkWithClient={handleUnlinkWithClient} hasPreTerminals={setHasTerPre} />
      <Box
        position='absolute'
        right={viewType ? '4%' : '10%'}
        bottom={matchDown2Xl ? '-10%' : '-6%'}
        zIndex={(btnActive || btnActiveJustPre) ? 5 : -1}
        sx={{
          maxWidth: viewType ? '60%' : '90%',
          minWidth: viewType ? '60%' : '90%',
          width: '100%'
        }}
      >
        <Fade in={(btnActive || btnActiveJustPre)}>
          <Box width='100%' display='flex' justifyContent={(btnActive && btnActiveJustPre) ? 'space-between' : 'flex-end'}>
            {(user?.user?.isPowerUser && btnActive)
              ? (
                <Button variant='outlined' onClick={() => handleLinkWithClient(client, terminals, values.clientName)} color='inherit'>
                  Terminar vinculación
                </Button>
                )
              : null}
            <Button variant='contained' endIcon={<TrendingFlatTwoToneIcon />} onClick={handleContinue}>
              Continuar & Asignar a Usuarios
            </Button>
          </Box>
        </Fade>
      </Box>
    </>
  )
}

FirstContainer.propTypes = {
  values: PropTypes.object,
  inView: PropTypes.number,
  viewType: PropTypes.bool,
  handleChange: PropTypes.func,
  handleLinkWithClient: PropTypes.func,
  handleUnlinkWithClient: PropTypes.func,
  handleContinue: PropTypes.func,
  isImporting: PropTypes.func,
  setRowsWErrors: PropTypes.func
}

export default FirstContainer
