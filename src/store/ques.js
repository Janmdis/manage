const quers = {
    state:{
        markId:0,
        markPage:0,
        querData:[],
        setDate:[],
    },
    mutations:{
        markId(state){
            state.markId++;
        },
        markPage(state){
            state.markPage++;
        },
        getquerData(state,data){ //获取数据
            state.querData = data
        },
        upquerData(state,data){ //更改数据
            state.querData = data
        },
        setTableDate(state,data){ //更改数据
            state.setDate = data
        },
    },
    actions:{
        getquerDatas({ commit },data){ //触发获取数据
            commit('getquerData',data);
        },
        upquerDatas({ commit },data){ //更改数据
            commit('upquerData',data);
        },
        setTableDates({ commit },data){ //更改数据
            commit('setTableDate',data);
        }
    }
}
export default quers