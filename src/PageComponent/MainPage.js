import React, { useEffect, useState } from 'react';
import Board from '../UtilComponent/Board';
// Google 로그인 관련
import GoogleSignin from '../UtilComponent/GoogleSignin';
import { auth } from '../firebase_config';

// redux 관련 import
import { connect } from 'react-redux';
import { actionCreators } from '../store';

// firebase 관련
import firebase from 'firebase';

// router 관련

import { useHistory } from "react-router-dom";

let database = firebase.database();



function MainPage(props) {
    let history = useHistory();
    
    const goLogin = () => {
        history.push("/");
    }



    // 현재 firebase DB에 있는 정보가져와서 fromDB에 옮기고 store(fromDatabase)에 저장
    const [fromDB, setfromDB] = useState([]);
    const [listitemTag, setlistitemTag] = useState();
    const [limit, setlimit] = useState(8);

    // inpurt 값 state
    const [writervalue, setwritervalue] = useState('');
    const [titlevalue, settitlevalue] = useState('');
    const [contentvalue, setcontentvalue] = useState('');
    const [DPlimitBtn, setDPlimitBtn] = useState('block');


    const getData = () => {
        console.log('getdata실행')
        let reference = database.ref('/');
        reference.on('value', snapshot => {
            let listtemp = [];
            let list = [];
            const data = snapshot.val();
            for (let key in data) {
                for (let key2 in data[key]) {
                    //         console.log(data[key][key2]);
                    list.push(data[key][key2]);
                    list = list.reverse();
                }
            }
            setfromDB(list);
            //  console.log(list)
            for (let i = 0; i < limit; i++) {
                if (list[i] !== undefined) {
                    listtemp.push(<Board key={list[i].writer} writer={list[i].writer} title={list[i].title} content={list[i].content} />)
                }
            }
            setlistitemTag(listtemp);
            props.updateState(props.LoginStatus, props.StoreData.fromDatabase);
        })
    }




    const handleWriterChange = (e) => {
        setwritervalue(e.target.value);
    }
    const handleTitleChange = (e) => {
        settitlevalue(e.target.value);
    }
    const handleContentChange = (e) => {
        setcontentvalue(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setwritervalue('');
        settitlevalue('');
        setcontentvalue('');
        firebase.database().ref().child(`boards`).push({
            writer: writervalue,
            title: titlevalue,
            content: contentvalue
        })
    }

    const limitplus = (e) => {
        e.preventDefault();
        if (limit < fromDB.length) {
            if (limit + 8 > fromDB.length) setDPlimitBtn('none');
            setlimit(limit + 8);
        }
        else {
            setDPlimitBtn('none');
        }
    }

    return (
        <div>
            <button onClick={goLogin}>로그아웃</button>
            <input value={writervalue} onChange={handleWriterChange}></input>
            <input value={titlevalue} onChange={handleTitleChange}></input>
            <input value={contentvalue} onChange={handleContentChange}></input>
            <button onClick={handleSubmit}>제출하기</button>

            <div className="Content_Container">
                {listitemTag}
            </div>

            <button onClick={limitplus} style={{ display: DPlimitBtn }}>더보기</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);