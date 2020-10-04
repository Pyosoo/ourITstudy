import React, { useEffect, useState } from 'react';
import './Board.css';

// redux 관련 import
import { connect } from 'react-redux';
import { actionCreators } from '../store';

import BoardItem from './BoardItem';

// firebase 관련
import firebase from 'firebase';
import { auth } from '../firebase_config';

let database = firebase.database();




// 게시판 메인 화면 
function Board(props) {

    // 현재 firebase DB에 있는 정보가져와서 fromDB에 옮기고 store(fromDatabase)에 저장
    const [fromDB, setfromDB] = useState([]);
    const [listitemTag, setlistitemTag] = useState([]);
    const [limit, setlimit] = useState(8);
    const [DPlimitBtn, setDPlimitBtn] = useState('block');
    
    const [region, setregion] = useState(null);
    const [position, setposition] = useState(null);



    // ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●firebase 에서 데이터 가져오기●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●
    const getData = () => {
        let reference = database.ref('/');
        // 지금 비동기로 데이터를 받아오고 있어서 빈화면이 출력되는 것
        reference.on('value', snapshot => {
            let list = [];
            const data = snapshot.val();
            for (let key in data) {
                for (let key2 in data[key]) {   // 각 게시판 글이 갖고 있는 랜덤으로 만들어진 Key 값 << 이거로 삭제 및 업데이트 해야함
                    Object.assign(data[key][key2], {id: key2}, {email: data[key][key2].email});
                    list.push(data[key][key2]);
                    console.log(data[key][key2])
                }
            }
            list = list.reverse();
            setfromDB(list);

            for (let i = 0; i < (list.length < limit ? list.length : limit); i++) {
               // console.log(`현재글의 이메일:${list[i].email} , 로그인된이메일:${auth.currentUser.email}`)
               // if(list[i].email === auth.currentUser.email) console.log("같다")
               // else console.log("다르다")
                
                showitemlist.push(
                    <BoardItem key={i} 
                        email={list[i].email} 
                        id={list[i].id} 
                        writer={list[i].writer} 
                        title={list[i].title} 
                        content={list[i].content} 
                        position={list[i].position} 
                        region={list[i].region} 
                        likePeople={list[i].likePeople}
                        mine="no"/>)
                }
            setlistitemTag(showitemlist);
        })
    }

    const getDataOnSelect = () => {
        let temp = [];
        if(region === null && position !== null){ // position만 선택했을 때
            let tempIndexForKey = 0;
            fromDB.forEach(data=>{
                if(data.position === position){
                    temp.push(
                        <BoardItem 
                            key={tempIndexForKey++}
                            email={data.email} 
                            id={data.id} 
                            writer={data.writer} 
                            title={data.title} 
                            content={data.content} 
                            position={data.position} 
                            region={data.region} 
                            likePeople={data.likePeople}
                            mine="no"/>
                    )
                }
            })
        }
        else if(region !== null && position === null){ // region만 선택했을때
            let tempIndexForKey = 0;
            fromDB.forEach(data=>{
                if(data.region === region){
                    temp.push(
                        <BoardItem 
                            key={tempIndexForKey++}
                            email={data.email} 
                            id={data.id} 
                            writer={data.writer} 
                            title={data.title} 
                            content={data.content} 
                            position={data.position} 
                            region={data.region} 
                            mine="no"
                            likePeople={data.likePeople}
                            />
                    )
                }
            })
        }
        else if(region !== null && position !== null){
            let tempIndexForKey = 0;
            fromDB.forEach(data => {
                if(data.region === region && data.position === position){
                    temp.push(
                        <BoardItem 
                            key={tempIndexForKey++}
                            email={data.email} 
                            id={data.id} 
                            writer={data.writer} 
                            title={data.title} 
                            content={data.content} 
                            position={data.position} 
                            region={data.region} 
                            likePeople={data.likePeople}
                            mine="no"/>)
                }
            })
        }
        if(temp.length === 0){
            temp = ['조회된 데이터가 없습니다'];
        }
        setlistitemTag(temp);
    }

    // ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●● 더보기 클릭시 ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●

    let showitemlist = [];
    const limitplus = () => {
        console.log(`limitplus 실행! limit ${limit} => ${limit + 8}`)
        if (limit >= fromDB.length) setDPlimitBtn('none');
        setlimit(limit + 8);
       
    }
    // ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●


    // ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●● select menu function ●●●●●●●●●●●●●●●●●●●●●●●●●●●
    const selectRegion = e => {
        setregion(e.target.value);
    }
    const selectPosition = e => {
        setposition(e.target.value);
    }


    


    //  ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●● useEFfect ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●
    useEffect(() => {
        console.log(`현재 접속중인 사용자의 displayName = ${auth.currentUser.displayName}`);
        getData();
    },[limit])
    // ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●


    return (
        <div className="Boards_Total_Container">
            <div className="Board_Header">
                <select className="Board_select_btn" onChange={selectRegion} name="region" >
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
                <select className="Board_select_btn" onChange={selectPosition} name="position" >
                    <option value="none">선택</option>
                    <option value="기획자">기획자</option>
                    <option value="디자인">디자인</option>
                    <option value="프론트엔드">프론트엔드</option>
                    <option value="백엔드">백엔드</option>
                    <option value="풀스택">풀스택</option>
                    <option value="프로젝트매니저">프로젝트매니저</option>
                </select>
                <button className="Boards_select_Btn" onClick={getDataOnSelect}>검색하기</button>
                <button className="Boards_select_Btn" onClick={getData}>초기화</button>
            </div>
            <div className="Boards_Box">
                {listitemTag}
                <button className="SeeMoreBtn" onClick={limitplus} style={{ display: DPlimitBtn }}>더보기</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Board);