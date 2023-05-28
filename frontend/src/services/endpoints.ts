const PROTOCOL = 'http://'
const HOST = 'localhost'
const PORT = ':8000'
const API = '/api'

const SERVER = PROTOCOL + HOST + PORT
const SERVER_API = SERVER + API

const HOME_API = `${SERVER_API}/home`
const GRAPHIC_API = `${SERVER_API}/graphic`
const CHAT_API = `${SERVER_API}/chat`

export const endpoints = {
  authentication: {
    login: `${SERVER_API}/login/`,
  },
  home: {},
  graphic: {
    actions: `${GRAPHIC_API}/getActionList/`,
    objects: `${GRAPHIC_API}/getObjectList/`,
    locations: `${GRAPHIC_API}/getLocationList/`,
    tasks: `${GRAPHIC_API}/getTaskList/`,
  },
  chat: {},
}