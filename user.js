const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        reuired: true,
    },
    age:{
        type: Number,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    mobile:{
        type: String,
    },
    aadharCardNumber:{
        type: Number,
        require: true,
        unique: true,
    },
    email:{
        type: String,
    },
    password:{
        type: String,
        require: true,
    },
    role:{
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    isvoted:{
        type: Boolean,
        default: false,
    },
});

userSchema.pre('save', async function (next){
    // Hashed password then modified
    if (!this.isModified('password')) return next();
    try{

        // hashed password generate
        const salt = await bcrypt.genSalt(10);

        // hashed password
        const hsahedPassword = await bcrypt.hash(this.password, salt);

        this.password = hsahedPassword;
        next();
    } catch (err){
        return next(err);
    }
});

// JWT TOKEN
userSchema.methods.comparePassword = async function (candidatePassword) {
    try{
        // Compare Password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch(err){
        throw err;
    }
};

const User = mongoose.model('User', userSchema);
module.exports = User; 