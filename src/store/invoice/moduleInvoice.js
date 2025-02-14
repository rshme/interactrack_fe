/*=========================================================================================
  File Name: moduleDataList.js
  Description: Calendar Module
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import state from './moduleInvoiceState.js'
import mutations from './moduleInvoiceMutations.js'
import actions from './moduleInvoiceActions.js'
import getters from './moduleInvoiceGetters.js'

export default {
  isRegistered: false,
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

