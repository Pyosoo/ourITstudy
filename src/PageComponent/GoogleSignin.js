import React from 'react';

import 'firebase/firestore';
import 'firebase/auth';
import { signInWithGoogle , auth} from '../firebase_config';
import firebase from 'firebase';
import './GoogleSignin.css';


// redux 관련 import
import { connect } from 'react-redux';
import { actionCreators } from '../store';

let provider = new firebase.auth.GithubAuthProvider();

function GoogleSignin(props){

  const signInWithGithub = () => {
    firebase.auth().signInWithPopup(provider).then(function(result) {
      let user = result.user;
      console.log(user);
      // ...
    }).catch(function(error) {
      console.log(error);
    });
  }
 
  

    auth.onAuthStateChanged(user => {
      if(user != null){
        props.updateState(auth.currentUser, props.StoreData.fromDatabase);
        console.log(auth.currentUser);
      }
    })
   

    return (
      <div className="LoginPage_Container">
        <div className="Login_ImageBox"></div>
        <button onClick={signInWithGoogle} className="Google_Login_Btn Login_Btn"></button>
        <button onClick={signInWithGithub} className="Github_Login_Btn Login_Btn"></button>
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