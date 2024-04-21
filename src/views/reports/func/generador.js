import { BASE_URL_API } from '../../../config'
import { apiCall } from '../../../contexts/api'

import { getDataForDisponibility, parseMultiplesResponse, parseResponse } from './consults'

async function consumeReport (terminales, format, start, end/* , unity */) {
  try {
    // console.log(client, terminal, format, unity, start, end)
    if (terminales.length === 1 || terminales?.service) {
      // const fixValue = unity.value ?? 1
      const terminal = Array.isArray(terminales) ? terminales[0] : terminales
      const { data: res } = await apiCall({ url: `${BASE_URL_API}/consumeDataTerminal?terminal=${terminal.service}&fecha1=${start}&fecha2=${end}` })
      const labels = []
      const data = []
      let min = 9999999999
      let max = 0
      let total = 0
      res.sort((a, b) => new Date(a.time) - new Date(b.time))
      for (let i = 0; i < res.length; i++) {
        const item = res[i]
        labels.push(item.time)
        const valor = Number(item.value /* / fixValue */)
        total += valor
        if (valor > max) max = valor
        if (valor < min) min = valor
        data.push(valor)
      }
      const media = (total / res.length).toFixed(2)

      if (data.length === 0) return false

      return { labels, data, extras: { media, min, max, total } }
    } else if (terminales.length > 1) {
      const info = { labels: [] }
      let moreLength = 0
      // const fixValue = unity.value ?? 1

      let emptyRes = 0
      for (let i = 0; i < terminales.length; i++) {
        const terminal = terminales[i]
        const { data: res } = await apiCall({ url: `${BASE_URL_API}/consumeDataTerminal?terminal=${terminal.service}&fecha1=${start}&fecha2=${end}` })
        const isEmpty = res.length === 0 ? 1 : 0
        if (emptyRes === 0 && isEmpty === 0) emptyRes = 1
        else emptyRes ^= isEmpty
        if (isEmpty) continue
        const labels = []
        const data = []
        res.sort((a, b) => new Date(a.time) - new Date(b.time))
        data.push(terminal.kit)
        for (let i = 0; i < res.length; i++) {
          const item = res[i]
          labels.push(item?.time)
          const valor = Number(item?.value/*  / fixValue */)
          data.push(valor)
        }
        info[terminal.kit] = data
        if (data.length > moreLength) moreLength = data.length
        if (labels.length > info.labels.length) info.labels = labels
      }

      if (!emptyRes) return !!emptyRes

      for (const key in info) {
        if (Object.hasOwnProperty.call(info, key)) {
          if (key === 'labels') continue
          const element = info[key]
          while (element.length < moreLength) {
            element.push('---')
          }
        }
      }

      return info
    }
  } catch (error) {
    console.log(error)
    return false
  }
}

async function disponibilityReport (terminales, format, start, end/* , unity */) {
  try {
    const dataFiltered = { }

    if (Array.isArray(terminales) && terminales.length > 0) {
      const results = await Promise.all(terminales.map(async (terminal) => {
        const { service, kit } = terminal
        const response = await getDataForDisponibility(service, start, end)
        return { terminal: kit, data: response }
      }))

      if (results.length === 1) {
        const data = results[0].data
        if (data.length === 0) return false
        dataFiltered.uplinkThroughput = await parseResponse(data, 'uplinkThroughput')
        dataFiltered.downlinkThroughput = await parseResponse(data, 'downlinkThroughput')
        dataFiltered.signalQuality = await parseResponse(data, 'signalQuality', true, (valor) => (valor * 100))
        dataFiltered.pingDropRateAvg = await parseResponse(data, 'pingDropRateAvg', true, (valor) => (valor * 100))
        dataFiltered.obstructionPercentTime = await parseResponse(data, 'obstructionPercentTime', true, (valor) => (valor / 100))
        dataFiltered.pingLatencyMsAvg = await parseResponse(data, 'pingLatencyMsAvg', true, (valor) => (valor * 1000))
      } else if (results.length > 1) {
        dataFiltered.tableData = []
        let emptyRes = 0
        for (let i = 0; i < results.length; i++) {
          const { terminal, data } = results[i]
          const isEmpty = data.length === 0 ? 1 : 0
          if (emptyRes === 0 && isEmpty === 0) emptyRes = 1
          else emptyRes ^= isEmpty
          if (isEmpty) continue
          const terminalRow = await parseMultiplesResponse(data)
          terminalRow.unshift(terminal)
          dataFiltered.tableData.push(terminalRow)
        }

        if (!emptyRes) return !!emptyRes
        // dataFiltered.tableData.push(['TOTAL'])
      }
    }

    return dataFiltered
  } catch (error) {
    console.log(error)
    return false
  }
}

async function fullReports (terminales, format, start, end/* , unity */) {
  try {
    const disponibility = await disponibilityReport(terminales, format, start, end/* , unity */)
    const consume = await consumeReport(terminales, format, start, end/* , unity */)
    if (!disponibility && !consume) return false
    return { disponibility, consume }
  } catch (error) {
    console.log(error)
    return false
  }
}

export { consumeReport, disponibilityReport, fullReports }

