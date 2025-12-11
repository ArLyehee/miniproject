import { useState, useEffect, useContext } from "react";
import { AuthContext } from '../context/AuthContext';

function Editprouct() {
    const { user } = useContext(AuthContext);

    function back() {
        history.back();
    }
    
    const [newStock, setNewStock] = useState(0);
    const [list, setList] = useState([]);
        useEffect(() => {
            async function load() {
                const response = await fetch(`http://localhost:8080/main/dbprod`);
                const data = await response.json();
                setList(data);
            }
            load();
        }, []);
    //상품재고 수정
    function update(pId, stock) {
    fetch("http://localhost:8080/main/dbprod", {
        method: "PUT",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pId, stock })
    })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            alert(`재고가 ${stock}개로 수정되었습니다.`);
            setList(list.map(item => item.pId === pId ? { ...item, stock } : item));
        } else {
            alert("재고 수정 실패");
        }
    })
    .catch(err => console.error(err));
    }


    return(
        <>
        <h2 style={{marginBottom: '20px'}}>상품 관리(재고수정)</h2>
        <button className="btn" onClick={back}>이전</button>
        <div className="grid" style={{ marginRight: '10px', fontWeight: 'bold' }}>
            {list.map(item => (
                <div key={item.id} className="card">
                    <img 
                    src={item.image} 
                    alt={item.name} 
                    className="card-img"
                    />
                    <p>상품명: {item.name}</p>
                    <p>상품 설명: {item.description}</p>
                    <p>카테고리: {item.category}</p>
                    <p>가격: {item.price}</p>
                    <p>현재 재고:{item.stock}</p>
                    <input 
                        className="input" 
                        type="number" 
                        placeholder="수량"
                    onChange={(e) =>setNewStock(e.target.value) }/>
                    <button className="btn"onClick={() => update(item.pId, newStock)}>수정</button>
                </div>
            ))}
        </div>     
        </>
    )
}
export default Editprouct;