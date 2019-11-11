const router = require('express').Router()

const Phone = require('../models/phone')

router.get('/', async (req, res) => {
    let phones
    try {
        phones = await Phone.find().sort({ createdAt: 'desc' }).limit(5).exec()
    } catch {
        phones = []
    }
    res.render('index', {
        phones: phones
    })
})

module.exports = router