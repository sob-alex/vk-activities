import http from '../plugins/axios'

const getPosts = ({ owner_id }) =>
  http.jsonp('wall.get', {
    params: {
      owner_id,
      extended: 1,
      fields: 'first_name,name'
    },
  })

export default {
  getPosts,
}
