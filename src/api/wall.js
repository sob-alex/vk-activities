import http from '../plugins/axios'

const getPosts = (params) =>
  http.jsonp('wall.get', {
    params: {
      ...params,
      extended: 1,
      fields: 'first_name,name',
    },
  })

const getComments = (params) =>
  http.jsonp('wall.getComments', {
    params: {
      ...params,
      need_likes: 1,
    },
  })

export default {
  getPosts,
  getComments
}
