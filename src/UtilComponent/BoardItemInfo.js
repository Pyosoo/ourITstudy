import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './BoardItemInfo.css';
import firebase from 'firebase';


let temp = [];
function BoardItemInfo(props){
    const location = useLocation();
    const ItemInfo = location.state.ItemInfo;
            /* ItemInfo 정보
            id, email, write, title, content, position, region, mine, likePeople, number, day
            */
    console.log(ItemInfo.id + '값을 받아옵니다');

    const [review, setreview] = useState(''); //댓글창에 쓰는 input
    const [ItemReview, setItemReview] = useState([]); // 현재 글에 대한 댓글이 모여있는 배열
    const [showReview, setshowReview] = useState([]); // 화면에 보여줄 객체 (댓글들을 map을 통해 p만듬)
    
    
    const handleReviewChange = e => {
        setreview(e.target.value);
    }
    const AddReview = () => {
        let newReivewArr = [...ItemReview, review];
        temp = [...temp, review];
        let ReviewItem = newReivewArr.map(data => <p>{data}</p>)
        setshowReview(ReviewItem);
        setItemReview(newReivewArr)
        setreview('');
    }


    // firebase 관련
    
    let database = firebase.database();
    let reference = database.ref(`/`);

    useEffect(()=>{
        reference.on('value', snapshot => {
            console.log(snapshot.val());
            let Data;
            for(let key in snapshot.val().boards){
                if(key === ItemInfo.id){
                    Data = snapshot.val().boards[key]
                    console.log(snapshot.val().boards[key])
                    break;
                }
            }
            if(Data.reply === undefined){
                console.log("아직 리뷰가 없습니다")
            }else{
                temp = Data.reply;
                let makeHTML = Data.reply.map(data => <p>{data}</p>)
                setshowReview(makeHTML);
                setItemReview(temp);
            }
        })

        return()=>{
            let newItemInfo = {...ItemInfo, reply : temp}
            console.log(newItemInfo);
          //    console.log(ItemReview); []로나오는 이유는 useEffect의 return에서의 props와 state는 초기 didmount때의 값을 가지고 있기때문이란다..
            database.ref().child('boards').child(ItemInfo.id).set(
               newItemInfo
            );
            temp = [];
        }
    },[])
    
    
    
    
    return(
        <div className="BoardItemInfo_back">
            <p className="BoardItemInfo_title">제목 : {ItemInfo.title}</p>
            <div className="BoardItemInfo_header">
                <p>작성자 : {ItemInfo.writer}</p>
                <p>연락수단 : {ItemInfo.number}</p>
                <p>채용 포지션 : {ItemInfo.position}</p>
                <p>등록날짜 : {ItemInfo.day}</p>
            </div>

            <div className="BoardItemInfo_content">
                {ItemInfo.content}
            </div>


            <div className="BoardItemInfo_review">
                <input className="Review_input" placeholder="댓글을 입력하세요." value={review} onChange={handleReviewChange}></input>
                <button className="Review_registerBtn" onClick={AddReview}>등록</button>
                {showReview}
            </div>
        </div>
    )
}

export default BoardItemInfo;