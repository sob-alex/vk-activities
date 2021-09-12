import http from '../plugins/axios'


const getUsersInfo = ({ user_ids }) =>
  http.jsonp('users.get', {
    params: {
      user_ids,
    },
  })

export default {
    getUsersInfo
}
