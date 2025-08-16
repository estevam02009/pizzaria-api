// src/controllers/userController.js
export const me = async (req, res) => {
    // req.user é setado pelo middleware auth
    res.json({ user: req.user });
};
