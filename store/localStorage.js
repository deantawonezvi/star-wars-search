export const state = () => ({
  list: []
})

export const mutations = {
  add(state, item) {
    // Check if item exists in history
    if (state.list.filter(searchItem => searchItem.name === item).length === 0) {
      state.list.push({
        name   : item,
        history: true
      })
    }
  },
  remove(state, { item }) {
    state.list.splice(state.list.indexOf(item), 1)
  },
  resetState (state) {
    Object.assign(state, [])
  }

}

export const actions = {
  resetState({ commit }) {
    commit('resetState')
  },

}
