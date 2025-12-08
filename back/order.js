const express = require('express');
const pool = require('./db');
const router = express.Router();

router.get('/:userId', async(req, res)=>{
    try{
        const {userId} = req.params;

        const rows = await pool.query(
            `SELECT pID as id, 
                pName as name, 
                pPrice as price,
                amount as amount,
                pImage as image
                FROM cart WHERE id = ?`, [userId]);

        res.status(200).json(rows);
    }catch(error){
        res.status(500).json({error: '장바구니 조회 실패'});
    }
})


module.exports = router;