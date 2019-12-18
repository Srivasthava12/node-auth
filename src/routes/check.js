const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const status = {
        status:"Learning is fun"
    }
    res.send(status)
});

module.exports = router;