import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header({ isLoggedIn, userName, onLogout }) {
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProducts() {
            const response = await fetch('http://localhost:8080/pro/products');
            const result = await response.json();
            setData(Array.isArray(result[0]) ? result[0] : result);
        }
        fetchProducts();
    }, []);

    const handleLogout = () => {
        onLogout();
        alert('로그아웃 되었습니다.');
        navigate('/');
    };

    const filterData = data.filter(item =>
        (item.name || "").toLowerCase().includes((search || "").toLowerCase())
    );

    function onClick() {
        console.log("검색", filterData);
    }

    return (

        <header className="header">

            <div className="logo">
                <Link to="/" style={{textDecoration:'none', color:'var(--main-color)'}}>SORA MARKET</Link>
            </div>


            <div style={{display:'flex', gap:'5px', flexGrow: 1, maxWidth:'400px', margin:'0 20px'}}>
                <input 
                    type="text" 
                    className="input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)} 
                    placeholder="상품을 검색하세요" 
                />
                <button className="btn" onClick={onClick}>🔍</button> 
            </div>
            
            <nav className="nav">
                {isLoggedIn ? (
                    <>
                        <span style={{ fontWeight: 'bold', color:'var(--main-color)' }}>{userName}님</span>
                        <Link to="/cart">장바구니</Link>
                        <Link to="/settings">마이페이지</Link>
                        <button className="btn" style={{padding:'5px 10px', fontSize:'12px'}} onClick={handleLogout}>로그아웃</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">로그인</Link>
                        <Link to="/regist">회원가입</Link>
                        <Link to="/cart">장바구니</Link>
                    </>
                )}
            </nav>
        </header>
    )
}
export default Header;