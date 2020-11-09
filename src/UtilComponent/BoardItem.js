import React, { useEffect, useState } from 'react';
import './BoardItem.css';
import menu from '../Images/menu.png';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Modal } from 'antd';
import 'antd/dist/antd.css';

// redux 관련 import
import { connect } from 'react-redux';
import { actionCreators } from '../store';

import firebase from 'firebase';
import { auth } from '../firebase_config';
let database = firebase.database();



function BoardItem(props) {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [visible, setvisible] = useState(false);
    const [like, setlike] = useState('☆');
    const [newtitle, setnewtitle] = useState(props.title);
    const [newcontent, setnewcontent] = useState(props.content);
    const [newnumber, setnewnumber] = useState(props.number);
   

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // firebase realtime database에서 삭제하고 새로고침시킴(이게 고민)
    const handleCloseAndDelete = () => {
        setAnchorEl(null);
        console.log(props);
        database.ref().child('boards').child(props.id).remove();
        alert("삭제되었습니다.");
        window.location.replace("/");
    };
    // 수정버튼 클릭하면
    const handleCloseAndUpdate = (e) => {
        setAnchorEl(null);
        showModal();
        setvisible(true);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }


    // ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●수정관련
    const showModal = () => {
        setvisible(true);
    };
    const handleOk = e => {
        // 수정 사항 다적으면
        if (newtitle !== null && newcontent !== null) {
            database.ref().child('boards').child(props.id).set({
                writer: props.writer,
                region: props.region,
                position: props.position,
                content: newcontent,
                title: newtitle,
                email: props.email,
                day: props.day,
                number : props.number,
                likePeople: props.likePeople
            });
            alert("수정되었습니다.");
            setvisible(false);
            window.location.replace("/");
        }
        else if (newtitle === null) {
            alert("변경할 제목을 입력해주세요.");
        }
        else if (newcontent === null) {
            alert("변경할 소개을 입력해주세요.");
        }

    };
    const handleCancel = e => {
        console.log(e);
        setvisible(false);
    };
    const handleNewTitleChange = e => {
        setnewtitle(e.target.value);
    }
    const handleNewContentChange = e => {
        setnewcontent(e.target.value);
    }
    const handleNewNumberChange = e => {
        setnewnumber(e.terget.value);
    }

    const handleChangeLike = e => {
        if (props.email === auth.currentUser.email) {
            alert("자신의 글은 스크랩할 수 없습니다.");
        }
        else {
            if (like === '☆') {
                //해당 글에 좋아요한 인원의 eamil 추가해줘야함
                let newlikePeople = props.likePeople;
                newlikePeople.push(auth.currentUser.email);
                database.ref().child('boards').child(props.id).set({
                    writer: props.writer,   
                    region: props.region,
                    position: props.position,
                    content: props.content,
                    title: props.title,
                    email: props.email,
                    day: props.day,
                    number: props.number,
                    likePeople: newlikePeople
                });
                e.preventDefault(); 
                alert("스크랩했습니다. My페이지에서 확인할 수 있습니다.");
                console.log(`${props.id} 글을 ${auth.currentUser.email}이 스크랩.`)
                setlike('★');
            } else {
                //해당 글에 좋아요한 인원의 eamil 을 삭제해줘야함
                let newlikePeople = props.likePeople.filter(data => data !== auth.currentUser.email);
                database.ref().child('boards').child(props.id).set({
                    writer: props.writer,
                    region: props.region,
                    position: props.position,
                    content: props.content,
                    title: props.title,
                    email: props.email,
                    day: props.day,
                    number: props.number,
                    likePeople: newlikePeople
                });
                e.preventDefault(); 
                alert("스크랩 해제하였습니다.");
                console.log(`${props.id} 글을 ${auth.currentUser.email}이 스크랩 취소.`)
                setlike('☆');
            }
        }

    }


    const [BoarditemContentDP, setBoarditemContentDP] = useState('Board_item_Content_hide');

    const ShowContent = () => {
        if (BoarditemContentDP === 'Board_item_Content_hide')
            setBoarditemContentDP('Board_item_Content_show');
        else setBoarditemContentDP('Board_item_Content_hide');
    }

    let mine = props.mine;

    // 좋아요한 글이라면 채워진 별표로 바꿔주는 것
    useEffect(() => {
        if (props.likePeople !== undefined && props.likePeople.find(data => data === auth.currentUser.email) !== undefined) {
            setlike('★')
        }
    }, [])

    return (
        <div className="Board_item_Box">
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleCloseAndUpdate}>수정</MenuItem>
                <MenuItem onClick={handleCloseAndDelete}>삭제</MenuItem>
            </Menu>
            <Modal
                title="내 글 수정하기"
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p className="newheader">제목</p>
                <input className="newtitle_box" value={newtitle} placeholder={props.title} onChange={handleNewTitleChange}></input>
                <p className="newheader2">내용</p>
                <textarea className="newcontent_box" value={newcontent} placeholder={props.content} onChange={handleNewContentChange}></textarea>
                <p className="newheader3">연락수단</p>
                <input className="newnumber_box" value={newnumber} placeholder={props.number} onChange={handleNewNumberChange}></input>           
            </Modal>

            <div className="Board_item_Top"></div> {/* 두루마리의 맨위 기둥 이미지 */}
            <div className={BoarditemContentDP} onClick={ShowContent}>
                <div className="Board_item_header_line"> 
                    <p className="Board_item_header_item "><span className="Board_item_header_span">작성자</span> : {props.writer}</p> 
                    <p className="Board_item_header_item "><span className="Board_item_header_span">일시 </span>: {props.day}</p>
                    <p className="Board_item_header_item "><span className="Board_item_header_span">연락처</span> : {props.number}</p>
                </div>
                <p className="Board_item content_box Board_item_Content_span">{props.content}</p> <br />
            </div>
            <div className="Board_item_line">
                <div className="Board_item title_box" onClick={ShowContent}>{props.title}</div>
                <div className="Board_item region_box">{props.region}</div>
                <div className="Board_item position_box">{props.position}</div>
                <img alt="2" className="mine_menu" style={{ display: mine === "yes" ? 'inline-block' : 'none' }} src={menu} onClick={handleClick} />
                <span className="Board_item_like" onClick={handleChangeLike}> {like} </span>
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

export default connect(mapStateToProps, mapDispatchToProps)(BoardItem);