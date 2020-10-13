import { createStore } from "redux";


const UPDATE = "UPDATE";

//2. action 객체를 생성해 놓는다.
const updateState = (status, Data) => {
    console.log("updatestate실행")
    return{
        type: UPDATE,
        status,
        Data
    }
}

//3. reducer를 생성한다. state와 action을 입력 받고 바뀐 결과 state를 return 한다.
const reducer = (state = {LoginStatus : false, fromDatabase : []}, action) =>{
    switch(action.type){
        case UPDATE:
            return {
                LoginStatus : action.status,
                fromDatabase : action.Data
            };
        default:
            return state;
    }
    
};

//4. store 객체를 생성하는데 reducer를 매개변수로 갖고 시작한다.
const store = createStore(reducer);

//5. 내가 만든 action들을 다른 컴포넌트에서 쓸수 있도록 묶어서 export해준다.
export const actionCreators = {
    updateState
}

export default store;