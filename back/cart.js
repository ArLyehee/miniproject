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
        res.status(500).json({error: '장바구니 조회 실패'});
    }
})

router.put('/update', async(req,res)=>{
    await pool.query('UPDATE cart SET amount = ? WHERE pId = ?',
        [req.body.amount, req.body.pId]
    )
    res.send({"result":true})
})

router.delete('/delete', async(req,res)=>{
    const pId = req.body.pId
    await pool.query('DELETE FROM cart WHERE pId =?',
        [pId]
    )
    res.send({"result":true})
})

module.exports = router;