import axios from 'axios-jsonp-pro'
const TOKEN =
  '6e95c79b77aaaeeb75943052dfff211b2c0c4a4e55d81f318cb84590499c5b92b4cccb59fbc8018b4a546'
const BASE_URL = 'https://api.vk.com/method/'
const http = axios.create({
  baseURL: BASE_URL,
  params: {
    access_token: TOKEN,
    v: '5.131',
  },
})

export default http
