import React, { useEffect } from 'react';
import './App.css';
import ourstudylogo from './Images/ourstudylogo.png';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import hamburger from './Images/hamburger.png';
// Google 로그인 관련
import GoogleSignin from './PageComponent/GoogleSignin';
import { auth } from './firebase_config';

// redux 관련 import
import { connect } from 'react-redux';
import { actionCreators } from './store';


// router 관련
import { BrowserRouter as Router, Route, Link, useHistory } from 'react-router-dom';
import Board from './UtilComponent/Board';
import MakeBoard from './PageComponent/MakeBoard';
import MyPage from './PageComponent/MyPage';


function App(props) {

  let history = useHistory();

  /* 모바일 버전 햄버거 메뉴 관련 */
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  


  useEffect(() => {
    console.log("APP.js의 useEffect실행")
    console.log(`store의 LoginStatus = ${props.StoreData.LoginStatus}`)
  }, [props.StoreData.LoginStatus]);


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
          <Link className="logo_img" to="/">
            <img alt={1} src={ourstudylogo} className="logo_img"/>
          </Link>
          <Link className="linkitem" to="/mypage">{props.StoreData.LoginStatus.displayName}님</Link>
          <Link className="linkitem" to="/write">Write</Link>
          <Link className="linkitem" to="/">Board</Link>
        </div>

        <div className="NavibarRouter_Mobile">
          <button className="logoutBtn2" onClick={() => {
            auth.signOut();
            props.updateState(false, props.StoreData.fromDatabase);
            console.log(props.StoreData.LoginStatus);
          }}>LogOut</button>
          
          <Link className="Mobile_linkitem" to="/">
            <img className="NavibarRouter_Mobile_img" alt={1} src={ourstudylogo}/>
          </Link>
          <Button className="NaviMenu" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
            <img className="hamburger_menu" src={hamburger} alt={2} />
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}><Link className="Mobile_linkitem" to="/mypage">{props.StoreData.LoginStatus.displayName}님</Link></MenuItem>
            <MenuItem onClick={handleClose}><Link className="Mobile_linkitem" to="/write">글쓰기</Link></MenuItem>
            <MenuItem onClick={handleClose}><Link className="Mobile_linkitem" to="/">게시판</Link></MenuItem>
          </Menu>
        </div>
        <div id="boardwindow" className="ContentRouter">
          <Route exact path="/" render={() => <Board />} />
          <Route path="/write" render={() => <MakeBoard />} />
          <Route path="/mypage" render={() => <MyPage />} />
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