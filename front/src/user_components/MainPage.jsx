import { useNavigate } from "react-router-dom";

function MainPage() {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName');

    return (
        <div style={{maxWidth:'600px', margin:'50px auto', textAlign:'center'}}>
            <h1 style={{marginBottom:'10px'}}>마이 페이지</h1>
            <p style={{color:'#666', marginBottom:'40px'}}>반갑습니다, <strong>{userName}</strong>님!</p>
            
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
                <div className="card" style={{padding:'30px', cursor:'pointer'}} onClick={() => navigate('/settings')}>
                    <h3 style={{marginBottom:'10px'}}>⚙️ 회원 설정</h3>
                    <p style={{fontSize:'14px', color:'#888'}}>내 정보 수정 및 탈퇴</p>
                </div>

                <div className="card" style={{padding:'30px', cursor:'pointer'}} onClick={() => navigate('/cart')}>
                    <h3 style={{marginBottom:'10px'}}>🛒 장바구니</h3>
                    <p style={{fontSize:'14px', color:'#888'}}>담아둔 상품 확인</p>
                </div>
            </div>
        </div>
    )
}

export default MainPage