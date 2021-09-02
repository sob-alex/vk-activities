import http from '../plugins/axios'

const getIsLiked = ({ user_id, type, item_id, owner_id }) =>
  http.jsonp('wall.get', {
    params: {
      user_id,
      type,
      item_id,
      owner_id,
    },
  })

export default {
  getIsLiked,
}
