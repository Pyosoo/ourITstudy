import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './BoardItemInfo.css';
import firebase from 'firebase';
import { auth } from '../firebase_config';
import trash from '../Images/trash.png';
import exchange from '../Images/exchange.png';

let temp = [];
let flag = false;
function BoardItemInfo(props) {
    const location = useLocation();
    const ItemInfo = location.state.ItemInfo;
    /* ItemInfo 정보
    id, email, write, title, content, position, region, mine, likePeople, number, day
    */
    console.log(ItemInfo.id + '값을 받아옵니다');

    const [review, setreview] = useState(''); //댓글창에 쓰는 input
    const [showReview, setshowReview] = useState([]); // 화면에 보여줄 객체 (댓글들을 map을 통해 p만듬)


    const handleReviewChange = e => {
        setreview(e.target.value);
    }
    const AddReview = () => {
        // 기존의 ItemReview에 새로 입력한 댓글을 추가하기
        // WillUnmount에서 저장하기 위해 별도로 저장한번 더
        let check = window.confirm("댓글을 등록하시겠습니까?");
        if(check){
            temp = [...temp, { who: auth.currentUser.email, what: review }];

            // HTML에 보여질 요소로 만들어 주기
            let ReviewItem = temp.map((data, index) =>
                <div className="Review_line" key={index}>
                    <p className="Review_what">{data.what}</p>
                    <p className="Review_who">{data.who}</p>
                </div>
            )
            setshowReview(ReviewItem);
            setreview('');
            let newItemInfo = { ...ItemInfo, reply: temp }
            database.ref().child('boards').child(ItemInfo.id).set(newItemInfo);
            flag = true;//여기서 데이터를 추가해버리면. 나갈때 다시 빈 배열로 초기화를 시켜버린다....
        }
    }

    const DeleteReview = (_id) => {
        let check = window.confirm("정말 삭제하시겠습니까?");
        if(check === true){
            let Data;
            // 우선 해당글에 대한 댓글을 모두 받아온 후
            reference.on('value', snapshot => {
                for (let key in snapshot.val().boards) {
                    if (key === ItemInfo.id) { // ItemInfo.id => AIISNAD@AI2 같은 해당 글에 대한 ID값
                        Data = snapshot.val().boards[key];
                        break;
                    }
                }
            })
            console.log(Data.reply);
    
            // 클릭된 id 값을 가진 요소를 지우고
            Data.reply = Data.reply.filter((data, index) => index !== parseInt(_id));
            if(Data.reply.length === 0){
                setshowReview([]);
                temp = [];
            }
            let newItemInfo = { ...ItemInfo, reply: Data.reply }
            database.ref().child('boards').child(ItemInfo.id).set(newItemInfo);
        }
    }

    const UpdateReview = (_id) => {
        let UpdatedReview = window.prompt('새로운 댓글을 입력해주세요.', "");
        temp[_id].what = UpdatedReview;
        let newItemInfo = { ...ItemInfo, reply: temp }
            database.ref().child('boards').child(ItemInfo.id).set(newItemInfo);
    }




    // firebase 관련

    let database = firebase.database();
    let reference = database.ref(`/`);

    useEffect(() => {
        temp = [];
        reference.on('value', snapshot => {
            let Data;
            for (let key in snapshot.val().boards) {
                if (key === ItemInfo.id) {
                    Data = snapshot.val().boards[key];
                    break;
                }
            }
            console.log(Data.reply);
            if (Data.reply === undefined) {
                console.log("아직 리뷰가 없습니다")
            } else {
                temp = Data.reply;
                let makeHTML = Data.reply.map((data, index) => {
                    if (data.who === auth.currentUser.email) {
                        return (
                            <div className="Review_line" key={index}>
                                <p className="Review_what">{data.what}</p>
                                <p className="Review_who">{data.who}</p>
                                <img id={index} alt="" src={trash} className="Review_delete" onClick={(e) => { DeleteReview(e.currentTarget.id) }} />
                                <img id={index} alt="" src={exchange} className="Review_update" onClick={(e) => { UpdateReview(e.currentTarget.id) }} />
                            </div>
                        )
                    }
                    else {
                        return (
                            <div className="Review_line" key={index}>
                                <p className="Review_what">{data.what}</p>
                                <p className="Review_who">{data.who}</p>
                            </div>
                        )

                    }
                }
                )
                setshowReview(makeHTML);
            }
        })

        return () => {
            let newItemInfo = { ...ItemInfo, reply: temp }
            if (flag === false) {
                console.log("언마운트시 데이터 다시 저장")
                database.ref().child('boards').child(ItemInfo.id).set(
                    newItemInfo
                );
            }
            temp = [];
            console.log(temp);
        }
    }, [])




    return (
        <div className="BoardItemInfo_back">
            <p className="BoardItemInfo_title">{ItemInfo.title}</p>
            <div className="BoardItemInfo_header">
                <p>작성자 : {ItemInfo.writer}</p>
                <p>연락수단 : {ItemInfo.number}</p>
                <p>포지션 : {ItemInfo.position}</p>
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