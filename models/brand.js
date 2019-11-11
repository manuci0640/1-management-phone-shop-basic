const mongoose = require('mongoose')

const Phone = require('./phone')

const brandSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

brandSchema.pre('remove', function (next) {
    Phone.find({ brand: this.id }, (err, phones) => {
        if (err){
            next(err)
        } else if (phones.length > 0 ) {
            next(new Error('This brand has phones still'))
        } else {
            next()
        }
    })
})

module.exports = mongoose.model('Brand', brandSchema)