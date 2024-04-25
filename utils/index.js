const addZero = (num) => num.toString().padStart(2, '0')

const getNewDate = () => {
  const date = new Date()
  const YYYY = date.getFullYear()
  const MM = date.getMonth() + 1
  const DD = date.getDate()
  const hh = date.getHours()
  const mm = date.getMinutes()
  const ss = date.getSeconds()
  return `${YYYY}-${addZero(MM)}-${addZero(DD)} ${addZero(hh)}:${addZero(
    mm
  )}:${addZero(ss)}`
}

const getLocalIP = () => {
  const os = require('os')
  const ifaces = os.networkInterfaces()
  let locatIp = ''
  for (let dev in ifaces) {
    if (
      dev.includes('Embedded') ||
      dev.includes('本地连接') ||
      dev.includes('以太网') ||
      dev.includes('WLAN')
    ) {
      for (let j = 0; j < ifaces[dev].length; j++) {
        if (ifaces[dev][j].family === 'IPv4') {
          locatIp = ifaces[dev][j].address
          console.log('locatIp:', locatIp)
          return locatIp
        }
      }
    }
  }
  return locatIp
}

module.exports = {
  addZero,
  getNewDate,
  getLocalIP,
}
