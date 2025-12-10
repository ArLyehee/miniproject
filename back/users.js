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
router.post('/login', async (req, res) => {
    const { id, pw } = req.body;

    try {
        const rows = await pool.query(
            'SELECT * FROM users WHERE id = ? AND pw = ?',
            [id, pw]
        );

        if (rows.length > 0) {
            // ✅ 사용자 정보 반환
           const user = rows[0];
           req.session.user = {
                id: user.id,
                nickname: user.nickname,
                name: user.name,
                gender: user.gender,
                phone: user.phone,
                admin: user.admin
           };
             res.json({ result: true, user: req.session.user });
        } else {
             res.json({ result: false, message: "아이디 또는 비밀번호가 일치하지 않습니다" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ result: false, error: '서버 오류' });
    }
});
router.get ('/', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ result: false, message: "로그인이 필요합나다" });
    }
    res.json ({ result: true, user: req.session.user });
});

// 여기부터 로그아웃
router.post ('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).json({ result: false, message: "로그인에 실패했습니다" });
        }
        res.clearCookie('connect.sid');
        res.json({ result: true, message: "로그아웃 완료" })
    });
});

// 수정하는 거
router.put('/edit',async (req,res) => {
    const {
        user_pw,
        user_nickname,
        user_name,
        user_gender,
        user_dob,
        user_phone
    } = req.body

    await pool.query('UPDATE users SET pw=?, nickname=?, dob=?, name=?, gender=?, phone=? WHERE id=?',
        [ user_pw, user_nickname, user_dob, user_name, user_gender, user_phone, user_id]
    );
    res.send({"result":true});
});

// 삭제하는 거
router.delete('/delete',async (req, res) => {

    if (!req.session.user) {
        return res.status(401).json({ result: false, messag: "로그인이 필요한기능입니다" }); // 세션 확인 (로그인 여부 확인 기능 추가)
        }

        const user_id = req.session.user.id; // 이제 삭제할 user_id를 body가 아닌 세션에서 가지고 옴

        try{
            await pool.query( 'DELETE FROM users WHERE id = ?', [user_id] );

            req.session.destroy(() => {}); // 계정 삭제 후 세션도 삭제 (즉 자동 로그아웃)

            res.json({ result: true });
        }
        catch {
            res.status(500).json({ result: false });
        }
});

module.exports = router;