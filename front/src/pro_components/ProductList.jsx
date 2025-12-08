import { useNavigate } from 'react-router-dom';

function ProductList({ products }) {
  const navigate = useNavigate();
  
  // 데이터 없을 때 안내
  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>상품이 없습니다.</h2>
      </div>
    );
  }

  return (
    <div>
      <h2>상품 목록</h2>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: '1px solid black', padding: '10px' }}>
            
            <img src={product.image} alt={product.name} style={{ width: '150px', height: '150px' }} />
            
            <h3>{product.name}</h3>
            <p>{product.brand}</p>
            <p>{product.price}원</p>
            <button onClick={() => navigate(`/detail/${product.id}`)}>
              상세 보기
            </button>
            
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;