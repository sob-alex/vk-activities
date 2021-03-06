import store from '../store/index'

/**
 * Сhecks if there are true values
 * @param {object} targetObject - passed object
 * @returns {boolean} true is some filed has true value
 */
const isSomeValueTrueInObject = (targetObject) =>
  Object.values(targetObject).some((value) => value)


function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
/**
 * Returns new object with inverted field value
 * @param {object} object - input object
 * @param {string} field - field to invert
 * @returns {object} object with inverted value
 */
const makeFieldNegative = (object, field) => {
  if (!object[field]) return object
  return {
    ...object,
    [field]: -object[field],
  }
}
/**
 * Subtracts one array of objects from another array of objects by field
 * @param {array} from - minuend
 * @param {array} it - subtrahend
 * @param {string} byField - field by which to subtract
 * @returns {array} result
 */
 const substract = (from, it, byField) =>
  from.filter(
    (item) => !it.find((elem) => elem[byField] === item[byField])
  )

export const mixUpWithOrder = (arrA, arrB) => {
  const result = []
  for (
    let i = 0, j = 0;
    i < arrA.length || j < arrB.length;
    i++, j++
  ) {
    if (i < arrA.length) result.push(arrA[i])
    if (j < arrB.length) result.push(arrB[j])
  }
  return result
}

export const extractImageUrlFromSizes = (sizes) =>
  sizes.find((photo) => photo.type === 'x')

export const extractImagesFromAttachs = (attachments) =>
  attachments
    .filter(({ type }) => type === 'photo')
    .map((attach) => ({
      imgUrl: extractImageUrlFromSizes(attach.photo.sizes).url,
    }))

export const extractVideoInfoFromAttachs = (attachments) =>
  attachments
    .filter(({ type }) => type === 'video')
    .map(({ video }) => ({
      imgUrl: video.image[2].url,
      title: video.title,
    }))

export const formatDate = (vkDate) => {
  const date = new Date(vkDate * 1000)
  const formatNumber = (value) => (value < 10 ? `0${value}` : value)
  return `${formatNumber(date.getHours())}:${formatNumber(
    date.getMinutes()
  )} ${formatNumber(date.getDate())}.${formatNumber(
    date.getMonth() + 1
  )}.${date.getFullYear()}`
}

export const getToken = (hash = '') => hash.slice(14, 99)

export const transformUserIdentifier = (value) => {
  if (/^\d+$/.test(value)) {
    return value
  }
  if (/^id\d+$/.test(value)) {
    return value.slice(2)
  }
  if (/https:\/\/vk.com\//.test(value)) {
    const identifier = value.slice(15)
    const sliced = identifier.slice(2)
    if (!isNaN(Number(sliced))) {
      return sliced
    }
    return identifier
  }
  return ''
}

export const fetchAction = async ({ apiMethod, params = {} }) => {
  let data = {}
  try {
    const { response, error } = await apiMethod(params)
    if (error) {
      store.dispatch('setError', error.error_msg, { root: true })
      console.error(error)
      data = error
      return data
    }
    console.log('RESPONSE:', response)
    data = response
  } catch (e) {
    console.error(e)
  } finally {
    return data
  }
}

export { isSomeValueTrueInObject, sleep, makeFieldNegative, substract }
