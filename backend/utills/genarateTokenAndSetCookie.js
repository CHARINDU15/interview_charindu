import jwt from 'jsonwebtoken';

export const genarateTokenAndSetCookie = (res, user) => {
    const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set expiration for 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        domain: process.env.NODE_ENV === 'production' ? '.charindugamage.me' : 'localhost', 
    };

    res.cookie('token', token, cookieOptions);

    return token;
};
