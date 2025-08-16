import express from 'express'
import { me } from '../controllers/userController.js'
import { auth, authorize } from '../middlewares/auth.js'

const router = express.Router()

// Perfil do usuário logado
router.get('/me', auth, authorize('user'), me)

// Exemplo de rota só para admin
router.get("/admin/check", auth, authorize('admin'), (req, res) => {
    res.json({ ok: true, message: `Olá, admin ${req.user.nome}` });
});