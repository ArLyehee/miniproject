import {useState,useEffect} from 'react';
import {useNavigate, useLocation} from "react-router-dom";


const Order = () => {

  const [items, setItems] = useState([]);
  const [selectPay, setSelectPay] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const [zipCode, setZipCode] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  const [deliveryName, setDeliveryName] = useState('');
  const [recipient, setRecipient] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryMessage, setDeliveryMessage] = useState('');

  useEffect(() => {
      if(location.state?.selectedItems){
        setItems(location.state.selectedItems);
      } else {
        alert('주문할 상품이 없습니다. 다시 선택해주세요.');
        navigate('/cart');
      }
    }, [location, navigate]);

  const openAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function(data) {
        let addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
        setZipCode(data.zonecode);
        setAddress(addr);
        document.getElementById('detailAddress').focus();
      }
    }).open();
  };

  const cartPage = () => {
    window.history.back();
  }
    async function pass(){
    if (!zipCode || !address) {
      alert('배송지 주소를 입력해주세요');
      return;
    }
    if (!deliveryName) {
      alert('배송지명을 입력해주세요');
      return;
    }
    if (!recipient) {
      alert('받는 분을 입력해주세요');
      return;
    }
    if (!phone) {
      alert('연락처를 입력해주세요');
      return;
    }
    if (!selectPay) {
      alert('결제 방법을 선택해주세요');
      return;
    }

    try {
      const orderData = {
        userId: userId,
        zipCode,
        address,
        detailAddress,
        deliveryName,
        recipient,
        phone,
        deliveryMessage,
        paymentMethod: selectPay,
        items,
        totalAmount
      };

      const response = await fetch('http://localhost:8080/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (response.ok) {
        alert('주문이 완료되었습니다!');
        navigate('/done', { state: { orderId: result.orderId } });
      } else {
        alert(result.error || '주문 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('주문 오류:', error);
      alert('주문 처리 중 오류가 발생했습니다.');
    }
  }
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.amount, 0);

  
  return (
    <>
    <h2>주문/결제</h2>
    <button onClick={cartPage}>뒤로 돌아가기</button>
        <div className="section shipping-info">
        <label>우편번호:</label>
        <div>
          <input type="text" value={zipCode} readOnly placeholder="우편번호"/>
          <button type="button" onClick={openAddressSearch}>주소 검색</button>
        </div>
        <label>주 소:</label>
        <input type="text" value={address} readOnly placeholder="주소"/>
        <label>상세주소:</label>
        <input 
          type="text" 
          id="detailAddress"
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
          placeholder="상세주소"/>
        <br/>
        <label>배송지명:</label>
        <input type="text" 
          placeholder="배송지명"
          value={deliveryName}
          onChange={(e)=>setDeliveryName(e.target.value)}/>
        <label>받는분:</label>
        <input type="text" 
          placeholder="받는분"
          value={recipient}
          onChange={(e)=>setRecipient(e.target.value)}/>
        <label>연락처:</label>
        <input type="text" 
          placeholder="연락처"
          value={phone}
          onChange={(e)=>setPhone(e.target.value)}/>
      </div>
        <div>
            <h2>배송 요청사항</h2>
            <select value={deliveryMessage} 
              onChange={(e)=>setDeliveryMessage(e.target.value)}>
                <option value="">배송메시지를 선택해주세요.</option>
                <option value="문앞에 놔주세요">문앞에 놔주세요</option>
                <option value="배송함에 놔주세요">배송함에 놔주세요</option>
                <option value="경비실에 놔주세요">경비실에 놔주세요</option>
                <option value="직접수령">직접수령</option>
            </select>
            <div>
              <div>
                  {items.length === 0 ? (
                    <div>
                      <p>장바구니가 비었습니다.</p>
                    </div>
                  ):(
                    <ul>
                      {items.map((item)=>(
                        <li key={item.id}>
                          <div>
                            <img src={item.image} alt={item.name}
                            style={{
                              width: '100px',
                              height: '100px',
                              objectFit: 'cover'
                            }}/>
                          </div>
                          <div>
                            <p>{item.name}</p>
                            <p>{item.price.toLocaleString()}원</p>
                            <div>
                              <span>{item.amount}</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
              </div>    
            </div>
            <div>
                <h2>결제정보</h2>
                  <div onChange={(e) => setSelectPay(e.target.value)}>
                    <label>
                      <input type="radio" value="신용카드" name="pay"/>
                      신용카드
                    </label>
                    <label>
                      <input type="radio" value="계좌이체" name="pay"/>
                      계좌이체
                    </label>
                    <label>
                      <input type="radio" value="휴대폰결제" name="pay"/>
                      휴대폰결제
                    </label>
                    <label>
                      <input type="radio" value="네이버페이" name="pay"/>
                      네이버페이
                    </label>
                    <label>
                      <input type="radio" value="카카오페이" name="pay"/>
                      카카오페이
                    </label>
                  </div>
                <div id="dropdown_menu">
                </div>
            </div>
            <div>
                총 금액: {totalAmount.toLocaleString()}원
                <button onClick={pass}>주문하기</button>
            </div>
        </div>
    </>
  )
}

export default Order
