import React, { useEffect, useState } from 'react';
import './Board.css';

// redux 관련 import
import { connect } from 'react-redux';
import { actionCreators } from '../store';

import BoardItem from './BoardItem';

// firebase 관련
import firebase from 'firebase';

// Image 관련
import refreshImg from '../Images/refresh.png';
import searchImg from '../Images/search.png';

let database = firebase.database();




// 게시판 메인 화면 
function Board(props) {

    // 현재 firebase DB에 있는 정보가져와서 fromDB에 옮기고 store(fromDatabase)에 저장
    const [fromDB, setfromDB] = useState([]);
    const [currentDB, setcurrentDB] = useState([]);
    const [listitemTag, setlistitemTag] = useState([]);
    const [limit, setlimit] = useState(8);
    const [DPlimitBtn, setDPlimitBtn] = useState('block');
    const [MoreDP, setMoreDP] = useState('');
    
    const [region, setregion] = useState('none');
    const [position, setposition] = useState('none');


    let showitemlist = [];
    // ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●firebase 에서 데이터 가져오기●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●
    const getData = () => {
        setMoreDP('');
        let reference = database.ref('/');
        reference.on('value', snapshot => {
            let list = [];
            const data = snapshot.val();
            for (let key in data) {
                for (let key2 in data[key]) {   // 각 게시판 글이 갖고 있는 랜덤으로 만들어진 Key 값 << 이거로 삭제 및 업데이트 해야함
                    Object.assign(data[key][key2], {id: key2}, {email: data[key][key2].email});
                    list.push(data[key][key2]);
                 //   console.log(data[key][key2])
                }
            }
            list = list.reverse();
            setfromDB(list);
            setcurrentDB(list);
            if(list.length < 8) setMoreDP('none')
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
                        day={list[i].day}
                        number={list[i].number}
                        mine="no"/>)
                }
            setlistitemTag(showitemlist);
            props.updateState(props.StoreData.LoginStatus, list);
        })
        setregion('none');
        setposition('none');
    }

    const getDataOnSelect = () => {
        console.log(`region : ${region}`);
        console.log(`position : ${position}`)
        let temp = [];
        if(region === 'none' && position === 'none'){
            alert("지역 혹은 직무를 선택해주세요")
        }
        else if(region === 'none' && position !== 'none'){ // position만 선택했을 때
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
                            number={data.number}
                            day={data.day}
                            mine="no"/>
                    )
                }
            })
            if(temp.length === 0){
                temp = ['조회된 데이터가 없습니다'];
            }
            setlistitemTag(temp);
            setMoreDP('none');
        }
        else if(region !== 'none' && position === 'none'){ // region만 선택했을때
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
                            number={data.number}
                            mine="no"
                            likePeople={data.likePeople}
                            day={data.day}
                            />
                    )
                }
            })
            if(temp.length === 0){
                temp = ['조회된 데이터가 없습니다'];
            }
            setlistitemTag(temp);
            setMoreDP('none');
        }
        else if(region !== 'none' && position !== 'none'){
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
                            number={data.number}
                            day={data.day}
                            mine="no"/>)
                }
            })
            if(temp.length === 0){
                temp = [<p className="NoDataP">조회된 데이터가 없습니다</p>];
            }
            setlistitemTag(temp);
            setMoreDP('none');
        }
        setcurrentDB(temp);
    }


   // infinite scroll 실행시  
    const limitplus = () => {
        //console.log(`${limit} , ${currentDB.length}`)
        let curLimit = limit;
        if(limit < currentDB.length && limit + 8 < currentDB.length){
            //console.log(`limit : ${limit}  currentDB.length : ${currentDB.length}  이고 옵션 1실행`)
            curLimit = limit+8;
        }
        else if(limit < currentDB.length && limit + 8 > currentDB.length){
            //console.log(`limit : ${limit}  currentDB.length : ${currentDB.length}  이고 옵션 2실행`)
            curLimit = currentDB.length;
        }
        if(limit > currentDB.length) return;    // 초기에 limit 8인데 selectedOption한 data가 길이가 8보다 짧을때를 대비..

        let tempIndexForKey = 0;
        showitemlist = [];
        for(let i=0; i<curLimit; i++){
            if(currentDB[i] !== undefined){
                showitemlist.push(
                    <BoardItem 
                            key={tempIndexForKey++}
                            email={currentDB[i].email} 
                            id={currentDB[i].id} 
                            writer={currentDB[i].writer} 
                            title={fromDB[i].title} 
                            content={currentDB[i].content} 
                            position={currentDB[i].position} 
                            region={currentDB[i].region} 
                            mine="no"
                            likePeople={currentDB[i].likePeople}
                            number={currentDB[i].number}
                            day={currentDB[i].day}
                            />
                )
            }
        }
        setlistitemTag(showitemlist);
        setlimit(curLimit);
        setMoreDP('none')
    }
    // ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●


    // ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●● select menu function ●●●●●●●●●●●●●●●●●●●●●●●●●●●
    const selectRegion = e => {
        setregion(e.target.value);
    }
    const selectPosition = e => {
        setposition(e.target.value);
    }


    // infinite scroll 
  const handleScroll = () => {
      if(document.getElementById('boardwindow').scrollHeight - 5 < document.getElementById('boardwindow').scrollTop + document.getElementById('boardwindow').clientHeight){
          limitplus();
      }
   };


    //  ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●● useEFfect ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●
    
    useEffect(() => {
        // scroll event listener 등록
        document.getElementById('boardwindow').addEventListener("scroll", handleScroll);
        return () => {
          // scroll event listener 해제
          document.getElementById('boardwindow').removeEventListener("scroll", handleScroll);
        };
      });
    useEffect(() => {
      //  console.log("Boards의 useEffect 실행");
        getData();
    },[])
    
    // ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●


    return (
        <div className="Boards_Total_Container">
            <div className="Board_Header">
                <div className="Boards_select_div">
                    <select className="Board_select_btn" onChange={selectRegion} name="region" value={region}>
                        <option value="none">지역</option>
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
                    <select className="Board_select_btn" onChange={selectPosition} name="position" value={position}>
                        <option value="none">포지션</option>
                        <option value="기획자">기획자</option>
                        <option value="디자인">디자인</option>
                        <option value="프론트엔드">프론트엔드</option>
                        <option value="백엔드">백엔드</option>
                        <option value="풀스택">풀스택</option>
                        <option value="프로젝트매니저">프로젝트매니저</option>
                    </select>
                </div>
                <img className="Boards_select_Btn2" onClick={getDataOnSelect} src={searchImg} />
                <p className="Boards_select_Btn1" onClick={getData}>검색초기화</p>
            </div>
            <div className="Boards_Box">
                {listitemTag}
                <div style={{display:MoreDP}}><button className="SeeMoreBtn" onClick={limitplus} style={{ display: DPlimitBtn }}>더보기</button></div>
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