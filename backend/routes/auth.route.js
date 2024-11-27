import express from 'express';
import { login, logout, signup,verifyEmail,forgotpassword,resetpassword,checkAuth,googleOAuth} from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { verify } from 'crypto';
import passport from '../Oauth/passport-setup.js';
import {validateSignup,validateLogin,validateForgotPassword,validateResetPassword} from '../validators/auth.validator.js';
import { verifyRole } from '../middleware/roleMiddleware.js';
import { getAllUsers } from '../controllers/auth.controller.js';


const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// GitHub OAuth Routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    // User has successfully logged in or signed up, redirect to client
    res.redirect(process.env.CLIENT_URL);
})

router.get("/check-auth",verifyToken,checkAuth);

router.post('/login',validateLogin,login);

router.post('/signup',validateSignup, signup);

router.post('/logout',logout);

router.post("/verify-email",verifyEmail);

router.post("/forgot-password",validateForgotPassword,forgotpassword);

router.post("/reset-password/:token",validateResetPassword,resetpassword);

router.post("/google", googleOAuth);

router.get('/', verifyRole(['Admin']), getAllUsers);


router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
});


export default router;