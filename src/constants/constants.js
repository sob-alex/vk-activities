export const USER_SERACH_PLACES = {
  FRIENDS: 'друзьях',
  SUBSCRIBERS: 'подписчиках',
  SPECIFIED_PROFILES: 'указанных профилях',
  FIENDS_FRIENDS: 'друзьях друзей',
}
export const GROUP_SERACH_PLACES = {
  USER_GROUPS: 'группах пользователя',
  SPECIFIED_GROUPS: 'указанных группах',
}
export const CONTENT_TYPE = {
  POST: 'post',
  COMMENT: 'comment',
  PHOTO_COMMENT: 'photo_comment',
  PHOTO: 'photo',
}
export const AUTH_LINK = `https://oauth.vk.com/authorize?client_id=${process.env.VUE_APP_CLIENT_ID}&display=page&redirect_uri=${process.env.VUE_APP_REDIRECT_URL}&scope=photos,wall,offline,groups,friends&response_type=token&v=5.131&state=123456`

export const SEARCH_DELAY_MS = 220;