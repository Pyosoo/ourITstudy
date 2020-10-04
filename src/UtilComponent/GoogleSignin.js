import React, { useEffect, useState } from 'react';

import 'firebase/firestore';
import 'firebase/auth';
import { signInWithGoogle } from '../firebase_config';
import { auth } from '../firebase_config';

import './GoogleSignin.css';

// redux 관련 import
import { connect } from 'react-redux';
import { actionCreators } from '../store';

// Github 로그인 관련


function GoogleSignin(props){

  useEffect(()=>{
    auth.onAuthStateChanged(user => {
      if(user != null){
        props.updateState(user.displayName, props.StoreData.fromDatabase);
        console.log(`${user.displayName} 님 로그인하셨습니다`);
      }
    })
  })
   

    return (
      <div className="LoginPage_Container">
        <div className="Login_ImageBox"></div>
        <button onClick={signInWithGoogle} className="Google_Login_Btn Login_Btn"></button>
      </div>
    )
  }

// Redux state로부터 home에 prop으로써 전달한다는 뜻.
function mapStateToProps(state, ownProps){
    return { StoreData : state };   //toDos에 state를 가져온다.
  }
  
  // reducer에 action을 알리는 함수 
  function mapDispatchToProps(dispatch){
    return {
        updateState : status => dispatch(actionCreators.updateState(status))
     };
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(GoogleSignin);