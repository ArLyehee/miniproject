import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
    const navigate = useNavigate();
    const [id, setId] = useState("");
    const [pw, setPw] = useState("");

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:8080/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id, pw: pw })
            });
            
            const data = await response.json();
            
            if (data.result) {
                const userId = data.userId || id;
                const userName = data.userName;
                localStorage.setItem('userId', userId);
                localStorage.setItem('userName', userName);
                onLogin(userId, userName);
                alert('로그인 성공!');
                navigate('/');
            } else {
                alert('아이디 또는 비밀번호가 틀렸습니다.');
            }
        } catch (error) {
            console.error(error);
            alert('로그인 실패');
        }
    }

    return (
        // 레이아웃을 위해 최대 너비 제한
        <div style={{maxWidth:'400px', margin:'50px auto'}}>
            <h1 style={{textAlign:'center', marginBottom:'20px'}}>로그인</h1>
            
            <div style={{marginBottom:'10px'}}>
                <input className="input" placeholder="아이디" onChange={(e) => setId(e.target.value)} />
            </div>
            <div style={{marginBottom:'20px'}}>
                <input className="input" type="password" placeholder="비밀번호" onChange={(e) => setPw(e.target.value)} />
            </div>
            
            <button className="btn" style={{width:'100%', marginBottom:'10px'}} onClick={handleLogin}>로그인</button>
            <button className="btn" style={{width:'100%', backgroundColor:'#aaa'}} onClick={() => navigate('/regist')}>회원가입</button>
        </div>
    )
}

export default Login