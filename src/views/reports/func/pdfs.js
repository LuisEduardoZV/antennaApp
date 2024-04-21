/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

// assets
import proyectoLogo from '../../../assets/image/logo.png'

function header (pdf, data) {
  // Header
  const pageSize = pdf.internal.pageSize
  pdf.setFontSize(17)
  if (proyectoLogo) pdf.addImage(proyectoLogo, 'PNG', data.settings.margin.left, 5, 20, 15)
  pdf.text('Antenna App', pageSize.getWidth() - 45, 15)
}

function footer (pdf, data, totalPagesExp) {
  // Footer
  let str = 'Página ' + pdf.internal.getNumberOfPages()
  // Total page number plugin only available in jspdf v1.0+
  if (typeof pdf.putTotalPages === 'function') {
    str = str + '/' + totalPagesExp
  }
  pdf.setFontSize(8)

  // jsPDF 1.4+ uses getHeight, <1.4 uses .height
  const pageSize = pdf.internal.pageSize
  const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()

  pdf.setTextColor('red')
  pdf.setFont('helvetica', 'bold')
  pdf.text('Empresa Fantasma, S.A. de C.V.', data.settings.margin.left, pageHeight - 20)
  pdf.setTextColor('#757575')
  pdf.setFont('helvetica', 'normal')
  pdf.text('Teotihuacan No. 234, Col. Refoma Sur Poniente,', data.settings.margin.left, pageHeight - 16)
  pdf.text('C.P. 12120, México, CDMX., Telfs.: (55) 1234-5678, Fax: (55) 1234-9875, 800 072 5972', data.settings.margin.left, pageHeight - 13)

  pdf.setFontSize(10)
  pdf.setTextColor('black')
  pdf.text(str, 180, pageHeight - 10)
}

async function pdfConsumeOne (terminal, start, finish, info/* , unity */) {
  // const { label } = unity
  const input = window.document.getElementsByClassName('div2PDF')[0]
  input.style.backgroundColor = 'transparent'

  html2canvas(input).then(canvas => {
    const img = canvas.toDataURL('image/png')
    const pdf = new jsPDF()
    pdf.setFontSize(15)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Reporte de Consumo', 82, 30)
    pdf.setFontSize(11)
    pdf.text(`${start} - ${finish}`, 86, 35)
    pdf.setFontSize(12)
    pdf.text('NÚMERO DE KIT', 15, 51)
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`${terminal[0]?.kit}`, 25, 57)
    pdf.addImage(
      img,
      'PNG',
      15,
      65,
      190,
      100
    )

    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('DATOS GENERALES', 15, 175)

    const totalPagesExp = '{total_pages_count_string}'

    pdf.autoTable({
      startY: 185,
      theme: 'grid',
      head: [['ID', 'PERIODO', 'MÍNIMO', 'MÁXIMO', 'CONSUMO TOTAL']],
      body: [
        [terminal[0]?.kit, `${start} - ${finish}`, `${info.extras.min} MB`, `${info.extras.max} MB`, `${info.extras.total} MB`]
      ],
      willDrawPage: function (data) { header(pdf, data) },
      didDrawPage: function (data) { footer(pdf, data, totalPagesExp) }
    })

    if (typeof pdf.putTotalPages === 'function') {
      pdf.putTotalPages(totalPagesExp)
    }

    pdf.save(`ReporteDeConsumo_${terminal[0]?.kit}.pdf`)
    return false
  })
}

async function pdfConsumeMultiple (start, finish, info, diff) {
  const mode = { orientation: diff > 7 ? 'landscape' : 'portrait' }
  const pdf = new jsPDF(mode)
  pdf.setFontSize(15)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Reporte de Consumo', (Math.floor(pdf.internal.pageSize.getWidth() / 2) - (Math.floor('Reporte de Consumo'.length / 2) * 3)), 30)
  pdf.setFontSize(11)
  pdf.text(`${start} - ${finish}`, (Math.floor(pdf.internal.pageSize.getWidth() / 2) - (Math.floor('Reporte de Consumo'.length / 2) * 2.5)), 35)
  pdf.setFontSize(12)

  const totalPagesExp = '{total_pages_count_string}'

  const data = { ...info }
  const rows = []
  delete data.labels
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      rows.push([...data[key]])
    }
  }

  pdf.autoTable({
    html: '#tableConsumeMultiple',
    includeHiddenHtml: true,
    startY: 50,
    startX: 5,
    margin: { top: 40 },
    tableWidth: 'wrap',
    theme: 'grid',
    rowPageBreak: 'avoid',
    horizontalPageBreak: true,
    horizontalPageBreakRepeat: 0,
    horizontalPageBreakBehaviour: 'immediately',
    headStyles: {
      halign: 'center', // Alineación horizontal
      valign: 'middle', // Alineación vertical
      text: 'vertical'
    },
    willDrawPage: function (data) { header(pdf, data) },
    didDrawPage: function (data) { footer(pdf, data, totalPagesExp) }
  })

  if (typeof pdf.putTotalPages === 'function') {
    pdf.putTotalPages(totalPagesExp)
  }

  pdf.save(`ReporteDeConsumo_Multiple_${start}-al-${finish}.pdf`)
  return false
}

async function pdfAvailableOne (terminal, start, finish) {
  const input = window.document.getElementsByClassName('div2PDF')

  const totalPagesExp = '{total_pages_count_string}'

  let pdf = new jsPDF()
  pdf = header(pdf)
  pdf = footer(pdf)
  pdf.setFontSize(15)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Reporte de Disponibilidad', 77, 30)
  pdf.setFontSize(11)
  pdf.text(`${start} - ${finish}`, 88, 35)
  pdf.setFontSize(12)
  pdf.text('NÚMERO DE KIT', 15, 51)
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`${terminal[0]?.kit}`, 25, 57)

  input[0].style.backgroundColor = 'transparent'
  await html2canvas(input[0]).then(canvas => {
    canvas.getContext('2d', { willReadFrequently: true })
    const img = canvas.toDataURL('image/png')
    pdf.addImage(
      img,
      'PNG',
      10,
      65,
      190,
      100
    )
  })

  input[1].style.backgroundColor = 'transparent'
  await html2canvas(input[1]).then(canvas => {
    canvas.getContext('2d', { willReadFrequently: true })
    const img = canvas.toDataURL('image/png')
    pdf.addImage(
      img,
      'PNG',
      10,
      170,
      190,
      100
    )
  })

  pdf.addPage()
  pdf = header(pdf)
  pdf = footer(pdf)

  input[2].style.backgroundColor = 'transparent'
  await html2canvas(input[2]).then(canvas => {
    canvas.getContext('2d', { willReadFrequently: true })
    const img = canvas.toDataURL('image/png')
    pdf.addImage(
      img,
      'PNG',
      10,
      35,
      190,
      100
    )
  })

  input[3].style.backgroundColor = 'transparent'
  await html2canvas(input[3]).then(canvas => {
    canvas.getContext('2d', { willReadFrequently: true })
    const img = canvas.toDataURL('image/png')
    pdf.addImage(
      img,
      'PNG',
      10,
      145,
      190,
      100
    )
  })

  pdf.addPage()
  pdf = header(pdf)
  pdf = footer(pdf)

  input[4].style.backgroundColor = 'transparent'
  await html2canvas(input[4]).then(canvas => {
    canvas.getContext('2d', { willReadFrequently: true })
    const img = canvas.toDataURL('image/png')
    pdf.addImage(
      img,
      'PNG',
      10,
      35,
      190,
      100
    )
  })

  input[4].style.backgroundColor = 'transparent'
  await html2canvas(input[5]).then(canvas => {
    canvas.getContext('2d', { willReadFrequently: true })
    const img = canvas.toDataURL('image/png')
    pdf.addImage(
      img,
      'PNG',
      10,
      145,
      190,
      100
    )
  })

  if (typeof pdf.putTotalPages === 'function') {
    pdf.putTotalPages(totalPagesExp)
  }

  pdf.save(`ReporteDeDisponibilidad_${terminal[0]?.kit}.pdf`)
  return false
}

async function pdfAvailableMultiple (start, finish, info) {
  const pdf = new jsPDF('')
  pdf.setFontSize(15)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Reporte de Disponibilidad', (Math.floor(pdf.internal.pageSize.getWidth() / 2) - (Math.floor('Reporte de Disponibilidad'.length / 2) * 2.7)), 30)
  pdf.setFontSize(11)
  pdf.text(`${start} - ${finish}`, (Math.floor(pdf.internal.pageSize.getWidth() / 2) - (Math.floor('Reporte de Disponibilidad'.length / 2) * 1.5)), 35)
  pdf.setFontSize(12)

  const totalPagesExp = '{total_pages_count_string}'

  const data = { ...info }
  const rows = []
  delete data.labels
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      rows.push([...data[key]])
    }
  }

  pdf.autoTable({
    html: '#tableAvailableMultiple',
    includeHiddenHtml: true,
    startY: 50,
    startX: 5,
    margin: { top: 40 },
    tableWidth: 'wrap',
    theme: 'grid',
    rowPageBreak: 'avoid',
    horizontalPageBreak: true,
    horizontalPageBreakRepeat: 0,
    horizontalPageBreakBehaviour: 'immediately',
    headStyles: {
      halign: 'center',
      valign: 'middle'
    },
    bodyStyles: {
      halign: 'center',
      valign: 'middle'
    },
    willDrawPage: function (data) { header(pdf, data) },
    didDrawPage: function (data) { footer(pdf, data, totalPagesExp) }
  })

  if (typeof pdf.putTotalPages === 'function') {
    pdf.putTotalPages(totalPagesExp)
  }

  pdf.save(`ReporteDeDisponibilidad_Multiple_${start}-al-${finish}.pdf`)
  return false
}

async function pdfFull (start, finish, info, cliente) {
  const { consume, disponibility } = info

  const pdf = new jsPDF('')
  pdf.setFontSize(15)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Reporte Completo', (Math.floor(pdf.internal.pageSize.getWidth() / 2) - (Math.floor('Reporte Completo'.length / 2) * 2.7)), 30)
  pdf.setFontSize(11)
  pdf.text(`${start} - ${finish}`, (Math.floor(pdf.internal.pageSize.getWidth() / 2) - (Math.floor('Reporte Completo'.length / 2) * 1.5)), 35)
  pdf.setFontSize(12)

  const totalPagesExp = '{total_pages_count_string}'

  pdf.autoTable({
    html: '#tableAvailableMultiple',
    includeHiddenHtml: true,
    startY: 50,
    startX: 5,
    margin: { top: 40 },
    tableWidth: 'wrap',
    theme: 'grid',
    rowPageBreak: 'avoid',
    horizontalPageBreak: true,
    horizontalPageBreakRepeat: 0,
    horizontalPageBreakBehaviour: 'immediately',
    headStyles: {
      halign: 'center',
      valign: 'middle'
    },
    bodyStyles: {
      halign: 'center',
      valign: 'middle'
    },
    willDrawPage: function (data) { header(pdf, data) },
    didDrawPage: function (data) { footer(pdf, data, totalPagesExp) }
  })

  const finalY = pdf.lastAutoTable.finalY

  pdf.autoTable({
    html: '#tableConsumeMultiple',
    includeHiddenHtml: true,
    startY: finalY + 20,
    startX: 5,
    margin: { top: 40 },
    tableWidth: 'wrap',
    theme: 'grid',
    rowPageBreak: 'avoid',
    horizontalPageBreak: true,
    horizontalPageBreakRepeat: 0,
    horizontalPageBreakBehaviour: 'immediately',
    headStyles: {
      halign: 'center', // Alineación horizontal
      valign: 'middle', // Alineación vertical
      text: 'vertical'
    },
    willDrawPage: function (data) { header(pdf, data) },
    didDrawPage: function (data) { footer(pdf, data, totalPagesExp) }
  })

  if (typeof pdf.putTotalPages === 'function') {
    pdf.putTotalPages(totalPagesExp)
  }

  pdf.save(`ReporteCompleto_${cliente.name}_${start}-al-${finish}.pdf`)
  return false
}

export { pdfAvailableMultiple, pdfAvailableOne, pdfConsumeMultiple, pdfConsumeOne, pdfFull }

