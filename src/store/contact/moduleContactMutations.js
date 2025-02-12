/*=========================================================================================
  File Name: moduleCalendarMutations.js
  Description: Calendar Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default {
  ADD_ITEM (state, item) {
    state.contacts.unshift(item)
  },
  SET_CONTACTS (state, contacts) {
    state.contacts = contacts
  },
  // SET_LABELS(state, labels) {
  //   state.eventLabels = labels
  // },
  UPDATE_CONTACT (state, product) {
    const productIndex = state.contacts.findIndex((p) => p.id === product.id)
    Object.assign(state.contacts[productIndex], product)
  },
  REMOVE_ITEM (state, itemId) {
    const ItemIndex = state.contacts.findIndex((p) => p.id === itemId)
    state.contacts.splice(ItemIndex, 1)
  }
}
