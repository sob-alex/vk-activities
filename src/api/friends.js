import http from '../plugins/axios'

const getUserFriends = ({ user_id }) =>
  http.jsonp('friends.get', {
    params: {
      user_id,
      fields: 'nickname'
    },
  })

const getUserFollowers = ({ user_id }) =>
  http.jsonp('users.getFollowers', {
    params: {
      user_id,
    },
  })

export default {
  getUserFriends,
  getUserFollowers,
}
