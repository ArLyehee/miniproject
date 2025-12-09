const express = require('express');
const pool = require('./db');
const router = express.Router();

router.get('/:userId', async(req, res)=>{
    try{
        const {userId} = req.params;

        const rows = await pool.query(
            `SELECT pId as id, 
                pName as name, 
                pPrice as price,
                amount as amount,
                img as image
                FROM cart WHERE id = ?`, [userId]);

        res.status(200).json(rows);
    }catch(error){
        console.error('장바구니 조회 에러:', error);
        res.status(500).json({error: '장바구니 조회 실패'});
    }
})

router.put('/update', async(req,res)=>{
    try {
        const {pId, amount, userId} = req.body;
        await pool.query('UPDATE cart SET amount = ? WHERE pId = ? AND id = ?',
            [amount, pId, userId]
        )
        res.send({"result":true})
    } catch(error) {
        console.error('수량 업데이트 에러:', error);
        res.status(500).json({error: '수량 변경 실패'});
    }
})

router.delete('/delete', async(req,res)=>{
    try {
        const {pId, userId} = req.body;
        await pool.query('DELETE FROM cart WHERE pId = ? AND id = ?',
            [pId, userId]
        )
        res.send({"result":true})
    } catch(error) {
        console.error('삭제 에러:', error);
        res.status(500).json({error: '삭제 실패'});
    }
})

module.exports = router;