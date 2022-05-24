import router from './../router/router'

export const useDateFormat = (date) => {
  const timeDiff = {
    day: 86400000,
    hour: 3600000,
    minute: 60000
  }
  const now = new Date()
  const time = new Date(date)
  const diff = now.getTime() - time.getTime()
  if (diff >= timeDiff.day) {
    const yyyy = time.getFullYear()
    const mm = String(time.getMonth() + 1).padStart(2, '0')
    const dd = String(time.getDate()).padStart(2, '0')
    return `${yyyy}/${mm}/${dd}`
  }
  else if (diff < timeDiff.day && diff >= timeDiff.hour) {
    const hours = parseInt(diff / timeDiff.hour)
    return `${hours} 小時前`
  }
  else if (diff < timeDiff.hour && diff >= timeDiff.minute) {
    const mins = parseInt(diff / timeDiff.minute)
    return `${mins} 分鐘前`
  }
  else {
    const secs = parseInt(diff / 1000)
    return `${secs} 秒前`
  }
}

export const appendQuery = async (route, newQuery) => {
  // create query
  const key = Object.keys(newQuery)[0]
  const value = newQuery[key]
  const query = Object.assign({}, route.query, newQuery)
  if (!value) delete query[key]
  // push query
  await router.push({ query })
}