import React, { useEffect, useState } from 'react';
import BoardItem from './BoardItem';
// redux 관련 import
import { connect } from 'react-redux';
import { actionCreators } from '../store';

// firebase 관련
import firebase from 'firebase';
import { auth } from '../firebase_config';

let database = firebase.database();


function Scrap() {

    const [listitem, setlistitem] = useState([]);

    

    useEffect(() => {
        console.log("Scrap 의 useEffect 실행")
        let showlist = [];
        const getData = () => {
        console.log("scrap의 getData 실행")
        showlist= [];
        let reference = database.ref('/');
        // 여기선 once로 한번만 불러온다 on으로 상시대기하게 되면 스크랩 취소시 데이터를 또 받아 이중으로 데이터가 생김
        reference.once('value', snapshot => {
            const data = snapshot.val();
            for (let key in data) {
                for (let key2 in data[key]) {
                    if(data[key][key2].likePeople.find(data=> data === auth.currentUser.email) !== undefined){
                        console.log("스크랩한글찾음")
                            showlist.push(
                                <BoardItem
                                    key={key2}
                                    email={data[key][key2].email}
                                    id={key2}
                                    writer={data[key][key2].writer}
                                    title={data[key][key2].title}
                                    content={data[key][key2].content}
                                    position={data[key][key2].position}
                                    region={data[key][key2].region}
                                    likePeople={data[key][key2].likePeople}
                                    number={data[key][key2].number}
                                    likeStatus="yes"
                                    day={data[key][key2].day}
                                    mine="no" />)
                    }
                }
            }
            if(showlist.length === 0) showlist = [<p key={Math.random()} className="NoDataP">스크랩한 글이 없습니다.</p>];
            setlistitem(showlist);
        })
    }
        getData();
    },[])

    if (listitem.length === null) {
        return (
            <div>
                스크랩한 글이 없습니다.
            </div>
        )
    }else{
        return(
            <div>
            {listitem}
            </div>
        )
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(Scrap);