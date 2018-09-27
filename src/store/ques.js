const quers = {
    state:{
        markId:0,
        markPage:0,
        querData:[],
        setDate:[],
        setChildindex:"",
        ResultOne:[],
        ResultTwo:[],
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
        setChildindex(state,data){ //更改子数据数据
            state.setChildindex = data
        },
        getResultOne(state,data){  //调查问卷的第一个下拉答案
            state.ResultOne=data
        },
        getResultTwo(state,data){  //调查问卷的第二个下拉答案
            state.ResultTwo=data
        }
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
        },
        setChildindexs({ commit },data){ //更改数据
            commit('setChildindex',data);
        },
        getResultOnes({ commit },data){ //更改数据
            commit('getResultOne',data);
        },
        getResultTwos({ commit },data){ //更改数据
            commit('getResultTwo',data);
        }
    }
}
export default quers