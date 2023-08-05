const jwtStore = {
    state: {
      token: null
    },
    mutations: {
      setToken(state, newToken)
      {
        state.token = newToken
      }
    }
  }

  export default jwtStore