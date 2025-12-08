import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useState, useEffect, use } from 'react'
import ProductList from './pro_components/ProductList.jsx';
import ProductDetail from './pro_components/ProductDetail.jsx';
import Order from './cart_components/Order'
import Cart from './cart_components/Cart'
import Done from './cart_components/Done'
import Header from './main_components/header.jsx'
// import Addmain from './main_components/Addmain.jsx'
import Login from './user_components/Login'
import Regist from './user_components/regist.jsx'
import Settings from './user_components/Settings'
import EditUser from './user_components/EditUser'
import DeleteUser from './user_components/DeleteUser'
import MainPage from './user_components/MainPage'


function App() {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);

  const handleAddReview = (productId, rating, content) => {

    fetch('http://localhost:8080/pro/addreview', { //합칠때 경로 잘 보기
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId,
        rating,
        content,
        userName: localStorage.getItem('userName'),
        userId: localStorage.getItem('userId')  
      })
    })
      .then(res => res.json())
      .then(newReviewList => {

        setReviews(newReviewList);
        alert("리뷰 작성이 완료되었습니다.");
      })
      .catch(error => {
        console.error("리뷰 작성 중 오류 발생:", error);
        alert("리뷰 작성 실패.");
      });
  }
  /////////////////////////////////////////

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('http://localhost:8080/pro/products');
        const data = await response.json();
        setProducts(data);

      } catch (error) {
        console.error("서버가 켜져있는지 확인하세요. 상품 로딩 실패.", error);
        setProducts([]);
      }
    }

    async function fetchReviews() {
      try {
        const response = await fetch('http://localhost:8080/pro/reviews');
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("리뷰 데이터를 불러오지 못했습니다.", error);
      }
    }

    fetchProducts();
    fetchReviews();

  }, []);

  return (
    <>
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path='/order' element={<Order />}/>
        <Route path='/done' element={<Done />}/>
        {/* <Route path='/' element={<Addmain/>}/> */}
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/regist' element={<Regist/>}/>
        <Route path='/mainpage' element={<MainPage/>}/>
        <Route path='/settings' element={<Settings/>}/>
        <Route path='/settings/edit' element={<EditUser/>}/>
        <Route path='/settings/delete' element={<DeleteUser/>}/>
        <Route path="/" element={
          <div style={{ padding: '20px' }}>
            <ProductList
              products={products}/></div>} />
        {/* 상세 페이지 라우트 */}
        <Route path='/detail/:productId' element={
          <ProductDetail
            products={products}
            reviews={reviews}
            onAddReview={handleAddReview}
          />
        } />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
