import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Verifica se o token é válido e injeta req.user
export const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

        if (!token) {
            return res.status(401).json({ message: "Token não fornecido" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Opcional: checar se o usuário existe no banco de dados
        const user = await User.findById(decoded.id).select("_id nome email role")
        if (!user) {
            return res.status(401).json({ message: "Usuário inválido" });
        }

        req.user = user;
        next();
    } catch (error) {
        
    }
}