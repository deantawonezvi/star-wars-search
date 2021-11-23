export const state = () => ({
  list: []
})

export const mutations = {
  add(state, item) {
    state.list.push({
      name:item,
      history: true
    })
  },
  remove(state, { item }) {
    state.list.splice(state.list.indexOf(item), 1)
  },

}
