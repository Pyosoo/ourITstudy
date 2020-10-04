import React, { useEffect, useState } from 'react';
import './UpdateBoard.css';
// redux 관련 import
import { connect } from 'react-redux';
import { actionCreators } from '../store';

// firebase 관련
import firebase from 'firebase';

import { useHistory } from 'react-router-dom';
import { auth } from '../firebase_config';

function UpdateBoard(props) {
    let history = useHistory();

    const [regionvalue, setregionvalue] = useState('none');
    const [positionvalue, setpositionvalue] = useState('none');
    const [titlevalue, settitlevalue] = useState('');
    const [contentvalue, setcontentvalue] = useState('');

    //  ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●● 입력값 수정 ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●
    const handleTitleChange = (e) => {
        settitlevalue(e.target.value);
    }
    const handleContentChange = (e) => {
        setcontentvalue(e.target.value);
    }
    const selectRegionValueChange = (e) => {
        setregionvalue(e.target.value);
    }
    const selectPositionValueChange = (e) => {
        setpositionvalue(e.target.value);
    }
    // ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●


    const handleSubmit = (e) => {
        e.preventDefault();
        settitlevalue('');
        setcontentvalue('');
        firebase.database().ref().child(`boards`).push({
            writer: auth.currentUser.displayName,
            region: regionvalue,
            position: positionvalue,
            title: titlevalue,
            content: contentvalue,

        })
        history.push('/');
    }


    return (
        <div className="Boards_Container">
            <p>작성자</p>
            <p className="MakeBoard_writer_box">{auth.currentUser.displayName}</p>

            <p>지역</p>
            <select onChange={selectRegionValueChange} name="region" >
                <option value="none">선택</option>
                <option value="서울">서울</option>
                <option value="수원">수원</option>
                <option value="인천">인천</option>
                <option value="대구">대구</option>
                <option value="부산">부산</option>
                <option value="울산">울산</option>
                <option value="광주">광주</option>
                <option value="전주">전주</option>
                <option value="대전">대전</option>
                <option value="세종">세종</option>
                <option value="천안">천안</option>
                <option value="청주">청주</option>
                <option value="원주">원주</option>
                <option value="춘천">춘천</option>
                <option value="제주">제주</option>
                <option value="기타">기타</option>
            </select>

            <p>모집 직군</p>
            <select onChange={selectPositionValueChange} name="position" >
                <option value="none">선택</option>
                <option value="기획자">기획자</option>
                <option value="디자인">디자인</option>
                <option value="프론트엔드">프론트엔드</option>
                <option value="백엔드">백엔드</option>
                <option value="풀스택">풀스택</option>
                <option value="프로젝트매니저">프로젝트매니저</option>
            </select>
            <p>제목</p>
            <input className="MakeBoard_title_box" value={titlevalue} onChange={handleTitleChange}></input>
            
            <p>모집 내용</p>
            <input className="MakeBoard_content_box" value={contentvalue} onChange={handleContentChange}></input>
            <button className="MakeBoard_Submit_btn" onClick={handleSubmit}>제출하기</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(UpdateBoard);