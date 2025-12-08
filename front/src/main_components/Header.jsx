// import { useState,useEffect} from "react";
// import { Link } from "react-router-dom";


// function Header() {
//     const [search, setSearch] = useState("");
//     const [data, setData] = useState([]);
    
//     useEffect(() => {
//         async function test() {
//             const response = await fetch('http://localhost:8080/pro/products');
//             const data = await response.json();
//             setData(data);
//         }
       
//         test();
//     }, []);
//     //검색 필터링부분
//     //검색할때 해당 상품들만 골라주는 역할
//     const filterData = data.filter(item =>
//         (item.pName || "").toLowerCase().includes((search || "").toLowerCase())
//     );
//     //검색창 테스트 완료! ex)로션을 "로"만 쳐도 로션관련된거 나오게 출력
//     function onClick() {
//         console.log("검색",filterData)
//     }
//     return (
//         <>
//             <header id="Header">
//                 <div className="main">
//                     <ul>
//                         <li><Link to={"/regist"}>회원가입</Link></li>
//                         <li><Link to={"/login"}>로그인</Link></li>
//                         <li><Link to={"/cart"}>장바구니</Link></li>
//                         <li><Link to={"/settings"}>마이페이지</Link></li>
//                     </ul>
//                 </div>
//                 <div className="logo">
//                     <h1><Link to="/">로고</Link></h1>
//                     <input type="text" value={search}
//                         onChange={(e) => setSearch(e.target.value)} placeholder="상품 검색하세요" />
//                         <button value={search} onClick={onClick}>🔍</button>
//                 </div>
                
//                 <div className="menubox">
//                     <ul>
//                         <li><Link to="/">전체메뉴</Link></li>
//                     </ul>
//                     <ul>
//                         <li><Link to="/">베스트</Link></li>
//                     </ul>
//                     <ul>
//                         <li><Link to="/">신제품</Link></li>
//                     </ul>
//                     <ul>
//                         <li><Link to="/">고객지원</Link></li>
//                     </ul>
//                 </div>
//             </header>
//         </>
//     )
// }
// export default Header;

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    
    // 로그인 확인
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    
    const navigate = useNavigate();

    // ✅ 상품 데이터 로드
    useEffect(() => {
        async function fetchProducts() {
            const response = await fetch('http://localhost:8080/pro/products');
            const result = await response.json();
            setData(Array.isArray(result[0]) ? result[0] : result);
        }
        fetchProducts();
    }, []);

    // ✅ 로그인 상태 확인
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const name = localStorage.getItem('userName');
        
        if (userId) {
            setIsLoggedIn(true);
            setUserName(name || '사용자');
        }
    }, []);

    // ✅ 로그아웃 핸들러
    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        setIsLoggedIn(false);
        setUserName('');
        alert('로그아웃 되었습니다.');
        navigate('/');
    };

    // 검색 필터링
    const filterData = data.filter(item =>
        (item.pName || "").toLowerCase().includes((search || "").toLowerCase())
    );

    function onClick() {
        console.log("검색", filterData);
    }

    return (
        <>
            <header id="Header">
                <div className="main">
                    <ul>
                        {isLoggedIn ? (
                            <>
                                <li style={{ fontWeight: 'bold' }}>{userName}님</li>
                                <li><button onClick={handleLogout}>로그아웃</button></li>
                                <li><Link to="/cart">장바구니</Link></li>
                                <li><Link to="/settings">마이페이지</Link></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/regist">회원가입</Link></li>
                                <li><Link to="/login">로그인</Link></li>
                                <li><Link to="/cart">장바구니</Link></li>
                                <li><Link to="/settings">마이페이지</Link></li>
                            </>
                        )}
                    </ul>
                </div>
                <div className="logo">
                    <h1><Link to="/">로고</Link></h1>
                    <input 
                        type="text" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)} 
                        placeholder="상품 검색하세요" 
                    />
                    <button onClick={onClick}>🔍</button>
                </div>
                
                <div className="menubox">
                    <ul>
                        <li><Link to="/">전체메뉴</Link></li>
                    </ul>
                    <ul>
                        <li><Link to="/">베스트</Link></li>
                    </ul>
                    <ul>
                        <li><Link to="/">신제품</Link></li>
                    </ul>
                    <ul>
                        <li><Link to="/">고객지원</Link></li>
                    </ul>
                </div>
            </header>
        </>
    )
}

export default Header;