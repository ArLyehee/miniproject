const express = require('express');
const pool = require('./db');
const router = express.Router();


router.post('/regist', async (req, res) => {
    const { id, pw, nickname, dob, name, gender, phone } = req.body;

    try {
        // 아이디 중복 있는지 확인
        const rows = await pool.query(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );
        if (rows.length > 0) {
            return res.json({ result : false}); // 아이디 중복됨
        }

        // 회원 추가
        await pool.query(
            'INSERT INTO users(id, pw, nickname, dob, name, gender, phone) VALUES(?,?,?,?,?,?,?)',
            [id,pw,nickname,dob,name,gender,phone]
        );

        res.json({ result : true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ result : false, error: '서버 오류' });
    }
});

// // 여기 로그인창
// router.post('/login', async (req,res) => {
//     const {id, pw} = req.body;
// try{
//     const rows = await pool.query(
//         'SELECT * FROM users WHERE id = ? AND pw = ?',
//         [id, pw]
//     );

//     if (rows.length > 0) {
//         const users = rows[0];
//         res.json({ result : true, name: users.name });
//     }
//     else {
//         res.json({ result : false });
//     }
// } 
//     catch (err) {
//         console.error(err);
//         res.status(500).json({ result : false, error: '서버 오류' });
//     }

// });
router.post('/login', async (req, res) => {
    const { id, pw } = req.body;

    try {
        const rows = await pool.query(
            'SELECT id, nickname, name FROM users WHERE id = ? AND pw = ?',
            [id, pw]
        );

        if (rows.length > 0) {
            // ✅ 사용자 정보 반환
            res.json({ 
                result: true, 
                userId: rows[0].id,
                userName: rows[0].nickname,
                name: rows[0].name
            });
        } else {
            res.json({ result: false });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ result: false, error: '서버 오류' });
    }
});


// 수정하는 거
router.put('/edit',async (req,res) => {
    const {
        old_user_id, // 기존에 있던 id
        new_user_id, // 새로 바꿀 id
        user_pw,
        user_nickname,
        user_name,
        user_gender,
        user_dob,
        user_phone
    } = req.body

    // 새 id와 기존 id의 중복 체크

    if (old_user_id !== new_user_id) {
        const rows = await pool.query(
            'SELECT * FROM users WHERE id = ?',
            [new_user_id]
        );
        if (rows.length > 0) {
            return res.json({ result: false, message: "새 ID가 이미 존재합니다."});

        }
    }

    // 정보 업데이트

    await pool.query('UPDATE users SET id=?, pw=?, nickname=?, dob=?, name=?, gender=?, phone=? WHERE id=?',
        [new_user_id, user_pw, user_nickname, user_dob, user_name, user_gender, user_phone , old_user_id]
    );
    res.send({"result":true});
});

// 삭제하는 거
router.delete('/delete', async (req, res) => {
    const user_id = req.body.user_id;

    await pool.query(
        'DELETE FROM users WHERE id = ?',
        [user_id]
    );

    res.send({ "result": true });
});

module.exports = router;