import { useState, useEffect, useContext } from "react";
import { AuthContext } from '../context/AuthContext';

function ProductItem({ item, onUpdate, onDelete }) {
    const [localStock, setLocalStock] = useState(''); 
    const [image, setImage] = useState(null);
    const [pName, setpName] = useState(item.name || "");
    const [brand, setBrand] = useState(item.brand || "");
    const [pPrice, setpPrice] = useState(item.price || "");
    const [description, setDescription] = useState(item.description || "");
    const [pcategory, setCategory] = useState(item.category || "");

    const categories = ["스킨", "로션", "올인원", "미백/주름"];

    async function saveChanges() {
    if (!pName.trim() || !pPrice) {
    alert("상품명과 가격은 필수입니다.");
    return;
    }
    if (isNaN(pPrice)) {
    alert("가격은 숫자로 입력해주세요.");
    return;
    }
    if (localStock && isNaN(localStock)) {
    alert("재고는 숫자로 입력해주세요.");
    return;
    }
    if (!localStock && localStock !== 0) {
    alert("재고를 입력해주세요.");
    return;
    }

    const formData = new FormData();
    formData.append("pId", item.id);
    formData.append("pName", pName.trim());
    formData.append("brand", brand.trim() || "");
    formData.append("pPrice", Number(pPrice));
    formData.append("description", description.trim() || "");
    formData.append("pcategory", pcategory || "");
    formData.append("stock", Number(localStock || 0));
    if (image) formData.append("image", image);

    try {
    const res = await fetch("http://localhost:8080/main/dbprod", {
        method: "PUT",
        credentials: "include",
        body: formData,
    });

    const text = await res.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch {
        console.error("서버 응답:", text);
        alert("서버에서 올바른 응답을 받지 못했습니다.");
        return;
    }

    if (data.success) {
        alert("상품 정보가 수정되었습니다.");
        onUpdate(item.id, {
        ...item,
        name: pName,
        brand,
        price: Number(pPrice),
        description,
        category: pcategory,
        stock: Number(localStock),
        image: image ? URL.createObjectURL(image) : item.image,
        });
    } else {
        alert(data.message || "상품 수정 실패");
    }
    } catch (err) {
    console.error(err);
    alert("상품 수정 중 오류가 발생했습니다.");
    }
}

    return (
        <div className="card2" key={item.id}>
        <div style={{ textAlign: "center" }}>
            <img
            src={image ? URL.createObjectURL(image) : item.image}
            alt={item.name}
            style={{ width: "150px", height: "150px", objectFit: "cover", marginBottom: "10px" }}
            />
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        </div>

        <div>
            <label>상품명</label>
            <input className="input" value={pName} onChange={(e) => setpName(e.target.value)} />
        </div>

        <div>
            <label>브랜드</label>
            <input className="input" value={brand} onChange={(e) => setBrand(e.target.value)} />
        </div>

        <div>
            <label>가격</label>
            <input className="input" type="number" value={pPrice} onChange={(e) => setpPrice(e.target.value)} />
        </div>

        <div>
            <label>재고 (현재 재고: {item.stock})</label>
            <input className="input" type="number" value={localStock} onChange={(e) => setLocalStock(e.target.value)} />
        </div>

        <div>
            <label>카테고리</label>
            <select className="input" value={pcategory} onChange={(e) => setCategory(e.target.value)}>
            <option value="">선택해주세요</option>
            {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
            ))}
            </select>
        </div>

        <div>
            <label>상품 설명</label>
            <textarea className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
            <button className="btn" onClick={saveChanges}>수정 완료</button>
            <button className="btn" onClick={() => onDelete(item.id)}>제품 삭제</button>
        </div>
    );
}

function Editprouct() {
    const { user } = useContext(AuthContext);

    function back() {
        history.back();
    }

    const [list, setList] = useState([]);

    useEffect(() => {
    async function loadProducts() {
        try {
            const res = await fetch("http://localhost:8080/main/dbprod");
            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                console.error("서버 응답:", text);
            return;
            }
            
            if (Array.isArray(data)) setList(data);
            else setList([data]);
            } catch (err) {
            console.error(err);
            }
        }
        loadProducts();
    }, []);

    function handleUpdate(id, updatedItem) {
    setList(list.map((item) => (item.id === id ? updatedItem : item)));
    }

    function deletes(id) {
    if (!confirm("상품을 삭제 하시겠습니까?")) {
        return;
    }

    fetch(`http://localhost:8080/main/dbprod/delete/${id}`, {
        method: "DELETE",
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            setList(prev => prev.filter(item => item.id !== id));
            alert("삭제되었습니다.");
        } else {
            alert("삭제 실패");
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
                    <ProductItem 
                        key={item.id} 
                        item={item} 
                        onUpdate={handleUpdate}
                        onDelete={deletes}
                    />
                ))}
            </div>     
        </>
    )
}
export default Editprouct;