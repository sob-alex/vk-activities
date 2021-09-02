import http from '../plugins/axios'

const getUserGroups = ({ user_id }) =>
  http.jsonp('groups.get', {
    params: {
      user_id,
    },
  })

export default {
  getUserGroups,
}
