import { useState } from "react";
import { useNavigate } from "react-router-dom";
 
 
 function DeleteUser() {
    const [userId, setUserId] = useState("");
    const navigate = useNavigate();
 
 
 // 회원 삭제
    async function deleteUsers() {
        if (!userId) {
            alert("삭제할 아이디를 입력하세요.");
            return;
        }
        
        const res = await fetch ("http://localhost:8080/users/delete", {
            method: "DELETE",
            headers: { "Content-Type":"application/json" },
            body: JSON.stringify({user_id: userId})
        });

        const data = await res.json();
    
        alert(data.result ? "회원 삭제 완료" : "삭제 실패");
        navigate('/login');
    }

    return (
     // 삭제 div 
    <div>
            <h1>회원정보 삭제</h1>

            아이디: <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder= "삭제할 아이디를 입력하세요" /> <br />

            <button onClick={deleteUsers}>회원정보 삭제</button>


    </div>
    )

}

export default DeleteUser