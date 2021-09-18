import http from '../plugins/axios'

const getUserGroups = ({ user_id }) =>
  http.jsonp('groups.get', {
    params: {
      user_id,
      extended: 1,
      fields: 'name',
      count: 1000
    },
  })
const getGroupsInfo = ({ group_ids }) =>
  http.jsonp('groups.getById', {
    params: {
      group_ids,
    },
  })

export default {
  getUserGroups,
  getGroupsInfo,
}
