import {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";



function Cart() {
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  const [items, setItems] = useState([]);
  const [checkItem,setCheckItem] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    fetchCart();
  }, []);
  
  const fetchCart = async () => {
    try {
      const response = await fetch(`http://localhost:8080/cart/${userId}`);
      
      if (!response.ok) {
        throw new Error('장바구니 조회 실패');
      }
      
      const data = await response.json();
    
      const cartItems = Array.isArray(data[0]) ? data[0] : data;
      setItems(cartItems);
      setCheckItem(cartItems.map(item => item.id));
    } catch (error) {
      console.error('장바구니 조회 실패:', error);
      setItems([]);
    }
  };
  
  const checkProduct = (id) =>{
    setCheckItem(prev=>prev.includes(id)
      ? prev.filter(item=>item!==id)
      : [...prev, id]);
  };

  const allCheckProduct = (e)=>{
    if(e.target.checked){
      const avliableItems = items
      .filter(item => item.stock > 0)
      .map(item => item.id);
      setCheckItem(items.map(item=>item.id));
    } else{
      setCheckItem([]);
    }
  };

  const cartDelete = async (pId) => {
    try {
      const response = await fetch('http://localhost:8080/cart/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pId, userId }),
      });
      const result = await response.json();
      if (result.result) {
        fetchCart();
      }
    } catch (error) {
      console.error('장바구니 삭제 실패:', error);
    }
  };

    async function updateAmount(id, newAmount) {
    try{
      const response = await fetch('http://localhost:8080/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          pId: id, 
          amount: newAmount,
          userId: userId}),
      });
      const result = await response.json();
      if (result.result) {
        fetchCart();
      }else{
        alert(result.message || result.error);
      }
      
    }catch(error){
      console.error('수량 변경 실패:', error);
    }
  };

  const totalAmount = items
    .filter(item => checkItem.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.amount, 0);

    const checkedCount = checkItem.length;

  const order = () => {
    if(checkedCount === 0){
      alert('주문할 상품을 선택해주세요');
      return;
    }
    const selectedItems = items.filter(item => checkItem.includes(item.id));
    const outStock = selectedItems.filter(item => item.stock === 0 || item.stock < item.amount);

    if(outStock.length > 0){
      const itemNames = outStock.map(item => item.name).join(', ');
      alert(`재고가 부족합니다:\n${itemNames}\n\n 품절상태`)
      return;
    }
    navigate('/order', { state: { selectedItems: selectedItems } });
  }
  return (
    <>
      <div>
        <h2>장바구니</h2>
      </div>
      <div>
        {items.length === 0 ? (
          <div>
            <p>장바구니가 비었습니다.</p>
          </div>
        ):(
          <>
          <div>
            <label>
              <input type="checkbox" 
              onChange={allCheckProduct} 
              checked={checkedCount === items.length}/>전체선택({checkedCount}/{items.length})
            </label>
          </div>
          <ul>
            {items.map((item)=>(
              <li key={item.id}>
                <div>
                  <input type="checkbox" 
                    checked={checkItem.includes(item.id)} 
                    onChange={() => checkProduct(item.id)}/>
                  <img src={item.image} alt={item.name}
                  style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  opacity: item.stock === 0 ? 0.5 : 1
                  }}/>
                </div>
                <div>
                  <p>{item.name}</p>
                  <p>{item.price.toLocaleString()}원</p>
                  {item.stock === 0 ? (
                    <p style={{ color: 'red', fontWeight: 'bold' }}>❌ 일시 품절</p>
                  ) : item.stock <= 5 ? (
                    <p style={{ color: 'orange' }}>🔥품절 임박🔥 재고: {item.stock}개</p>
                  ) : (
                    <p style={{ color: 'green' }}></p>
                  )}
                  <div>
                    <button onClick={() => updateAmount(item.id, item.amount - 1)}
                      disabled={item.amount <= 1}>-</button>
                    <span>{item.amount}</span>
                    <button onClick={() => updateAmount(item.id, item.amount + 1)}>+</button>
                  </div>
                  <button onClick={() => cartDelete(item.id)}>삭제</button>
                </div>
              </li>
            ))}
          </ul>
          </>
        )}
      </div>
      <div>
        <h3>총 합계: {totalAmount.toLocaleString()}원</h3>
        <button onClick={order}>주문하기</button>
      </div>
    </>
  )
}

export default Cart 