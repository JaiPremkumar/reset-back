const express = require('express');
const { userRegister, userLogin, forgot, resetPassword } = require('./authcntrl');

const router = express.Router()

router.route('/register/').post(userRegister);
router.route('/login/').post(userLogin);
router.route('/forgots/').post(forgot)
router.route('/reset/:token').post(resetPassword)  

module.exports = router