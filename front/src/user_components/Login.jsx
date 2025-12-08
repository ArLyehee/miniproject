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
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id,
                    pw: pw
                })
            });
            
            const data = await response.json();
            
            if (data.result) {
                const userId = data.userId || id;
                const userName = data.userName;
                
                // localStorage 저장
                localStorage.setItem('userId', userId);
                localStorage.setItem('userName', userName);
                
                // ✅ 부모 컴포넌트에 로그인 상태 알림
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
        <div>
            <h1>로그인 페이지</h1>
            아이디<input placeholder="아이디를 입력해주세요" onChange={(e) => setId(e.target.value)} /><br />
            비밀번호<input type="password" placeholder="비밀번호를 입력해주세요" onChange={(e) => setPw(e.target.value)} />
            <button onClick={handleLogin}>로그인</button>
            <button onClick={() => navigate('/regist')}>회원가입</button>
        </div>
    )
}

export default Login