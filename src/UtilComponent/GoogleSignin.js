import React, { useEffect, useState } from 'react';
import 'firebase/firestore';
import 'firebase/auth';
import { signInWithGoogle } from '../firebase_config';
import { auth } from '../firebase_config';
import './GoogleSignin.css';

// redux 관련 import
import { connect } from 'react-redux';
import { actionCreators } from '../store';

function GoogleSignin(props){

    useEffect(()=>{
        auth.onAuthStateChanged(user => {
            props.updateState(user);
        })
    })

    return (
      <div className="LoginPage_Container">
        <div className="Login_ImageBox"></div>
        <button type="submit" value="Submit Form" className="Login_Btn">SIGN IN</button>
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