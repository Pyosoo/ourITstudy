import React, { useEffect, useState } from 'react';
import './MyPage.css';

// router 관련 import
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Scrap from '../UtilComponent/Scrap.js';
import MyBoard from '../UtilComponent/MyBoard.js';


function MyPage(props) {
    console.log("MyPage 실행")
    const [link1, setlink1] = useState('OnPage1');
    const [link2, setlink2] = useState('MyPage_linkitem');

    useEffect(()=>{
        console.log("MyPage의 useEffect")
    },[])

    return (
        <Router basename="/mypage">
            <div className="MyPage_Header">
                <Link className={link1} to="/" onClick={()=>{
                    setlink1('OnPage1');
                    setlink2('MyPage_linkitem')
                }}>나의글</Link>
                <Link className={link2} to="/scrap" onClick={()=>{
                    setlink2('OnPage2');
                    setlink1('MyPage_linkitem')
                }}>스크랩</Link>
            </div>
            <div className="MyPage_ContentBox">
                <Route exact path="/" render={() => <MyBoard />} />
                <Route path="/scrap" render={() => <Scrap />} />
            </div>
        </Router>



    )
}

export default MyPage;