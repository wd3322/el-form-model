const getPrototype = function(value) {
  return Object.prototype.toString.call(value).replace(/^\[object (\S+)\]$/, '$1').toLowerCase()
}

const resetPropertys = function({ obj, type, keys }) {
  const result = {}
  for (const key in obj) {
    if (
      (type === 'include' && keys.includes(key)) ||
      (type === 'exclude' && !keys.includes(key))
    ) {
      result[key] = obj[key]
    }
  }
  return result
}

export default {
  getPrototype,
  resetPropertys
}
