import { BASE_URL_API } from '../../../config'
import { apiCall } from '../../../contexts/api'

function checkExtraInfo (extra, newValue) {
  const newExtra = { ...extra }
  const value = Number(newValue)
  newExtra.media += value
  if (value > newExtra.max) newExtra.max = value
  if (value < newExtra.min) newExtra.min = value
  return newExtra
}

async function parseResponse (data, key, needAdjust, adjust) {
  const finalData = {
    labels: [],
    data: [],
    extras: {
      media: 0,
      min: 99999999999,
      max: -99999999999
    }
  }
  await data.forEach((op) => {
    const dataNumber = Number(op[key] ?? 0)
    const dataNumberAdjusted = needAdjust ? adjust(dataNumber) : dataNumber
    finalData.labels.push(op.time ?? op.binned_timestamp)
    finalData.data.push(Number(dataNumberAdjusted))
    finalData.extras = checkExtraInfo(finalData.extras, dataNumberAdjusted)
  })

  finalData.extras.max = Number((finalData.extras.max).toFixed(5))
  finalData.extras.min = Number((finalData.extras.min).toFixed(5))
  finalData.extras.media = Number((finalData.extras.media / data.length).toFixed(5))

  return finalData
}

async function parseMultiplesResponse (data) {
  const parcialInfo = {}

  await data.forEach(terminal => {
    delete terminal?.time
    for (const key in terminal) {
      if (Object.hasOwnProperty.call(terminal, key)) {
        const dataNumberAdjusted = Number(terminal[key] ?? 0)
        // const dataNumberAdjusted = needAdjust ? adjust(dataNumber) : dataNumber
        parcialInfo[key] = Number(parcialInfo[key] ?? 0) + dataNumberAdjusted
      }
    }
  })

  const tam = Object.keys(parcialInfo).length
  const finalData = Array(tam === 0 ? 6 : tam).fill('----')
  for (const key in parcialInfo) {
    if (Object.hasOwnProperty.call(parcialInfo, key)) {
      const valor = Number(parcialInfo[key] / tam)
      switch (key) {
        case 'uplinkThroughput':
          finalData[0] = valor
          break
        case 'downlinkThroughput':
          finalData[1] = valor
          break
        case 'obstructionPercentTime':
          finalData[2] = valor / 100
          break
        case 'signalQuality':
          finalData[3] = valor
          break
        case 'pingLatencyMsAvg':
          finalData[4] = valor
          break
        case 'pingDropRateAvg':
          finalData[5] = valor
          break
        default:
          finalData[0] = '----'
          break
      }
    }
  }

  return finalData
}

async function getDataForDisponibility (terminal, start, finish) {
  try {
    const { data } = await apiCall({ url: `${BASE_URL_API}/DisponibilityDataTerminal?terminal=${terminal}&fecha1=${encodeURIComponent(start)}&fecha2=${encodeURIComponent(finish)}` })
    await data.sort((a, b) => {
      return new Date(a?.time) - new Date(b?.time)
    })

    return data
  } catch (error) {
    console.log(error)
    return null
  }
}

export { getDataForDisponibility, parseMultiplesResponse, parseResponse }

