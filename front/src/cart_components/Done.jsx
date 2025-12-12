import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Done = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isConfirming, setIsConfirming] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const confirmPayment = async () => {
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");

      if (!paymentKey || !orderId || !amount) {
        setError("결제 정보가 올바르지 않습니다.");
        setIsConfirming(false);
        return;
      }

      try {
        const confirmResponse = await fetch("http://localhost:8080/order/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount
          })
        });

        const confirmData = await confirmResponse.json();

        if (!confirmResponse.ok || confirmData.status !== "DONE") {
          setError(confirmData.message || "결제 승인에 실패했습니다.");
          setIsConfirming(false);
          return;
        }

        console.log("결제 승인 완료:", confirmData);

        const pendingOrderStr = sessionStorage.getItem('pendingOrder');
        
        if (!pendingOrderStr) {
          setError("주문 정보를 찾을 수 없습니다.");
          setIsConfirming(false);
          return;
        }

        const orderData = JSON.parse(pendingOrderStr);

        const orderResponse = await fetch('http://localhost:8080/order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(orderData)
        });

        const orderResult = await orderResponse.json();

        if (orderResponse.ok) {
          console.log("주문 저장 완료:", orderResult);
          
          sessionStorage.removeItem('pendingOrder');
          
          setIsConfirming(false);
          
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          setError(orderResult.error || "주문 저장에 실패했습니다.");
          setIsConfirming(false);
        }

      } catch (err) {
        console.error("처리 오류:", err);
        setError("주문 처리 중 오류가 발생했습니다.");
        setIsConfirming(false);
      }
    };

    confirmPayment();
  }, [searchParams, navigate]);

  // if (error) {
  //   return (
  //     <div style={{textAlign:'center', marginTop:'100px'}}>
  //       <div style={{fontSize:'80px'}}>❌</div>
  //       <h1 style={{margin:'20px 0', color:'#f44336'}}>결제 처리 실패</h1>
  //       <p style={{fontSize:'18px', color:'#666'}}>{error}</p>
        
  //       <button className="btn" style={{marginTop:'30px'}} onClick={() => navigate('/cart')}>
  //         장바구니로 돌아가기
  //       </button>
  //     </div>
  //   );
  // }

  if (isConfirming) {
    return (
      <div style={{textAlign:'center', marginTop:'100px'}}>
        <div style={{fontSize:'80px'}}>⏳</div>
        <h1 style={{margin:'20px 0', color:'var(--main-color)'}}>결제 확인 중...</h1>
        <p style={{fontSize:'18px', color:'#666'}}>잠시만 기다려주세요.</p>
      </div>
    );
  }

  return (
    <div style={{textAlign:'center', marginTop:'100px'}}>
      <div style={{fontSize:'80px'}}>🎉</div>
      <h1 style={{margin:'20px 0', color:'var(--main-color)'}}>주문이 완료되었습니다!</h1>
      <p style={{fontSize:'18px', color:'#666'}}>잠시 후 메인 페이지로 이동합니다...</p>
      
      <button className="btn" style={{marginTop:'30px'}} onClick={() => navigate('/')}>
        지금 바로 홈으로 가기
      </button>
    </div>
  );
}

export default Done;