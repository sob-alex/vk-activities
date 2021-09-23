import axios from 'axios-jsonp-pro'
let TOKEN = localStorage.getItem('api-key')
const BASE_URL = 'https://api.vk.com/method/'
const http = axios.create({
  baseURL: BASE_URL,
  params: {
    access_token: TOKEN,
    v: '5.131',
  },
})

export default http

export const refreshToken = () => {
  http.defaults.params.access_token = localStorage.getItem('api-key');
}
