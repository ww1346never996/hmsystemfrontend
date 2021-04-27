import Vue from 'vue'
import VueX from 'vuex'

Vue.use(VueX);

export default new VueX.Store({
    state:{
        tableData:[]
    },

    mutations:{
        initRoutes(state,data){
            state.tableData = data;
        }
    },

    actions:{}
})