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
    state.invoices.unshift(item)
  },
  SET_INVOICES (state, invoices) {
    state.invoices = invoices
  },
  // SET_LABELS(state, labels) {
  //   state.eventLabels = labels
  // },
  UPDATE_INVOICE (state, product) {
    const productIndex = state.invoices.findIndex((p) => p.id === product.id)
    Object.assign(state.invoices[productIndex], product)
  },
  REMOVE_ITEM (state, itemId) {
    const ItemIndex = state.invoices.findIndex((p) => p.id === itemId)
    state.invoices.splice(ItemIndex, 1)
  }
}
