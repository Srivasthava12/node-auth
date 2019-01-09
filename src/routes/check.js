const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const status = {
        status:"All Set To Gooooo!!!!!"
    }
    res.send(status)
});

module.exports = router;