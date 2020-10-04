import React, {useEffect, useState} from 'react';
import BoardItem from './BoardItem';
// redux 관련 import
import { connect } from 'react-redux';
import { actionCreators } from '../store';


// firebase 관련
import firebase from 'firebase';
import { auth } from '../firebase_config';

let database = firebase.database();


let fromFirebaseDB; //나의 글 목록을 받아와 저장해놓은 {} 객체


function MyPage(props) {
    console.log("MyPage 실행")
    const [listitem, setlistitem] = useState([]);

    let showlist = [];
    const getData = () => {
        let reference = database.ref('/');
        reference.on('value', snapshot => {
            const data = snapshot.val();
            for(let key in data){
                for(let key2 in data[key]){
                    if(data[key][key2].email === auth.currentUser.email){
                        showlist.push(
                        <BoardItem 
                            key={key2} 
                            email={data[key][key2].email} 
                            id={data[key][key2].id} 
                            writer={data[key][key2].writer}
                            title={data[key][key2].title} 
                            content={data[key][key2].content} 
                            position={data[key][key2].position} 
                            region={data[key][key2].region}
                            mine="yes" />)
                    }
                }
            }
            setlistitem(showlist);
        })
    }

    useEffect(() => {
        console.log("useEffect 실행")
        getData();
    },[])

    return (
        <div>
           {listitem}
        </div>
    )
}



// Redux state로부터 home에 prop으로써 전달한다는 뜻.
function mapStateToProps(state, ownProps) {
    return { StoreData: state };   //toDos에 state를 가져온다.
}

// reducer에 action을 알리는 함수
function mapDispatchToProps(dispatch) {
    return {
        updateState: status => dispatch(actionCreators.updateState(status))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyPage);