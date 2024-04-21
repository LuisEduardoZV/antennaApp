/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// third
import { toast } from 'sonner'

// mui imports
import LeakAddTwoToneIcon from '@mui/icons-material/LeakAddTwoTone'
import ReplyAllTwoToneIcon from '@mui/icons-material/ReplyAllTwoTone'
import { Box, Collapse, Divider, IconButton } from '@mui/material'

// project imports
import AsideMenuCrud from '../../ui-components/AsideMenuCrud'
import CustomTooltipBtns from '../../ui-components/CustomTooltipBtns'
import MainMirrorCard from '../../ui-components/MainMirrorCard'
import ModalDelete from '../../ui-components/ModalDelete'
import MenuDeleteAll from '../../ui-components/extended/MenuDeleteAll'
import TableTerminals from './components/TableTerminals'
import TreeViewTerminals from './components/TreeViewTerminals'

// services
import { BASE_URL_API } from '../../config'
import { apiCall } from '../../contexts/api'
import { useDispatch, useSelector } from '../../store'
import { convertToTreeViewData, getAllTerminalsAssigned, getTerminalsByUser, resetErrorUsed } from '../../store/slices/terminalsAssigned'

const toastId = toast()

const TerminalsAssigned = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const typeOfView = useMemo(() => (state?.typeViewTerminals), [state])

  const { terminals, error, loading, pureData } = useSelector((state) => state.terminalsAssigned)

  const [render, setRender] = useState(false)
  const [dataTerminals, setDataTerminals] = useState([])
  const [dataUser, setDataUser] = useState([])

  const [open, setOpen] = useState(false)

  const [selected, setSelected] = useState([])
  const [dataSelected, setDataSelected] = useState(null)

  const dataShow = useMemo(() => (typeOfView ? dataUser : dataTerminals), [typeOfView, dataUser, dataTerminals])

  const handleClose = () => { setOpen(false) }

  const handleDelete = (id, data) => {
    setSelected([id])
    setDataSelected(data)
    setOpen(true)
  }

  const handleDeleteAll = async (close) => {
    const toastId = toast.loading('Eliminando...')

    const promisesDelete = dataUser.map((op) => {
      const { assignuserid } = op
      const data = apiCall({ url: `${BASE_URL_API}/Assigns/${assignuserid}`, method: 'DELETE' })
      return data
    })

    await Promise.all(promisesDelete)
      .then((values) => {
        values.forEach(element => {
          if (!element) toast.error('Error al eliminar la vinculación', { id: toastId })
        })
      })
      .catch((error) => {
        console.log(error)
        toast.error(error.message, { id: toastId })
      })

    toast.success('Se han desvinculado todas las terminales', { id: toastId })
    setRender((prev) => !prev)
    close()
  }

  const handleSearchByUser = (e, filters) => {
    if (filters.length === 0) {
      setDataUser(pureData)
    } else {
      const newRows = []
      const available = pureData

      for (let j = 0; j < filters.length; j += 1) {
        for (let i = 0; i < available.length; i += 1) {
          if (
            available[i]?.fullName?.toLowerCase().includes(filters[j].trim().toLowerCase()) ||
            available[i]?.name.toLowerCase().includes(filters[j].trim().toLowerCase()) ||
            available[i]?.clientName.toLowerCase().includes(filters[j].trim().toLowerCase()) ||
            available[i]?.email.toLowerCase().includes(filters[j].trim().toLowerCase()) ||
            available[i]?.service.toLowerCase().includes(filters[j].trim().toLowerCase()) ||
            available[i]?.alias.toLowerCase().includes(filters[j].trim().toLowerCase())
          ) {
            if (!newRows.find((value) => value === available[i])) {
              newRows.push(available[i])
            }
          }
        }
      }

      setDataUser(newRows)
    }
  }

  const handleSearch = async (e, filters) => {
    if (filters.length === 0) {
      setDataTerminals(terminals)
    } else {
      const newRows = []
      const available = pureData

      for (let j = 0; j < filters.length; j += 1) {
        for (let i = 0; i < available.length; i += 1) {
          if (
            available[i].fullName?.toLowerCase().includes(filters[j].trim().toLowerCase()) ||
            available[i].dashboardName?.toLowerCase()?.includes(filters[j].trim().toLowerCase()) ||
            available[i].name.toLowerCase().includes(filters[j].trim().toLowerCase()) ||
            available[i]?.clientName.toLowerCase().includes(filters[j].trim().toLowerCase()) ||
            available[i]?.email.toLowerCase().includes(filters[j].trim().toLowerCase()) ||
            available[i]?.service.toLowerCase().includes(filters[j].trim().toLowerCase()) ||
            available[i]?.alias.toLowerCase().includes(filters[j].trim().toLowerCase())
          ) {
            if (!newRows.find((value) => value === available[i])) {
              newRows.push(available[i])
            }
          }
        }
      }

      setDataTerminals(await convertToTreeViewData(newRows))
    }
  }

  const handleDeleteTerminalAssigned = async () => {
    const toastId = toast.loading('Cargando...')
    try {
      const data = await apiCall({ url: `${BASE_URL_API}/Assigns/${selected[0]}`, method: 'DELETE' })
      setRender((prev) => !prev)
      if (data) toast.success('Exito al eliminar la vinculación', { id: toastId })
    } catch (error) {
      console.log(error)
      toast.error(error.message, { id: toastId })
    }
    setOpen(false)
  }

  useEffect(() => {
    setDataTerminals(terminals)
    setDataUser(pureData)
  }, [terminals, pureData])

  useEffect(() => {
    (async () => {
      if (state) {
        if (state.clientid) dispatch(getAllTerminalsAssigned(state.clientid))
        else if (state.userId) dispatch(getTerminalsByUser(state.userId))
        else dispatch(getAllTerminalsAssigned())
      } else {
        dispatch(getAllTerminalsAssigned())
      }
    })()
  }, [state, render])

  useEffect(() => {
    if (error) {
      toast.error(error?.message, { id: toastId })
      dispatch(resetErrorUsed())
    }
  }, [error])

  return (
    <>
      <AsideMenuCrud
        inFade={false}
        dataSelected={dataSelected}
        addIcon={LeakAddTwoToneIcon}
        handleSearch={typeOfView ? handleSearchByUser : handleSearch}
        btnsAvailable={false}
        {...(state && state.userId) && {
          extraBtns: [
            <CustomTooltipBtns key='backbtn' type='primary' title='Regresar'>
              <IconButton onClick={() => { navigate(-1) }}>
                <ReplyAllTwoToneIcon color='primary' />
              </IconButton>
            </CustomTooltipBtns>,
            <Collapse key='dividerMenu' in={dataShow.length > 0}>
              <Box>
                <Divider sx={{ my: 0.5, borderColor: (theme) => theme.palette.mode === 'light' && theme.palette.primary.dark, display: dataShow.length === 0 && 'none' }} />
                <MenuDeleteAll key='menudeleteall' deleteAll={handleDeleteAll} visibility={dataShow.length > 0} />
              </Box>
            </Collapse>
          ]
        }}
      />

      <Box sx={{ display: 'flex', flex: 1, px: '10%' }}>
        <MainMirrorCard>
          {
            typeOfView
              ? (
                <TableTerminals
                  loading={loading}
                  data={dataShow}
                  handleDelete={handleDelete}
                />
                )
              : (
                <TreeViewTerminals
                  loading={loading}
                  data={dataShow}
                  handleDelete={handleDelete}
                  needRender={setRender}
                />
                )
          }
        </MainMirrorCard>
      </Box>

      <ModalDelete
        handleClose={handleClose}
        open={open}
        id={selected[0]}
        handleDelete={handleDeleteTerminalAssigned}
        title='Eliminar vinculo de terminal'
        subtitle={<><b>¿Estás seguro de desvincular la terminal {dataSelected?.name} del usuario: <i>{dataSelected?.email}</i>?</b> Al dar click en aceptar, esta de acuerdo que no podrá recuperar la información.</>}
      />
    </>
  )
}

export default TerminalsAssigned
