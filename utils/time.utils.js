export function secondToTime (second) {
  if (isNaN(second)) {
    return '00:00'
  }

  const add0 = (num) => {
    return num < 10 ? '0' + num : '' + num
  }

  const min = parseInt(second / 60)
  const sec = parseInt(second - min * 60)
  const hours = parseInt(min / 60)
  const minAdjust = parseInt((second / 60) - (60 * parseInt((second / 60) / 60)))
  return second >= 3600 ? add0(hours) + ':' + add0(minAdjust) + ':' + add0(sec) : add0(min) + ':' + add0(sec)
}
