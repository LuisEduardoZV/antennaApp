import PropTypes from 'prop-types'
import { Fragment, useEffect, useState } from 'react'

// mui imports
import {
  Box,
  Button,
  CardHeader,
  Checkbox,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material'

import PerfectScrollBar from 'react-perfect-scrollbar'

function not (a, b) {
  return a.filter(({ id }) => b.findIndex((op) => (op?.id === id)) === -1)
}

function intersection (a, b) {
  return a.filter(({ id }) => b.findIndex((op) => (op.id === id)) !== -1)
}

function union (a, b) {
  return [...a, ...not(b, a)]
}

export default function TransferList ({ terminals, termSelected, setNewTerms, disabled, preSelected }) {
  const [checked, setChecked] = useState([])
  const [left, setLeft] = useState(not(terminals, termSelected))
  const [right, setRight] = useState(termSelected)

  const leftChecked = intersection(checked, left)
  const rightChecked = intersection(checked, right)

  const handleToggle = (terminal) => () => {
    const currentIndex = checked.findIndex((op) => (op.id === terminal.id))
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push({ ...terminal })
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  const numberOfChecked = (items) => intersection(checked, items).length

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items))
    } else {
      setChecked(union(checked, items))
    }
  }

  const handleCheckedRight = () => {
    const newTerms = right.concat(leftChecked)
    setRight(newTerms)
    setNewTerms(newTerms)
    setLeft(not(left, leftChecked))
    setChecked(not(checked, leftChecked))
  }

  const handleCheckedLeft = () => {
    const newTerms = not(right, rightChecked)
    setLeft(left.concat(rightChecked))
    setRight(newTerms)
    setNewTerms(newTerms)
    setChecked(not(checked, rightChecked))
  }

  const customList = (title, items, preItems) => (
    <Box width='100%' position='relative'>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={
              numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
            }
            color='secondary'
            disabled={items.length === 0 || disabled}
            inputProps={{
              'aria-label': 'all items selected'
            }}
          />
        }
        title={title}
      />
      <Divider sx={{ borderColor: 'grey.500' }} />
      <PerfectScrollBar style={{ maxHeight: '35vh', height: '100%', overflowX: 'hidden' }}>
        <List
          sx={{
            width: '36vw',
            height: 'max-content',
            bgcolor: 'transparent'
          }}
          dense
          component='div'
          role='list'
        >
          {items.map((op) => {
            const { id, service, kit } = op
            const labelId = `transfer-list-all-item-${id}-label`

            return (
              <Fragment key={id}>
                <ListItem
                  role='listitem'
                  color='secondary'
                  onClick={handleToggle(op)}
                  sx={{
                    mb: 1.5
                  }}
                >
                  <ListItemIcon>
                    <Checkbox
                      checked={checked.findIndex((op) => (op.id === id)) !== -1}
                      tabIndex={-1}
                      disableRipple
                      disabled={disabled}
                      color='secondary'
                      inputProps={{
                        'aria-labelledby': labelId
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} secondary={<Typography variant='body1'>{kit}</Typography>} primary={<Typography variant='subtitle2'>{service}</Typography>} sx={{ color: (theme) => theme.palette.mode === 'light' ? 'grey.800' : 'white' }} />
                </ListItem>
              </Fragment>
            )
          })}
        </List>
      </PerfectScrollBar>
    </Box>
  )

  useEffect(() => {
    setLeft(not(terminals, termSelected))
    setRight(termSelected)
  }, [terminals, termSelected])

  return (
    <Grid container spacing={2} alignItems='start'>
      <Grid item>{customList('Terminales seleccionadas', left)}</Grid>
      <Grid item alignSelf='center'>
        <Grid container direction='column' alignItems='center'>
          <Button
            sx={{ my: 0.5 }}
            variant='outlined'
            size='small'
            color='secondary'
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0 || disabled}
            aria-label='move selected right'
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant='outlined'
            size='small'
            color='secondary'
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0 || disabled}
            aria-label='move selected left'
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList('Terminales asignadas', right)}</Grid>
    </Grid>
  )
}

TransferList.propTypes = {
  terminals: PropTypes.array,
  termSelected: PropTypes.array,
  preSelected: PropTypes.array,
  setNewTerms: PropTypes.func,
  disabled: PropTypes.bool
}
