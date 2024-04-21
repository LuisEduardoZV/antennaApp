/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
import * as ExcelJS from 'exceljs'

async function csvConsume (info, start, finish, terminals /* , unity */) {
  const { data, labels, extras } = info
  // const { label } = unity

  if (Array.isArray(labels) && labels.length === 0) return false

  const book = new ExcelJS.Workbook()
  if (data && extras) {
    const sheet = book.addWorksheet('Reporte de Consumo')

    const col = await labels.map((op, index) => ({
      header: op,
      key: index?.toString(),
      width: 12
    }))
    sheet.columns = col

    sheet.addRow(await data.map((op) => (`${op} MB`)))
    sheet.addRow(['Promedio', 'Consumo Máximo', 'Consumo Mínimo'])
    sheet.addRow([`${extras.media} MB`, `${extras.media} MB`, `${extras.media} MB`])

    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '9BBB59' }
    }

    sheet.getRow(1).font = {
      name: 'Calibri',
      bold: true
    }

    sheet.getRow(3).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D2E1B5' }
    }

    sheet.getRow(3).font = {
      name: 'Calibri',
      bold: true,
      italic: true
    }
  } else {
    const sheet = book.addWorksheet('Reporte de Consumo')

    const col = await labels.map((op, index) => ({
      header: op,
      key: index?.toString(),
      width: 11
    }))
    sheet.columns = await [{
      header: 'Kit De La Terminal',
      key: 'kit',
      width: 17
    }].concat(col)

    for (const key in info) {
      if (key !== 'labels' && Object.hasOwnProperty.call(info, key)) {
        sheet.addRow(await info[key].map((op) => (op === '---' ? op : `${op} MB`)))
      }
    }

    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '9BBB59' }
    }

    sheet.getRow(1).font = {
      name: 'Calibri',
      bold: true
    }
  }

  book.xlsx.writeBuffer().then(function (data) {
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    const url = window.URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = info.data ? `ReporteDeConsumo_${terminals[0]?.kit}.xlsx` : `ReporteDeConsumo_Multiple_${start}-al-${finish}.xlsx`
    anchor.click()
    window.URL.revokeObjectURL(url)
  })

  return true
}

async function csvDisponibility (info, start, finish, terminals /* , unity */) {
  const { tableData } = info

  const book = new ExcelJS.Workbook()
  if (!tableData) {
    for (const key in info) {
      if (Object.hasOwnProperty.call(info, key)) {
        const { labels, extras, data } = info[key]
        const sheet = book.addWorksheet(key)

        const col = await labels.map((op, index) => ({
          header: op,
          key: index?.toString(),
          width: 23
        }))
        sheet.columns = col

        sheet.addRow(await data.map((op) => (`${op} MB`)))
        sheet.addRow(['Promedio', 'Consumo Máximo', 'Consumo Mínimo'])
        sheet.addRow([`${extras.media} MB`, `${extras.media} MB`, `${extras.media} MB`])

        sheet.getRow(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '9BBB59' }
        }

        sheet.getRow(1).font = {
          name: 'Calibri',
          bold: true
        }

        sheet.getRow(3).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2E1B5' }
        }

        sheet.getRow(3).font = {
          name: 'Calibri',
          bold: true,
          italic: true
        }
      }
    }
  } else {
    const sheet = book.addWorksheet('Reporte de Disponibilidad')

    const col = await ['ID', 'Rendimiento UL', 'Rendimiento DL', 'Obstrucción',
      'Calidad de Señal', 'Latencia', 'Ping'].map((op, index) => ({
      header: op,
      key: index?.toString(),
      width: 23
    }))
    sheet.columns = col

    sheet.addRows(tableData)

    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '9BBB59' }
    }

    sheet.getRow(1).font = {
      name: 'Calibri',
      bold: true
    }
  }


  book.xlsx.writeBuffer().then(function (data) {
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    const url = window.URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = info.data ? `ReporteDeDisponibilidad_${terminals[0]?.kit}.xlsx` : `ReporteDeDisponibilidad_Multiple_${start}-al-${finish}.xlsx`
    anchor.click()
    window.URL.revokeObjectURL(url)
  })

  return true
}

async function csvFull (info, start, finish, cliente /* , unity */) {
  console.log(info)
  const { consume, disponibility } = info
  // const { label } = unity
  const { tableData } = disponibility

  const book = new ExcelJS.Workbook()
  if (tableData) {
    const sheet = book.addWorksheet('Disponibilidad')

    const col = await ['ID', 'Rendimiento UL', 'Rendimiento DL', 'Obstrucción',
      'Calidad de Señal', 'Latencia', 'Ping'].map((op, index) => ({
      header: op,
      key: index?.toString(),
      width: 23
    }))
    sheet.columns = col

    sheet.addRows(tableData)

    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '9BBB59' }
    }

    sheet.getRow(1).font = {
      name: 'Calibri',
      bold: true
    }
  }

  if (consume) {
    const sheet = book.addWorksheet('Consumo')
    const { labels } = consume

    const col = await labels.map((op, index) => ({
      header: op,
      key: index?.toString(),
      width: 11
    }))
    sheet.columns = await [{
      header: 'Kit De La Terminal',
      key: 'kit',
      width: 17
    }].concat(col)

    for (const key in consume) {
      if (key !== 'labels' && Object.hasOwnProperty.call(consume, key)) {
        sheet.addRow(await consume[key].map((op) => (op === '---' ? op : `${op} MB`)))
      }
    }

    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '9BBB59' }
    }

    sheet.getRow(1).font = {
      name: 'Calibri',
      bold: true
    }
  }

  book.xlsx.writeBuffer().then(function (data) {
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    const url = window.URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `ReporteCompleto_${cliente.name}_${start}-al-${finish}.xlsx`
    anchor.click()
    window.URL.revokeObjectURL(url)
  })

  return true
}

export { csvConsume, csvDisponibility, csvFull }

