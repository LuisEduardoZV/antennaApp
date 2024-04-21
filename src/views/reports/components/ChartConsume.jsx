import PropTypes from 'prop-types'
import { useMemo } from 'react'

// third imports
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

// mui imports
import { Box, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const ChartConsume = ({ data, toSave, terminal/* , unity */ }) => {
  const theme = useTheme()

  const info = useMemo(() => ({
    labels: data.labels ?? [],
    datasets: [{
      label: 'Datos consumidos en (MB)',
      data: data.data ?? [],
      backgroundColor: alpha(theme.palette.primary.dark, 0.4),
      borderColor: theme.palette.common.white
    }]
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [data/* , unity */])

  const options = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: `Consumo de datos de la terminal: ${terminal}`
      }
    }
  }), [terminal])

  if (Object.keys(data).length === 0) return null
  return (
    <>
      <Box width='98%' display='flex' justifyContent='flex-end' justifySelf='self-end' className='div2PDF' flexDirection='column' position='relative'>
        <Bar options={options} data={info} height={115} />
        <Box sx={{ justifySelf: 'start', width: '100%', display: 'flex', gap: 1, alignItems: 'center', px: 2, mt: 1 }}>
          <Box sx={{ width: 20, height: 5, borderRadius: 1, borderColor: 'primary.main', borderWidth: 1, borderStyle: 'solid', bgcolor: alpha(theme.palette.primary.dark, 0.85) }} />
          <Typography variant='subtitle1'>Información</Typography>
          <Typography variant='caption' marginInline={1}>Max: {data.extras.max} GB</Typography>
          <Typography variant='caption' marginInline={1}>Min: {data.extras.min} MB</Typography>
          <Typography variant='caption' marginInline={1}>Media: {data.extras.media} MB</Typography>
        </Box>
      </Box>
    </>
  )
}

ChartConsume.propTypes = {
  data: PropTypes.object,
  unity: PropTypes.object,
  toSave: PropTypes.bool,
  terminal: PropTypes.string
}

export default ChartConsume
