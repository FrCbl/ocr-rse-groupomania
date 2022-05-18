import { createStore } from 'vuex'

const axios = require('axios')

const instance = axios.create({
  baseURL: 'http://localhost:3000/api/'
})

let user = localStorage.getItem('user')
if (!user) {
  user = {
    userId: -1,
    token: ''
  }
} else {
  try {
    user = JSON.parse(user)
    instance.defaults.headers.common.Authorization = user.token
  } catch (ex) {
    user = {
      userId: -1,
      token: ''
    }
  }
}

export default createStore({
  state: {
    status: '',
    user: user,
    userProfile: {
      userId: '',
      pseudo: '',
      avatar: '',
      droitsAdmin: ''
    }
  },
  getters: {
  },
  mutations: {
    setStatus: function (state, status) {
      state.status = status
    },
    logUser: function (state, user) {
      instance.defaults.headers.common.Authorization = user.token
      localStorage.setItem('user', JSON.stringify(user))
      state.user = user
    },
    userProfile: function (state, userProfile) {
      state.userProfile = userProfile
    },
    logout: function (state) {
      state.user = {
        userId: -1,
        token: ''
      }
      state.userProfile = {
        userId: '',
        pseudo: '',
        avatar: '',
        droitsAdmin: ''
      }
      localStorage.removeItem('user')
    },
    deleteUser: function (state, user) {
      state.user = user
    }
  },
  actions: {
    fill: ({ commit }, userProfile) => {
      commit('logUser', userProfile)
    },
    logout: ({ commit }, logout) => {
      commit('logout', logout)
    },
    logIn: ({ commit }, userProfile) => {
      commit('setStatus', 'loading')      
      return new Promise((resolve, reject) => {
        instance.post('/user/login', userProfile)
          .then(function (response) {
            commit('setStatus', '')
            commit('logUser', response.data)
            resolve(response)
          })
          .catch(function (error) {
            console.log(error)
            commit('setStatus', 'error_login')
            reject(error)
          })
      })
    },
    signUp: ({ commit }, userProfile) => {
      commit('setStatus', 'loading')
      return new Promise((resolve, reject) => {
        instance.post('/user/signup', userProfile)
          .then(function (response) {
            commit('setStatus', 'created')
            resolve(response)
          })
          .catch(function (error) {
            console.log(error)
            commit('setStatus', 'error_create')
            reject(error)
          })
      })
    },
    deleteUser: ({ commit }, user) => {
      console.log('delte:', user)
      return new Promise((resolve, reject) => {
        instance.delete(`user/profile/${user.userId}`, { headers: { Authorization: `Bearer ${user.token}` } })
          .then(function (response) {
            console.warn(response)
            commit('logout', response.data)
            console.log(response.data)
            location.reload()
            resolve(response)
          })
          .catch(function (error) {
            console.log(error)
            commit('setStatus', 'error__delete')
            reject(error)
          })
      })
    }
  },
  modules: {
  }
})
