export default {
    namespaced: true,
    state: {
        id: '',//    访客Id
        isCheck: false,//    是否已确认
        windowList: [],//    窗口
        runAppList: [],//    打开的app列表
    },
    mutations: {
        update(state, payload) {
            for (let i in payload) {
                for (let j in state) {
                    if (i === j) {
                        state[j] = payload[i];
                    }
                }
            }
        }
    },
    actions: {
        set({ state, commit, dispatch, rootState }, data) {
            commit('update', data);
        },
        shutdown({ state, commit, dispatch, rootState }) {
            localStorage.removeItem('token');
            commit('update', {
                id: '',
                isCheck: false
            });
        },
        exitapp({ state, commit, dispatch, rootState }, data) {
            //  data = pid
            let runAppList = state.runAppList;
            runAppList.forEach((item, index) => {
                if (item.pid == data) {
                    runAppList.splice(index, 1);
                }
            });
            commit('update', {
                runAppList: runAppList
            });
        },
    }
};