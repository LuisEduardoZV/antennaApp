import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// mui imports
import { Box, Fade } from '@mui/material'
import { alpha } from '@mui/material/styles'

// third
import { Formik } from 'formik'
import { toast } from 'sonner'
import { utils, writeFile } from 'xlsx'
import * as Yup from 'yup'

// project imports
import { BASE_URL_API } from '../../config'
import { apiCallWithBody } from '../../contexts/api'
import useAuth from '../../hooks/useAuth'
import LoadingInfo from '../../ui-components/LoadingInfo'
import FirstContainer from './FirstContainer'
import SecondContainer from './SecondContainer'
import LinkEndByFile from './components/LinkEndByFile'

import { requiredText } from '../../utils/labelsErrorsFormik'

const Linking = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [view, setView] = useState(1)
  const [viewType, setViewType] = useState(null)

  const [imported, setImported] = useState(0)
  const [rowsWErrors, setRowsFile] = useState(null)

  const initVal = useMemo(() => ({
    assignid: 0,
    client: user?.user?.isPowerUser ? null : user?.user?.clientid,
    terminals: [],
    userVinculationInfo: [],
    clientName: '',
    submit: null
  }), [user])

  // values.clientName, user.user.isPowerUser ? null : values.client, 0
  function finishRedirect (name, client, toTerminals) {
    if (!name && !client && !toTerminals) navigate('/terminalsAssigned', { replace: true, state: { view: user?.user?.isPowerUser ? 3 : 2 } })
    if (toTerminals) {
      navigate('/terminals', {
        replace: true,
        state: {
          view: user?.user?.isPowerUser ? 1 : 2, client: name, viewByClient: client
        }
      })
    } else navigate('/terminalsAssigned', { replace: true, state: { view: user?.user?.isPowerUser ? 3 : 2, clientid: client } })
  }

  const handleContinue = () => setView((prev) => prev + 1)

  const handleCancel = () => setView((prev) => prev - 1)

  const handleLinkWithClient = async (client, terminals, clientName) => {
    const toastId = toast.loading('Vinculando...')
    console.log(client)
    console.log(terminals)
    try {
      const newTerminals = terminals.map(({ id }) => ({
        terminalId: id,
        clientid: client
      }))
      const res = await apiCallWithBody({ url: `${BASE_URL_API}/Client_TerminalAll`, body: JSON.stringify(newTerminals) })

      if (res.message === 'success') {
        toast.success('Se ha vinculado correctamente las terminales con el cliente', { id: toastId })
        finishRedirect(clientName, client, 1)
      } else throw new Error()
    } catch (error) {
      console.log(error)
      toast.error('Error al vincular las terminales con el cliente', { id: toastId })
    }
  }

  const handleUnlinkWithClient = async (id) => {
    const toastId = toast.loading('Desvinculando...')
    try {
      const res = await apiCallWithBody({ url: `${BASE_URL_API}/ClientTerminals/${id}`, method: 'DELETE' })
      if (res && res.message === 'success') {
        toast.success('Se ha desvinculado correctamente', { id: toastId })
        return true
      } else throw new Error('Error al desvincular la terminal ya que está vinculada con un usuario')
    } catch (error) {
      console.log(error)
      toast.error(error.message, { id: toastId })
    }
  }

  const handleExportErrors = async (e) => {
    const headings = [[
      'Cliente',
      'Kit',
      'EmailUser',
      'Error'
    ]]
    const wb = utils.book_new()
    const ws = utils.json_to_sheet([])
    utils.sheet_add_aoa(ws, headings)
    utils.sheet_add_json(ws, rowsWErrors, { origin: 'A2', skipHeader: true })
    utils.book_append_sheet(wb, ws, 'Errors')
    writeFile(wb, 'ErrorsExported.xlsx')
  }

  useEffect(() => {
    if (user && user.user && user.user.isPowerUser) setViewType(true)
    else {
      setViewType(false)
      handleContinue()
    }
  }, [user])

  return (
    <Box position='relative' minHeight='max-content'>
      {/* imported > 0 && () */}
      <Fade in={imported > 0}>
        <Box sx={{
          position: 'fixed',
          width: '100%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          bgcolor: (theme) => alpha(theme.palette.common.black, 0.89),
          minHeight: '100vh',
          display: 'flex'
        }}
        >
          {imported === 1 && <LoadingInfo subtitle='Se vincularán todas las terminales y asignaciones a usuarios. Esto puede demorar, un momento.' />}
          {imported === 2 && <LinkEndByFile handleExport={handleExportErrors} handleContinue={finishRedirect} typeEnd={imported} />}
          {imported === 3 && <LinkEndByFile handleExport={handleExportErrors} handleContinue={setImported} typeEnd={imported} />}
        </Box>
      </Fade>
      <Formik
        initialValues={initVal}
        validationSchema={Yup.object().shape({
          client: Yup.string().required(requiredText),
          terminals: Yup.array()
        })}
        onSubmit={async (values, { setStatus, setSubmitting }) => {
          delete values.submit

          const toastId = toast.loading('Vinculando...')
          try {
            if (values.terminals && values.terminals.length > 0) await handleLinkWithClient(values.client, values.terminals, values.clientName)

            // console.log(values.userVinculationInfo)
            const usersInfo = []
            for (let i = 0; i < values.userVinculationInfo.length; i++) {
              const user = values.userVinculationInfo[i]
              console.log(user)
              if (user.id) {
                usersInfo.push({ terminals: user.terminals, userId: user.id.id })
              }
            }

            // console.log(usersInfo)

            const globalData = []
            for (let i = 0; i < usersInfo.length; i++) {
              const data = usersInfo[i]
              for (let j = 0; j < data.terminals.length; j++) {
                const mainInfo = { userId: data.userId, terminalId: data.terminals[j].id, clientid: values.client }
                globalData.push(mainInfo)
              }
            }

            // console.log(globalData)

            const { message } = await apiCallWithBody({ url: `${BASE_URL_API}/AssignsALL`, method: 'POST', body: JSON.stringify(globalData) })

            if (message && message === 'success') {
              toast.success('Se han vinculado correctamente los usuarios', { id: toastId })
              setStatus({ success: true })
              setSubmitting(false)
              finishRedirect(values.clientName, user.user.isPowerUser ? null : values.client, 0)
            }
          } catch (error) {
            toast.error(error.message, { id: toastId })
          }
        }}
      >
        {({ values, handleSubmit, setFieldValue }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', px: '4%', gap: view ? 5 : 10, height: '100%', width: '100%', justifyContent: 'center', position: 'relative' }}>
              <FirstContainer
                values={values}
                inView={view}
                handleChange={setFieldValue}
                handleContinue={handleContinue}
                viewType={viewType}
                handleLinkWithClient={handleLinkWithClient}
                handleUnlinkWithClient={handleUnlinkWithClient}
                isImporting={setImported}
                setRowsWErrors={setRowsFile}
              />
              <SecondContainer
                inView={view}
                values={values}
                handleChange={setFieldValue}
                viewType={viewType}
                handleCancel={handleCancel}
              />
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  )
}

export default Linking
