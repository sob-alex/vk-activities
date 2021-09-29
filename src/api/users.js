import http from '../plugins/axios'

const getUsersInfo = ({ user_ids }) =>
  http.jsonp('users.get', {
    params: {
      user_ids,
    },
  })

const getSubscriptions = ({ user_id }) =>
  http.jsonp('users.getSubscriptions', {
    params: {
      user_id,
      extended: 1,
      count: 200,
    },
  })

const resolveName = ({ screen_name }) =>
  http.jsonp('utils.resolveScreenName', {
    params: {
      screen_name,
    },
  })

export default {
  getUsersInfo,
  getSubscriptions,
  resolveName
}
