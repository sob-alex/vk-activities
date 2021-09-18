import axios from 'axios-jsonp-pro'
const TOKEN =
  '3f87f424cd56930f9b74764cfe4d085dd7853ae7e16678fc70d7f09b970ed9a870a2434270d50494587bd'
const BASE_URL = 'https://api.vk.com/method/'
const http = axios.create({
  baseURL: BASE_URL,
  params: {
    access_token: TOKEN,
    v: '5.131',
  },
})

export default http
