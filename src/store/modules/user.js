import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import Md5 from "@/utils/md5";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    invite_code: '',
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_INVITE_CODE: (state, invite_code) => {
    state.invite_code = invite_code
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.user_token)
        setToken(data.user_token)
        commit('SET_INVITE_CODE', data.invite_code)
        localStorage.setItem('invite_code', data.invite_code);
        // Cookies.set('invite_code', data.invite_code)
        commit('SET_NAME',userInfo)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar, invite_code } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INVITE_CODE', invite_code)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit }) {
      commit('SET_TOKEN', '')
      commit('SET_NAME', '')
      commit('SET_INVITE_CODE', '')
      setToken('')
      resolve()
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

