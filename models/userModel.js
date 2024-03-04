const mongoose = require ('mongoose')
const bcrypt = require("bcrypt");


const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required field.']
    },
    email: {
        type: String,
        required: [true, 'Email is required field.'],
        unique: [true, 'Email already taken']
    },
    password: {
        type: String,
        required: [true, 'Passpword is required field.']
    }
}, {
    timestamps: true,
}
)

module.exports = mongoose.model("User", userSchema)
