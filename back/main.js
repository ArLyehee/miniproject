const express = require('express');
const pool = require('./db');
const router = express.Router();

//상품db
router.get('/products',async(req,res) => {
    const rows = await pool.query('SELECT * FROM `products`');
    res.send(rows);
})

//새상품db
router.get('/pnew',async(req,res) => {
    const rows = await pool.query('SELECT * FROM `pnew`');
    res.send(rows);
})

module.exports = router;