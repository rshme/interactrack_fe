/*=========================================================================================
  File Name: moduleCalendarActions.js
  Description: Calendar Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import axios from '@/axios.js'

export default {
  addItem ({ commit }, item) {
    return new Promise((resolve, reject) => {
      axios.post('/customer/', item)    
        .then((response) => {
          commit('ADD_ITEM', Object.assign(item, {id: response.data.id}))
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  fetchItems ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('/customer')
        .then((response) => {
          commit('SET_CONTACTS', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  updateItem ({ commit }, item) {
    return new Promise((resolve, reject) => {
      axios.put(`/customer/${item.id}`, item)
        .then((response) => {
          commit('UPDATE_CONTACT', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  removeItem ({ commit }, itemId) {
    return new Promise((resolve, reject) => {
      axios.delete(`/customer/${itemId}`)
        .then((response) => {
          commit('REMOVE_ITEM', itemId)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  }
}
