import Vue from 'vue'
import Vuex from 'vuex'
import sys from './system'
import user from './user'
import perms from './perms'
import ques from './ques'
Vue.use(Vuex);
const store = new Vuex.Store({
    modules: {
        sys,
        user,
        perms,
        ques
    }
})

export default store