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

  function pass(){
    if (!selectPay) {
      alert('결제 방법을 선택해주세요');
      return;
    }
    navigate('/done');
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
        <input type="text" placeholder="배송지명"/>
        <label>받는분:</label>
        <input type="text" placeholder="받는분"/>
        <label>연락처:</label>
        <input type="text" placeholder="연락처"/>
      </div>
        <div>
            <h2>배송 요청사항</h2>
            <select>
                <option>배송메시지를 선택해주세요.</option>
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
                      <input type="radio" value="1" name="pay"/>
                      신용카드
                    </label>
                    <label>
                      <input type="radio" value="2" name="pay"/>
                      계좌이체
                    </label>
                    <label>
                      <input type="radio" value="3" name="pay"/>
                      휴대폰결제
                    </label>
                    <label>
                      <input type="radio" value="4" name="pay"/>
                      네이버페이
                    </label>
                    <label>
                      <input type="radio" value="5" name="pay"/>
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
