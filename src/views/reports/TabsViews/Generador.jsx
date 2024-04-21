/* eslint-disable no-case-declarations */
/* eslint-disable new-cap */
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

// third imports
import dayjs from 'dayjs'
import { toast } from 'sonner'

// mui imports
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

// project imports
import LoadingInfo from '../../../ui-components/LoadingInfo'
import ChartConsume from '../components/ChartConsume'
import ChartDisponibility from '../components/ChartsDisponibility'
import GeneratorForm from '../components/GeneratorForm'

// services
import useAuth from '../../../hooks/useAuth'
import { useDispatch, useSelector } from '../../../store'
import { getAllClients } from '../../../store/slices/clients'
import { getAllTerminals, getTerminalsByClient } from '../../../store/slices/terminals'

import { FORMAT_REPORT /* , UNITY_BYTES */ } from '../../../utils/constants'
import { csvConsume, csvDisponibility, csvFull } from '../func/csvs'
import { consumeReport, disponibilityReport, fullReports } from '../func/generador'
import { pdfAvailableMultiple, pdfAvailableOne, pdfConsumeMultiple, pdfConsumeOne, pdfFull } from '../func/pdfs'

const sufixes = ['Kb/s', 'Kb/Mb', '%', '%', 'ms', '%']

const Row = ({ row, needSufix }) => {
  return (
    <TableRow
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      {row.map((op, index) => (<TableCell key={index} component='th' scope='row' align={needSufix ? 'center' : 'right'}> {isNaN(Number(op).toFixed(2)) ? op : Number(op).toFixed(2)} {index !== 0 && (needSufix ? sufixes[index - 1] : ' MB')}</TableCell>))}
    </TableRow>
  )
}

Row.propTypes = {
  row: PropTypes.array,
  needSufix: PropTypes.bool
}

const Generador = () => {
  const { user } = useAuth()
  const dispatch = useDispatch()

  const { list: clients } = useSelector((state) => state.clients)
  const { terminals, loading } = useSelector((state) => state.terminals)

  const [generating, setGenerating] = useState(false)

  const [terminalSelected, setTerminalSelected] = useState([])
  const [clientSelected, setClientSelected] = useState(null)
  const [reportType, setReportType] = useState(0)
  // const [unityType, setUnityType] = useState(1)
  const [formatType, setFormatType] = useState(2)

  const [firstDate, setFirstDate] = useState(dayjs(new Date()))
  const [secondDate, setSecondDate] = useState(dayjs(new Date()))

  const [dataChartConsume, setChartConsume] = useState({})
  const [dataChartsAvail, setChartsAvail] = useState({})


  const handleChangeSelect = (e) => {
    const type = e.target.name
    switch (type) {
      case 'report':
        setReportType(e.target.value)
        break
      /* case 'unity':
        setUnityType(e.target.value)
        break */
      case 'format':
        setFormatType(e.target.value)
        break
      default:
        break
    }
  }

  const downloadFileConsume = async (rows) => {
    if (!rows) {
      toast.warning('Busqueda vacia. Sin información')
      setGenerating(false)
      return
    }
    if (formatType === 1) {
      await csvConsume(rows, dayjs(firstDate).format('YYYY-MM-DD'), dayjs(secondDate).format('YYYY-MM-DD'), terminalSelected/* , UNITY_BYTES[unityType - 1] */)
      setGenerating(false)
    } else {
      if (terminalSelected.length === 1) {
        if (Object.keys(rows).length > 0) {
          setTimeout(async () => {
            const finish = await pdfConsumeOne(terminalSelected, dayjs(firstDate).format('DD/MM/YYYY'), dayjs(secondDate).format('DD/MM/YYYY'), rows/* , UNITY_BYTES[unityType - 1] */)
            setGenerating(finish)
          }, 1000)
        }
      } else if (terminalSelected.length > 1) {
        setTimeout(async () => {
          const finish = await pdfConsumeMultiple(dayjs(firstDate).format('DD/MM/YYYY'), dayjs(secondDate).format('DD/MM/YYYY'), rows, secondDate.diff(firstDate, 'days'))
          setGenerating(finish)
        }, 1000)
      } else toast.warning('Error en la busqueda')
    }
  }

  const downloadFileDisponibility = async (rows) => {
    if (!rows) {
      toast.warning('Busqueda vacia. Sin información')
      setGenerating(false)
      return
    }
    if (formatType === 1) {
      await csvDisponibility(rows, dayjs(firstDate).format('YYYY-MM-DD'), dayjs(secondDate).format('YYYY-MM-DD'), terminalSelected/* , UNITY_BYTES[unityType - 1] */)
      setGenerating(false)
    } else {
      if (terminalSelected.length === 1) {
        if (Object.keys(rows).length > 0) {
          setTimeout(async () => {
            const finish = await pdfAvailableOne(terminalSelected, dayjs(firstDate).format('DD/MM/YYYY'), dayjs(secondDate).format('DD/MM/YYYY'))
            setGenerating(finish)
          }, 1000)
        } else toast.warning('Busqueda vacia. Sin información')
      } else if (terminalSelected.length > 1) {
        setTimeout(async () => {
          const finish = await pdfAvailableMultiple(dayjs(firstDate).format('DD/MM/YYYY'), dayjs(secondDate).format('DD/MM/YYYY'), rows)
          setGenerating(finish)
        }, 1500)
      } else toast.warning('Error en la busqueda')
    }
  }

  const downloadFullReport = async (rows) => {
    if (!rows) {
      toast.warning('Busqueda vacia. Sin información')
      setGenerating(false)
      return
    }
    if (formatType === 1) {
      await csvFull(rows, dayjs(firstDate).format('YYYY-MM-DD'), dayjs(secondDate).format('YYYY-MM-DD'), clientSelected/* , UNITY_BYTES[unityType - 1] */)
      setGenerating(false)
    } else {
      setTimeout(async () => {
        await pdfFull(dayjs(firstDate).format('DD/MM/YYYY'), dayjs(secondDate).format('DD/MM/YYYY'), rows, clientSelected)
        setGenerating(false)
      }, 1500)
    }
  }

  const requestInfo = async () => {
    setChartConsume({})
    setChartsAvail({})
    if ((terminalSelected.length === 0 || reportType === 0) && reportType !== 3) {
      toast.error('Ingrese los campos obligatorios')
      return
    }
    try {
      setGenerating(true)
      switch (reportType) {
        case 1:
          const rows = await consumeReport(terminalSelected, formatType, dayjs(firstDate).format('YYYY-MM-DD'), dayjs(secondDate).format('YYYY-MM-DD')/* , UNITY_BYTES[unityType - 1] */)
          if (rows) setChartConsume(rows)
          downloadFileConsume(rows)
          break
        case 2:
          const data = await disponibilityReport(terminalSelected, FORMAT_REPORT[formatType - 1], firstDate.set('hour', 0).set('minute', 0).set('second', 0).subtract(6, 'hour').format('YYYY/MM/DD HH:mm'), secondDate.set('hour', 23).set('minute', 59).set('second', 59).subtract(6, 'hour').format('YYYY/MM/DD HH:mm')/* , UNITY_BYTES[unityType - 1] */)
          if (data) setChartsAvail(data)
          downloadFileDisponibility(data)
          break
        case 3:
          const full = await fullReports(terminals, FORMAT_REPORT[formatType - 1], firstDate.set('hour', 0).set('minute', 0).set('second', 0).subtract(6, 'hour').format('YYYY/MM/DD HH:mm'), secondDate.set('hour', 23).set('minute', 59).set('second', 59).subtract(6, 'hour').format('YYYY/MM/DD HH:mm')/* , UNITY_BYTES[unityType - 1] */)
          if (full !== false) {
            setChartsAvail(full.disponibility)
            setChartConsume(full.consume)
          }
          downloadFullReport(full)
          break
        default:
          toast.error('Opción de reporte inválido')
          break
      }
    } catch (error) {
      console.log(error)
    }
  }

  const rendRowsTable = () => {
    const copyData = { ...dataChartConsume }
    delete copyData.labels

    const render = []
    for (const key in copyData) {
      if (Object.hasOwnProperty.call(copyData, key)) {
        const element = copyData[key]
        render.push(
          <Row
            key={key}
            row={element}
          />)
      }
    }
    return render
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
        setTerminalSelected([])
      } else {
        dispatch(getAllTerminals())
        setReportType(0)
      }
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientSelected, user])

  if (loading) return <LoadingInfo />
  if (generating) {
    return (
      <>
        {dataChartConsume && dataChartConsume.data && (
          <Box zIndex={1} width='100%'>
            <ChartConsume data={dataChartConsume} terminal={terminalSelected[0].terminalKitNumber} /* unity={UNITY_BYTES[unityType - 1]} */ />
          </Box>)}
        {dataChartConsume && dataChartConsume.labels && !(dataChartConsume.extras) && (
          <Box zIndex={1} width='100%' display='flex' flexDirection='column' gap={2}>
            <TableContainer component={Paper} sx={{ maxWidth: '80%' }}>
              <Table id='tableConsumeMultiple' sx={{ minWidth: 650, width: '100%', display: 'none' }} aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    {dataChartConsume.labels.map((el, index) => (<TableCell key={index} sx={{ writingMode: 'vertical-lr' }}>{el}</TableCell>))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rendRowsTable()}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        {(dataChartsAvail && dataChartsAvail.pingLatencyMsAvg) && (
          <Box zIndex={1} width='100%' display='flex' flexDirection='column' gap={2}>
            <ChartDisponibility data={dataChartsAvail.uplinkThroughput} title='Rendimiento del Enlace Ascendente' subtitle='Rendimiento del Enlace Ascendente (Mb/s)' sufix='Mb/s' />
            <ChartDisponibility data={dataChartsAvail.signalQuality} title='Calidad de la Señal' subtitle='Calidad de la Señal (%)' sufix='%' needPorcentualScale />
            <ChartDisponibility data={dataChartsAvail.obstructionPercentTime} title='Obstrucción' subtitle='Obstrucción (%)' sufix='%' needReescale />
            <ChartDisponibility data={dataChartsAvail.downlinkThroughput} title='Rendimiento del Enlace Descendente' subtitle='Rendimiento del Enlace Descendente (Mb/s)' sufix='Mb/s' />
            <ChartDisponibility data={dataChartsAvail.pingDropRateAvg} title='Caída de Ping' subtitle='Tasa de Caída de Ping (%)' sufix='%' needPorcentualScale />
            <ChartDisponibility data={dataChartsAvail.pingLatencyMsAvg} title='Latencia' subtitle='Latencia (ms)' sufix='ms' needReescale />
          </Box>)}
        {dataChartsAvail && dataChartsAvail.tableData && (
          <Box zIndex={1} width='100%' display='flex' flexDirection='column' gap={2}>
            <TableContainer component={Paper} sx={{ maxWidth: '100%', maxHeight: '70vh' }}>
              <Table id='tableAvailableMultiple' sx={{ minWidth: 650, width: '100%' }} aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell align='center'>ID</TableCell>
                    <TableCell align='center'>Rendimiento UL</TableCell>
                    <TableCell align='center'>Rendimiento DL</TableCell>
                    <TableCell align='center'>Obstrucción</TableCell>
                    <TableCell align='center'>Calidad de Señal</TableCell>
                    <TableCell align='center'>Latencia</TableCell>
                    <TableCell align='center'>Ping</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataChartsAvail.tableData.map((row, index) => <Row key={index} row={row} needSufix index={index} />
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        <Box width='102%' height='74.5vh' zIndex={10} position='absolute' top={-15} left={-22} sx={{ bgcolor: (theme) => theme.palette.background.paper, borderRadius: 2, display: 'flex', justifyItems: 'center', alignItems: 'center' }}>
          <LoadingInfo subtitle='Obteniendo información.... ' />
        </Box>
      </>
    )
  }
  return (
    <GeneratorForm
      clients={clients}
      clientSelected={clientSelected}
      setClientSelected={setClientSelected}
      terminals={terminals}
      terminalSelected={terminalSelected}
      setTerminalSelected={setTerminalSelected}
      firstDate={firstDate}
      secondDate={secondDate}
      setFirstDate={setFirstDate}
      setSecondDate={setSecondDate}
      handleChangeSelect={handleChangeSelect}
      reportType={reportType}
      // unityType={unityType}
      formatType={formatType}
      requestInfo={requestInfo}
    />
  )
}

export default Generador
