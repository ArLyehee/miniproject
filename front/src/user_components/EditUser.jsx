// import { useState } from "react";



// function EditUser() {
//     const [pw, setPw] = useState("");
//     const [nickname, setNickname] = useState(""); 
//     const [name, setName] = useState("");
//     const [gender, setGender] = useState("");
//     const [dob, setDob] = useState("");
//     const [phone, setPhone] = useState("");
    
//     // 회원정보 수정
//     async function updateUsers() {
        
//         const res = await fetch("http://localhost:8080/users/edit", {
//             method: "PUT",
//             headers: { "Content-Type":"application/json" },
//             body: JSON.stringify({
//                 user_pw: pw,
//                 user_nickname:nickname,
//                 user_name: name,
//                 user_gender: gender,
//                 user_dob: dob,
//                 user_phone: phone
//             })
//         });

//         const data = await res.json();
//             alert (data.result ? "회원 정보 수정 완료":"수정 실패");
//     }        
// return (
//             // 수정 div 
//             <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            
//             <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>회원정보 수정</h1>

//             <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//                 <div>
//                     <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>닉네임 변경</label>
//                     <input className="input" value={nickname} placeholder="변경할 닉네임" onChange={(e)=>setNickname(e.target.value)} />
//                 </div>

//                 <div>
//                     <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>비밀번호 변경</label>
//                     <input className="input" type="password" value={pw} placeholder="변경할 비밀번호" onChange={(e)=>setPw(e.target.value)} />
//                 </div>

//                 <div>
//                     <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>생년월일</label>
//                     <input value={dob} type="date" placeholder="YYYY-MM-DD" onChange={(e)=>setDob(e.target.value)}/> 
//                 </div>

//                 <div>
//                     <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>이름</label>
//                     <input className="input" value={name} placeholder="이름" onChange={(e)=>setName(e.target.value)} />
//                 </div>

//                 <div>
//                     <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>성별</label>
//                     <div style={{ display: 'flex', gap: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
//                         <label style={{ cursor: 'pointer' }}>
//                             <input type="radio" name="gender" value="M" onChange={(e)=>setGender(e.target.value)} /> 남성
//                         </label>
//                         <label style={{ cursor: 'pointer' }}>
//                             <input type="radio" name="gender" value="F" onChange={(e)=>setGender(e.target.value)} /> 여성
//                         </label>
//                     </div>
//                 </div>

//                 <div>
//                     <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>전화번호</label>
//                     <input className="input" type="tel" value={phone} placeholder="010-0000-0000" onChange={(e) => setPhone(e.target.value)} />
//                 </div>

//                 <button className="btn" style={{ marginTop: '20px' }} onClick={updateUsers}>수정하기</button>
//             </div>
//         </div>
// );
// }
//     export default EditUser

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function EditUser() {
    const [pw, setPw] = useState("");
    const [nickname, setNickname] = useState(""); 
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [dob, setDob] = useState("");
    const [phone, setPhone] = useState("");
    const navigate = useNavigate();
    
    // 기존 사용자 정보 불러오기
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setNickname(user.nickname || '');
            setName(user.name || '');
            setGender(user.gender || '');
            setDob(user.dob || '');
            setPhone(user.phone || '');
        }
    }, []);

    // 회원정보 수정
    async function updateUsers() {
        try {
            // 필수 필드 검증
            if (!nickname || !name || !phone) {
                alert('필수 정보를 입력해주세요.');
                return;
            }

            const requestBody = {
                user_nickname: nickname,
                user_name: name,
                user_gender: gender,
                user_dob: dob,
                user_phone: phone
            };

            // 비밀번호가 입력된 경우에만 추가
            if (pw && pw.trim() !== '') {
                requestBody.user_pw = pw;
            }

            const response = await fetch('http://localhost:8080/users/edit', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if (data.result) {
                alert('정보가 수정되었습니다.');
                
                // localStorage 업데이트
                const storedUser = localStorage.getItem('user');
                const user = storedUser ? JSON.parse(storedUser) : {};
                
                const updatedUser = {
                    ...user,
                    nickname: nickname,
                    name: name,
                    gender: gender,
                    dob: dob,
                    phone: phone
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                // 비밀번호 변경 시 재로그인 필요
                if (pw && pw.trim() !== '') {
                    alert('비밀번호가 변경되었습니다. 다시 로그인해주세요.');
                    localStorage.removeItem('user');
                    navigate('/login');
                } else {
                    navigate('/mypage');
                }
            } else {
                alert(data.error || '수정 실패');
            }
        } catch (error) {
            console.error('수정 오류:', error);
            alert('서버 오류가 발생했습니다.');
        }
    }

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>회원정보 수정</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>닉네임 변경 *</label>
                    <input 
                        className="input" 
                        value={nickname} 
                        placeholder="변경할 닉네임" 
                        onChange={(e)=>setNickname(e.target.value)} 
                    />
                </div>

                <div>
                    <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>비밀번호 변경 (선택사항)</label>
                    <input 
                        className="input" 
                        type="password" 
                        value={pw} 
                        placeholder="변경할 비밀번호 (변경 시에만 입력)" 
                        onChange={(e)=>setPw(e.target.value)} 
                    />
                    <small style={{color:'#666', fontSize:'12px'}}>
                        비밀번호를 변경하지 않으려면 비워두세요.
                    </small>
                </div>

                <div>
                    <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>생년월일</label>
                    <input 
                        className="input"
                        value={dob} 
                        type="date" 
                        onChange={(e)=>setDob(e.target.value)}
                    /> 
                </div>

                <div>
                    <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>이름 *</label>
                    <input 
                        className="input" 
                        value={name} 
                        placeholder="이름" 
                        onChange={(e)=>setName(e.target.value)} 
                    />
                </div>

                <div>
                    <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>성별</label>
                    <div style={{ display: 'flex', gap: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
                        <label style={{ cursor: 'pointer' }}>
                            <input 
                                type="radio" 
                                name="gender" 
                                value="M" 
                                checked={gender === 'M'}
                                onChange={(e)=>setGender(e.target.value)} 
                            /> 남성
                        </label>
                        <label style={{ cursor: 'pointer' }}>
                            <input 
                                type="radio" 
                                name="gender" 
                                value="F" 
                                checked={gender === 'F'}
                                onChange={(e)=>setGender(e.target.value)} 
                            /> 여성
                        </label>
                    </div>
                </div>

                <div>
                    <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>전화번호 *</label>
                    <input 
                        className="input" 
                        type="tel" 
                        value={phone} 
                        placeholder="010-0000-0000" 
                        onChange={(e) => setPhone(e.target.value)} 
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button 
                        className="btn" 
                        onClick={updateUsers}
                        style={{ flex: 1 }}
                    >
                        수정하기
                    </button>
                    <button 
                        className="btn" 
                        onClick={() => navigate(-1)}
                        style={{ flex: 1, backgroundColor: '#aaa' }}
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditUser;

