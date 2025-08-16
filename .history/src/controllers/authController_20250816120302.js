import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
    try {
        const { nome, email, senha, telefone, endereco, role } = req.body

        // Verificar se o usuário existe
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "Usuário já está cadastrado." })
        }
    } catch (error) {}
}