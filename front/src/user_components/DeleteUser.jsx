import { useState } from "react";
import { useNavigate } from "react-router-dom";
 
function DeleteUser() {
    const [userId, setUserId] = useState("");
    const navigate = useNavigate();
 
    async function deleteUsers() {
        if (!userId) {
            alert("삭제할 아이디를 입력하세요.");
            return;
        }
        
        if (!window.confirm("정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
            return;
        }

        const res = await fetch ("http://localhost:8080/users/delete", {
            method: "DELETE",
            headers: { "Content-Type":"application/json" },
            body: JSON.stringify({user_id: userId})
        });

        const data = await res.json();
    
        alert(data.result ? "회원 삭제 완료" : "삭제 실패");
        if (data.result) navigate('/login');
    }

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
            <h1 style={{ marginBottom: '20px', color: '#ff6b6b' }}>회원 탈퇴</h1>
            <p style={{ marginBottom: '20px', color: '#666' }}>탈퇴를 원하시면 아이디를 입력해주세요.</p>

            <input 
                className="input" 
                value={userId} 
                onChange={(e) => setUserId(e.target.value)} 
                placeholder="삭제할 아이디 입력" 
                style={{ marginBottom: '15px' }}
            /> 
            
            <button className="btn" style={{ width: '100%', backgroundColor: '#ff6b6b' }} onClick={deleteUsers}>
                회원정보 삭제
            </button>
        </div>
    )
}

export default DeleteUser;