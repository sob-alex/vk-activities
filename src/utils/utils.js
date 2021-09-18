export const isSomeValueTrueInObject = (targetObject) =>
  Object.values(targetObject).some((value) => value)

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const makeFieldNegative = (object, field) => ({...object, [field]: -object[field] })

export const substract = (from, it, byField) =>  from.filter(item=> !it.find(elem => elem[byField] === item[byField]))

export const mixUpWithOrder = (arrA, arrB) => {
  const result = [];
  for (
    let i = 0, j = 0;
    i < arrA.length || j < arrB.length;
    i++, j++
  ) {
      if( i < arrA.length) result.push(arrA[i])
      if( j < arrB.length) result.push(arrB[j])
  }
  return result;
};

export const fetchAction = async (
  commit,
  { apiMethod, params = {}, needCommit = false, commitType = '' }
) => {
  let data = {}
  try {
    const { response, error } = await apiMethod(params)
    if (error) {
      commit('setError', error.error_msg)
      console.error(error)
      data = error;
      return data
    }
    if (needCommit) {
      commit(commitType, response)
    }
    console.log('RESPONSE:',response)
    data = response
  } catch (e) {
    console.error(e)
  } finally {
    return data
  }
}
