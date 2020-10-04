import React, { useEffect, useState } from 'react';
import BoardItem from './UtilComponent/BoardItem';
import './App.css';
import ourstudylogo from './Images/ourstudylogo.png';
// Google 로그인 관련
import GoogleSignin from './UtilComponent/GoogleSignin';
import { auth } from './firebase_config';

// redux 관련 import
import { connect } from 'react-redux';
import { actionCreators } from './store';


// router 관련
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Board from './UtilComponent/Board';
import MakeBoard from './UtilComponent/MakeBoard';
import MyPage from './UtilComponent/MyPage';




function App(props) {



  // ●●●●●●●●●●●●●●●●●●●●●●●●● 유저 변화 있을시 자동 실행 ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●
  auth.onAuthStateChanged(user => {
    console.log(`user =  ${user}`);
    console.log(`LoginStatus = ${props.StoreData.LoginStatus}`);
  })
  //●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●



  if (props.StoreData.LoginStatus === false || props.StoreData.LoginStatus === null || props.StoreData.LoginStatus === undefined) {
    return (
      <GoogleSignin />
    )
  } else {
    return (
      <Router>
        <div className="NavibarRouter">
          <button className="logoutBtn" onClick={() => {
                console.log(props.StoreData.LoginStatus);
                auth.signOut();
                props.updateState(false, props.StoreData.fromDatabase);
                console.log(props.StoreData.LoginStatus);
            }}>EXIT</button>
          
          <img src={ourstudylogo} className="logo_img"/>
          <Link className="linkitem" to="/mypage">My</Link>
          <Link className="linkitem" to="/write">Write</Link>
          <Link className="linkitem" to="/">Board</Link>
        </div>
        <div className="ContentRouter">
          <Route exact path="/" render={()=> <Board />} />
          <Route path="/write" render={()=> <MakeBoard />} />
          <Route path="/mypage" render={()=> <MyPage />} />
        </div>
      </Router>
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

export default connect(mapStateToProps, mapDispatchToProps)(App);