export const isSomeValueTrueInObject = (targetObject) =>
  Object.values(targetObject).some((value) => value)

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const fetchAction = async (
  commit,
  { apiMethod, params = {}, needCommit = false, commitType = '' }
) => {
  let data = []
  try {
    const { response, error } = await apiMethod(params)
    if (error) {
      commit('setError', error.error_msg)
      console.error(error)
      return data
    }
    if (needCommit) {
      commit(commitType, response)
    }
    console.log(response)
    data = response
  } catch (e) {
    console.error(e)
  } finally {
    return data
  }
}
