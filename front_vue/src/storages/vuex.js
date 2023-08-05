import jwtStore from './jwtStore'
import otherData from './otherData'

import { createStore } from 'vuex'

const store = createStore({
    modules: {
        jwtStore,
        otherData
    },
})

export default store