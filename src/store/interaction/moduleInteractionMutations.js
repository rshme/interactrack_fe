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
    state.interactions.unshift(item)
  },
  SET_INTERACTIONS (state, interactions) {
    state.interactions = interactions
  },
  // SET_LABELS(state, labels) {
  //   state.eventLabels = labels
  // },
  UPDATE_INTERACTION (state, product) {
    const productIndex = state.interactions.findIndex((p) => p.id === product.id)
    Object.assign(state.interactions[productIndex], product)
  },
  REMOVE_ITEM (state, itemId) {
    const ItemIndex = state.interactions.findIndex((p) => p.id === itemId)
    state.interactions.splice(ItemIndex, 1)
  }
}
