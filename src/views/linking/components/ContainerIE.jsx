import PropTypes from 'prop-types'

// third
import { read, utils } from 'xlsx'

// mui imports
import PublishTwoToneIcon from '@mui/icons-material/PublishTwoTone'
import SimCardDownloadTwoToneIcon from '@mui/icons-material/SimCardDownloadTwoTone'
import { Box, Button } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// project imports
import CustomTooltipBtns from '../../../ui-components/CustomTooltipBtns'
import VisuallyHiddenInput from '../../../ui-components/extended/VisuallyHiddenInput'

const ContainerIE = ({ handleSetDataImported }) => {
  const theme = useTheme()

  const handleDownloadTemplate = () => {
    const link = document.createElement('a')
    link.download = 'PlantillaImportacion.xlsx'
    link.href = './PlantillaImportacion.xlsx'
    link.click()
  }

  const handleImportData = async (e) => {
    const files = e.target.files
    let fileData = null
    if (files.length) {
      const file = files[0]
      const reader = new FileReader()
      reader.onload = async (event) => {
        const wb = read(event.target.result)
        const sheets = wb.SheetNames

        if (sheets.length) fileData = utils.sheet_to_json(wb.Sheets[sheets[0]])
        if (fileData) await handleSetDataImported(fileData)
      }
      reader.readAsArrayBuffer(file)
    }
  }

  return (
    <Box sx={{
      display: 'flex',
      height: 'min-content',
      width: 'fit-content',
      p: 0,
      flexDirection: 'column',
      position: 'absolute',
      top: 0,
      left: '4%'
    }}
    >
      <CustomTooltipBtns type='primary' title='Importar Datos' placement='top'>
        <Button
          role={undefined}
          component='label'
          variant='text'
          size='small'
          sx={{ zIndex: 1, width: 'fit-content', animation: '3s bounce ease-in-out infinite', animationPlayState: 'running', '&:hover': { animationPlayState: 'paused' } }}
        >
          <PublishTwoToneIcon />
          <VisuallyHiddenInput type='file' onChange={handleImportData} accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel' />
        </Button>
      </CustomTooltipBtns>
      <CustomTooltipBtns type='white' title='Descargar plantilla' placement='bottom'>
        <Button
          variant='text'
          size='small'
          sx={{ zIndex: 1, mt: 1, width: 'fit-content', '&:hover': { bgcolor: 'transparent' } }}
          onClick={handleDownloadTemplate}
        >
          <SimCardDownloadTwoToneIcon sx={{ transform: 'rotateY(180deg)', color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.grey[700] }} />
        </Button>
      </CustomTooltipBtns>
    </Box>
  )
}

ContainerIE.propTypes = {
  handleSetDataImported: PropTypes.func
}

export default ContainerIE
