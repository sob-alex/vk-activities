import http from '../plugins/axios'

const getAllPhotos = (params) =>
  http.jsonp('photos.getAll', {
    params: {
      ...params,
      extended: 1,
    },
  })

const getAllComments = (params) =>
  http.jsonp('photos.getAllComments', {
    params: {
      ...params,
      need_likes: 1,
    },
  })

export default {
  getAllPhotos,
  getAllComments,
}
