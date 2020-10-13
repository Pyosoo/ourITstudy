import React, { useState } from 'react';
import './MakeBoard.css';
import swal from 'sweetalert';

// redux 관련 import
import { connect } from 'react-redux';
import { actionCreators } from '../store';

// firebase 관련
import firebase from 'firebase';

import { useHistory } from 'react-router-dom';
import { auth } from '../firebase_config';

function MakeBoard(props) {
    let history = useHistory();
    let today = new Date();
    const [regionvalue, setregionvalue] = useState('none');
    const [positionvalue, setpositionvalue] = useState('none');
    const [titlevalue, settitlevalue] = useState('');
    const [contentvalue, setcontentvalue] = useState('');
    const [numbervalue, setnumbervalue] = useState('');

    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let date = today.getDate();
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
    const handleNumberChange = (e) => {
        setnumbervalue(e.target.value);
    }
    // ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●


    const handleSubmit = (e) => {
        e.preventDefault();
        settitlevalue('');
        setcontentvalue('');
        if(regionvalue === 'none') alert("지역을 선택해주세요.");
        else if(positionvalue === 'none') alert("직무를 선택해주세요.");
        else if(titlevalue === null || titlevalue === '') alert("제목을 입력해주세요.");
        else if(contentvalue === null || contentvalue === '') alert("내용을 작성해주세요.");
        else if(numbervalue === null) alert("빠른 모집을 위해 연락처나 카카오톡을 작성해주세요.");
        else{
            firebase.database().ref().child(`boards`).push({
                writer: auth.currentUser.displayName,
                region: regionvalue,
                position: positionvalue,
                title: titlevalue,
                content: contentvalue,
                email: auth.currentUser.email,
                number: numbervalue,
                day : `${year}/${month}/${date}`,
                likePeople : ['Default'], // 기본 배열 값이 있어야 배열이 생성되더라..
    
            })
            history.push('/');
        }   
        
    }

    const numberQimgClick = () => {
        swal("연락할 수단을 입력해주세요!", "보다 신속한 진행을 위하여 개인의 연락처나 카카오톡ID 혹은 오픈채팅방 링크를 통해 많은 사용자와 교류를 가져 보세요!")
    }




    return (
        <div className="Boards_Real_Back">
            <div className="Boards_Back">
                <div className="Boards_Container">
                    <div className="line1">
                        <span className="MakeBoard_span">작성자 : </span>
                        <span className="MakeBoard_writer_box">{auth.currentUser.displayName}</span>
                    </div>
                    

                    <p className="MakeBoard_span2 MakeBoard_region">지역</p>
                    <select className="MakeBoard_Input" onChange={selectRegionValueChange} name="region" >
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

                    <p className="MakeBoard_span2">모집 직군</p>
                    <select className="MakeBoard_Input" onChange={selectPositionValueChange} name="position" >
                        <option value="none">선택</option>
                        <option value="기획자">기획자</option>
                        <option value="디자인">디자인</option>
                        <option value="프론트엔드">프론트엔드</option>
                        <option value="백엔드">백엔드</option>
                        <option value="풀스택">풀스택</option>
                        <option value="프로젝트매니저">프로젝트매니저</option>
                    </select>

                    <p className="MakeBoard_span2">날짜</p>
                    <span className="MakeBoard_Input ">{year}.{month}.{date}</span>

                    <p className="MakeBoard_span2">제목</p>
                    <input className="MakeBoard_Input MakeBoard_title_box" value={titlevalue} onChange={handleTitleChange}></input>

                    <p className="MakeBoard_span2">모집 내용</p>
                    <textarea className="MakeBoard_Input MakeBoard_content_box" value={contentvalue} onChange={handleContentChange}></textarea>

                    <p className="MakeBoard_span2">연락수단<span className="Qimg" onClick={numberQimgClick}></span></p> 
                    <input className="MakeBoard_Input MakeBoard_number_box" value={numbervalue} onChange={handleNumberChange}></input>

                    <button className="MakeBoard_Submit_btn" onClick={handleSubmit}>등록하기</button>
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(MakeBoard);