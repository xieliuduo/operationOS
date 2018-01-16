import { param2Obj } from '@/utils'

const userMap = {
  admin: {
    token: 'admin',
  },
  editor: {
  
    token: 'editor',
   
  },
  people:{
   
    token: 'people',
   
  }
}
const userTokenMap = {
  admin: {
    roles: ['admin'],
    token: 'admin',
    introduction: '我是超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  editor: {
    roles: ['editor'],
    token: 'editor',
    introduction: '我是编辑',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  },
  people:{
    roles: ['example'],
    token: 'people',
    introduction: '我是游客',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal People'
  }
}

export default {
  loginByUsername: config => {
    //debugger
    const { username } = JSON.parse(config.body)
    return userMap[username]
  },
  getUserInfo: config => {
    const { token } = param2Obj(config.url)
    if (userTokenMap[token]) {
      return userTokenMap[token]
    } else {
      return false
    }
  },
  logout: () => 'success'
}
