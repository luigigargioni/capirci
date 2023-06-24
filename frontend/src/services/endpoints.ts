const PROTOCOL = 'http://'
const HOST = 'localhost'
const PORT = ':8000'
const API = '/api'

const SERVER = PROTOCOL + HOST + PORT
const SERVER_API = SERVER + API

const AUTH_API = `${SERVER_API}/auth`
const HOME_API = `${SERVER_API}/home`
const GRAPHIC_API = `${SERVER_API}/graphic`
const CHAT_API = `${SERVER_API}/chat`

export const endpoints = {
  auth: {
    login: `${AUTH_API}/login/`,
    logout: `${AUTH_API}/logout/`,
    verifyToken: `${AUTH_API}/verifyToken/`,
  },
  home: {
    user: {
      changePassword: `${HOME_API}/changePassword/`,
    },
    libraries: {
      tasks: `${HOME_API}/tasks/`,
      task: `${HOME_API}/task/`,
      objects: `${HOME_API}/objects/`,
      object: `${HOME_API}/object/`,
      locations: `${HOME_API}/locations/`,
      location: `${HOME_API}/location/`,
      actions: `${HOME_API}/actions/`,
      action: `${HOME_API}/action/`,
      myRobots: `${HOME_API}/myRobots/`,
      myRobot: `${HOME_API}/myRobot/`,
      takePosition: `${HOME_API}/takePosition/`,
      getObjectPhoto: `${HOME_API}/getObjectPhoto/`,
    },
    management: {
      users: `${HOME_API}/users/`,
      user: `${HOME_API}/user/`,
      resetPassword: `${HOME_API}/resetPassword/`,
      robots: `${HOME_API}/robots/`,
      robot: `${HOME_API}/robot/`,
      groups: `${HOME_API}/groups/`,
    },
    programming: {},
  },
  graphic: {
    actions: `${GRAPHIC_API}/getActionList/`,
    objects: `${GRAPHIC_API}/getObjectList/`,
    locations: `${GRAPHIC_API}/getLocationList/`,
    tasks: `${GRAPHIC_API}/getTaskList/`,
  },
  chat: {
    messages: `${CHAT_API}/getMessages/`,
  },
}
