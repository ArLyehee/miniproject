import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header({ isLoggedIn, userName, onLogout }) {
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    // 상품 데이터 로드
    useEffect(() => {
        async function fetchProducts() {
            const response = await fetch('http://localhost:8080/pro/products');
            const result = await response.json();
            setData(Array.isArray(result[0]) ? result[0] : result);
        }
        fetchProducts();
    }, []);

    // 로그아웃 핸들러
    const handleLogout = () => {
        onLogout();  // ✅ 부모 함수 호출
        alert('로그아웃 되었습니다.');
        navigate('/');
    };

    // 검색 필터링
    const filterData = data.filter(item =>
        (item.name || "").toLowerCase().includes((search || "").toLowerCase())
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
                                <li><Link to="/login">로그인</Link></li>
                                <li><Link to="/regist">회원가입</Link></li>
                                <li><Link to="/cart">장바구니</Link></li>
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