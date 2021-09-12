import http from '../plugins/axios'

const getIsLiked = ({ user_id, type, item_id, owner_id }) =>
  http.jsonp('likes.isLiked', {
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
