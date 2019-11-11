const mongoose = require('mongoose')
const path = require('path')

const imagePathBase = 'uploads/phoneImages'

const phoneSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    image: {
        type: String,
        required: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Brand'
    }
})

// phoneSchema.virtual('image').get(function() {
//     if (this.image != null) {
//         return path.join('/', imagePathBase, this.image)
//     }
// })

module.exports = mongoose.model('Phone', phoneSchema)
module.exports.imagePathBase = imagePathBase