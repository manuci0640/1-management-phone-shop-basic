const router = require('express').Router()

const Brand = require('../models/brand')
const Phone = require('../models/phone')

router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const brands = await Brand.find(searchOptions)
        res.render('brands/index', {
            brands: brands,
            searchOptions: req.query.name
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/new', (req, res) => {
    res.render('brands/new', {
        brand: new Brand()
    })
})

router.post('/new', async (req, res) => {
    const brand = new Brand({
        name: req.body.name
    })
    try {
        const newBrand = await brand.save()
        res.redirect('/brands')
    } catch {
        res.render('/brands/new', {
            brand: brand,
            errorMessage: 'Error creating Brand'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id)
        const phonesOfBrand = await Phone.find({ brand: brand.id })
        res.render('brands/show', {
            brand: brand,
            phonesOfBrand: phonesOfBrand
        })
    } catch {
        res.redirect('/brands')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id)
        res.render('brands/edit', {
            brand: brand
        })
    } catch {
        res.redirect('/brands')
    }

})

router.put('/:id', async (req, res) => {
    let brand
    try {
        brand = await Brand.findById(req.params.id)
        brand.name = req.body.name
        await brand.save()
        res.redirect('/brands')
    } catch {
        if (brand == null) {
            res.redirect('/')
        } else {
            res.redirect(`/brands/${brand.id}`)
        }
    }
})

router.delete('/:id', async (req, res) => {
    let brand
    try {
        brand = await Brand.findById(req.params.id)
        await brand.remove()
        res.redirect('/brands')
    } catch {
        if (brand == null) {
            res.redirect('/')
        } else {
            res.redirect(`/brands/${brand.id}`)
        }
    }
})

module.exports = router