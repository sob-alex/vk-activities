import axios from 'axios-jsonp-pro';
const TOKEN =
  '76ce06543a91ac5f4160d6d623d3c9a943b878d98051755d9393cba806ddf504c4c62152ee692ae40ff8d';
const BASE_URL = 'https://api.vk.com/method/';
const http = axios.create({
  baseURL: BASE_URL,
  params: {
    access_token: TOKEN,
    v: '5.52',
  },
});

export default http;
