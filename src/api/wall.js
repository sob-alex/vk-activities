import http from '../plugins/axios'

const getPosts = (params) =>
  http.jsonp('wall.get', {
    params: {
      ...params,
      extended: 1,
      fields: 'first_name,name'
    },
  })

export default {
  getPosts,
}
