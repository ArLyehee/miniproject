import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// App.jsx에서 products 배열, reviews 배열, onAddReview 함수를 받음
function ProductDetail({ products, reviews, onAddReview}) {

  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const navigate = useNavigate();
  const { productId } = useParams();

  // [추가] 사용자가 선택한 평점을 저장하는 상태 (기본값 5점)
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [quantity, setQuantity] = useState(1);

  const productReviews = reviews.filter(r =>
    String(r.pId) === productId
  );

  const handleQuantityButton = (type) => {
    if (!product) return;

    setQuantity(prev => {
      // 재고 확인 재고 초과방지
      if (type === 'plus' && prev < product.stock) {
        return prev + 1;
      } else if (type === 'minus' && prev > 1) {
        return prev - 1;
      }
      return prev;
    });
  };

  // 수량 입력 필드 값 변경 핸들러
  const handleQuantityChange = (event) => {
    if (!product) return;
    const value = parseInt(event.target.value, 10);

    if (value >= 1 && value <= product.stock) {
      setQuantity(value);
    } else if (value < 1) {
      setQuantity(1);
    }
  };

  ///////////////별점 표시 함수 (기존)
  const renderStars = (score) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      // rating보다 작거나 같으면 꽉 찬 별(★), 아니면 빈 별(☆)
      stars.push(
        // 스타일 최소화 (색상만 유지)
        <span key={i} style={{ color: i <= score ? '#FFD700' : '#E0E0E0' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  // [추가] 평점 선택 UI 함수
  const renderStarSelect = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => setRating(i)} // 클릭 시 rating 상태 업데이트
          style={{
            cursor: 'pointer', // 클릭 가능 표시
            // 현재 선택된 rating 반영
            color: i <= rating ? '#FFD700' : '#E0E0E0',
          }}
        >
          ★
        </span>
      );
    }
    return (
      <div>
        <span>평점 선택: </span>
        {stars}
        <span style={{ marginLeft: '5px' }}>({rating}점)</span>
      </div>
    );
  };
  ///////////////////////////////////////////////

  // 리뷰 제출 핸들러 [수정: rating 전달]
  const handleSubmitReview = () => {
    if (!userId) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
    }
      if (!reviewComment.trim()) {
        alert("리뷰 내용을 입력해주세요.");
        return;
      }
      // rating 값을 onAddReview 함수에 전달
      onAddReview(productId, rating, reviewComment);
      setReviewComment('');
      setRating(0); // 제출 후 rating 초기화
  };


  const product = products.find(p => String(p.id) === productId);

  if (!product) {
    return (
      <div>
        <h1>상품 정보를 찾을 수 없습니다.</h1>
        <button onClick={() => navigate('/')}>목록으로 돌아가기</button>
      </div>
    );
  }
  const moveCart = async () => {
    // ✅ localStorage에서 userId 가져오기
    const userId = localStorage.getItem('userId');
    
    // 로그인 체크
    if (!userId) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/pro/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pId: product.id,
                id: userId,
                amount: quantity,  // 기본 수량
                img: product.image,
                pName: product.name,
                pPrice: product.price
            })
        });
        
        const data = await response.json();
        
        if (data.result) {
            alert('장바구니에 담겼습니다.');
            const goToCart = window.confirm('장바구니로 이동하시겠습니까?');
            if (goToCart) {
                navigate('/cart');
            }
        } else {
            alert('장바구니 담는중 오류 발생');
        }
    } catch (error) {
        console.error('장바구니 추가 오류:', error);
        alert('장바구니 추가 실패');
    }
}

  return (
    <div onClick={() => navigate('/')}>

      <div onClick={(e) => e.stopPropagation()}>

        {/* 상품 정보 영역 */}
        <div>
          <button onClick={() => navigate('/')}>← 목록으로</button>

          <span>브랜드: {product.brand}</span>
          <p><img src={product.image} alt={product.name} style={{ width: '400px', height: '400px' }} /></p>
          <h2>{product.name}</h2>
          {product.stock === 0 ? (
            <p style={{ color: 'gray', fontWeight: 'bold' }}>❌ 일시 품절</p>
          ) : product.stock <= 5 ? (
            <p style={{ color: 'red', fontWeight: 'bold' }}>
              🔥품절 임박🔥
            </p>
          ) : null}
          <p>가격: {product.price ? product.price.toLocaleString() : 0}원</p>
          <hr />

          <p>상품 상세 설명: {product.description}</p>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ marginRight: '10px', fontWeight: 'bold' }}>수량:</span>
            <div style={{ display: 'flex' }}>
              <button
                onClick={() => handleQuantityButton('minus')}
                style={{ marginRight: '5px' }}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={handleQuantityChange}
                style={{ width: '50px', textAlign: 'center', marginRight: '5px' }}
              />
              <button
                onClick={() => handleQuantityButton('plus')}
              >
                +
              </button>
            </div>
          </div>
          <div>
            <button onClick={moveCart}>장바구니 담기({quantity}개)</button>
            <button onClick={moveCart}>바로 구매</button>
          </div>
        </div>

        {/* ====================여기부터 리뷰==================================== */}
        <div>
          <h3>리뷰 ({productReviews.length}개)</h3>

          <div>
            <h4>리뷰 작성하기</h4>

            {/* [추가] 평점 선택 UI 렌더링 */}
            {renderStarSelect()}

            <textarea
              placeholder="리뷰를 남겨주세요..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
            />
            <button onClick={handleSubmitReview}>리뷰 제출</button>
          </div>

          {/* 기존 리뷰 목록 표시 */}
          {productReviews.length > 0 ? (
            productReviews.map((review, index) => (
              <div style={{ border: 'solid 2px black' }} key={index}>
                <p>
                  <strong>{review.userName || '익명'}</strong>{review.gender === 'M' ? '♂️' : '♀️'}
                  {renderStars(review.rating)}
                  <span style={{ fontSize: '0.8em', color: 'gray', marginLeft: '5px' }}>
                    ({review.rating}점)
                  </span>
                </p>

                <p>{review.content}</p>
                <p>{new Date(review.date).toLocaleDateString()}</p>                    </div>
            ))
          ) : (
            <p>아직 이 상품의 리뷰가 없습니다.</p>
          )}

        </div>
        {/* ========================여기까지 리뷰===================================== */}

      </div>
    </div>
  );
}

export default ProductDetail;