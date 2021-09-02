import http from '../plugins/axios'

const getPosts = ({ owner_id }) =>
  http.jsonp('wall.get', {
    params: {
      owner_id,
    },
  })

export default {
  getPosts,
}
