const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {jwtAuthMiddleware, generateToken} = require('./../jwt');


// POST route to Signup a User
router.post('/signup', async(req, res) =>{
    try{
        const data = req.body;

        // Check if there is already an admin user
        const adminUser = await User.findOne({ role: 'admin' });
        if (data.role === 'admin' && adminUser) {
            return res.status(400).json({ error: 'Admin user already exists' });
        }

        // Validate Aadhar Card Number must have exactly 12 digit
        if (!/^\d{12}$/.test(data.aadharCardNumber)) {
            return res.status(400).json({ error: 'Aadhar Card Number must be exactly 12 digits' });
        }

        // Check if a user with the same Aadhar Card Number already exists
        const existingUser = await User.findOne({ aadharCardNumber: data.aadharCardNumber });
        if (existingUser) {
            return res.status(400).json({ error: 'User with the same Aadhar Card Number already exists' });
        }

        const newUser = new User(data); //create a new user

        // save new user database
        const response = await newUser.save();
        console.log('Data saved');

        const payload = {
            id: response.id
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log('Token is :', token);

        res.status(200).json({response: response, token: token});
    }
    catch (err){
        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }
})



// Login route
router.post('/login', async (req, res) => {
    try{
        const { aadharCardNumber, password } = req.body;

        // Check if aadharCardNumber or password is missing
        if (!aadharCardNumber || !password) {
            return res.status(400).json({ error: 'Aadhar Card Number and password are required' });
        }

        // Find user by aadharCardNumber
        const user = await User.findOne({aadharCardNumber: aadharCardNumber});

        // checking if user has given password and email both
        if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({error: "Invalid Aadhar Card Number & Password"});
        }

        // generate token
        const payload ={
        id: user.id,
        }
        const token = generateToken(payload);

        // return token as response
        res.json({token})
        }catch (err){
        console.error(err);
        res.status(500).json({error: "Internal server error"});
        }
});



// Profile Route
router.get('/profile', jwtAuthMiddleware, async ( req, res) =>{
    try{
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json({user});
    } catch (err){
        console.error(err);
        res.status(500).json({error: 'Internal server error'});
    }
});



// Password change
router.put('/profile/password', jwtAuthMiddleware, async(req, res) =>{
    try{
        const userId = req.user.id;
        const {currentPassword, newPassword} = req.body;
        
        // Find the user by userId
        const user = await User.findById(userId);

        // if password not match then msg error
        if (!(await user.comparePassword(currentPassword))) {
            return res.status(401).json({error: "Invalid currentPassword "});
            }
        // update user password
        user.password = newPassword;
        await user.save();
        console.log('password update');
        res.status(200).json({message: "password Updated"});
    } catch(err){
        console.log(err);
        res.status(500).json({error: " Internal server error"});
    }
});

module.exports = router;