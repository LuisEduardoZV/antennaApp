import PropTypes from 'prop-types'
import { useMemo } from 'react'

// third imports
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import { Line } from 'react-chartjs-2'

// mui imports
import { Box, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend)

const ChartDisponibility = ({ data, title, subtitle, sufix = '', needPorcentualScale = false, needReescale = false }) => {
  const theme = useTheme()

  const options = useMemo(() => ({
    responsive: true,
    scales: {
      y: {
        ticks: {
          callback: function (value, index, ticks) {
            return `${(needPorcentualScale || needReescale) ? Number(value) : Number(value).toFixed(5)}  ${sufix}`
          }
        },
        ...(needPorcentualScale
          ? {
              min: 0,
              max: 100
            }
          : needReescale
            ? {
                min: 0,
                max: Math.ceil(Number(data?.extras?.max)) + 1
              }
            : {
                min: Number(data?.extras?.min),
                max: Number(data?.extras?.max)
              })
      }
    },
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        position: 'top',
        text: title
      }
    }
  }), [title, sufix, needPorcentualScale, data, needReescale])

  const info = useMemo(() => ({
    labels: data?.labels,
    datasets: [{
      fill: true,
      label: subtitle,
      data: data?.data,
      borderColor: theme.palette.primary.main,
      backgroundColor: alpha(theme.palette.primary.main, 0.55)
    }]
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [data, subtitle])

  return (
    <Box width='100%' display='flex' justifyContent='flex-end' justifySelf='self-end' className='div2PDF' flexDirection='column' position='absolute' maxHeight='72vh' top={0}>
      <Line options={options} data={info} />
      <Box id='extraInfo' sx={{ justifySelf: 'start', width: '100%', display: 'flex', gap: 1, alignItems: 'center', px: 2 }}>
        <Box sx={{ width: 20, height: 5, borderRadius: 1, borderColor: 'primary.main', borderWidth: 1, borderStyle: 'solid', bgcolor: alpha(theme.palette.primary.dark, 0.85) }} />
        <Typography variant='subtitle1'>Información</Typography>
        <Typography component='div' variant='caption' marginInline={2} display='flex' gap={0.5}>Max: {data?.extras?.max}<Typography variant='inherit'>{sufix}</Typography></Typography>
        <Typography component='div' variant='caption' marginInline={2} display='flex' gap={0.5}>Min: {data?.extras?.min}<Typography variant='inherit'>{sufix}</Typography></Typography>
        <Typography component='div' variant='caption' marginInline={2} display='flex' gap={0.5}>Media: {data?.extras?.media}<Typography variant='inherit'>{sufix}</Typography></Typography>
      </Box>
    </Box>
  )
}

ChartDisponibility.propTypes = {
  data: PropTypes.object,
  needPorcentualScale: PropTypes.bool,
  needReescale: PropTypes.bool,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  sufix: PropTypes.string
}

export default ChartDisponibility
