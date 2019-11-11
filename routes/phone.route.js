const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const Brand = require('../models/brand')
const Phone = require('../models/phone')

const uploadPath = path.join('public', Phone.imagePathBase)
const upload = multer({
    dest: uploadPath
})

router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const phones = await Phone.find(searchOptions)
        res.render('phones/index', {
            phones: phones,
            searchOptions: req.query.name
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/new', (req, res) => {
    renderNewPage(res, new Phone())
})

router.post('/new', upload.single('image'), async (req, res) => {
    const image = req.file != null ? req.file.path : null
    const phone = new Phone({
        name: req.body.name,
        brand: req.body.brand,
        price: req.body.price,
        color: req.body.color,
        image: image,
        description: req.body.description
    })
    try {
        const newPhone = await phone.save()
        res.redirect('/phones')
    } catch {
        if (phone.image != null) {
            removePhoneImage(phone.image)
        }
        renderNewPage(res, phone, true)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        let phone = await Phone.findById(req.params.id)
        await phone.remove()
        res.redirect('/phones')
    } catch {
        if (phone == null) {
            res.redirect('/')
        } else {
            res.redirect(`/phones/${ phone.id }`)
        }
    }
})

function removePhoneImage(fileName) {
    fs.unlink(fileName, err => {
        if (err) console.error(err)
    })
}

async function renderNewPage(res, phone, hasError = false) {
    try {
        const brands = await Brand.find({})
        const params = {
            brands: brands,
            phone: phone
        }
        if (hasError) params.errorMessage = 'Error Creating Phone'
        res.render('phones/new', params)
    } catch {
        res.redirect('/phones')
    }
}


module.exports = router