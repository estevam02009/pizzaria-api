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

        // Criptografia senha
        const hashedPassword = await bcrypt.hash(senha, 10)

        const newUser = new User({
            nome,
            email,
            senha: hashedPassword,
            telefone,
            endereco,
            role
        })

        await newUser.save()

        res.status(201).json({ message: "Usuário cadastrado com sucesso." })
    } catch (error) {
        res.status(500).json({ message: "Erro ao cadastrar usuário.", error })
    }
}

export const login = async (req, res) => {
    try {
        const { email, senha} = req.body

        // Buscar usuário
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Usuário não encontrado." })
        }

        // Verificar senha
        const isMatch = await bcrypt.compare(senha, user.senha)
        if (!isMatch) {
            return res.status(400).json({ message: "Senha incorreta." })
        }

        // Gerar token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" })

        res.status(200).json({ message: "Login realizado com sucesso.", token })
    } catch (error) {
        res.status(500).json({ message: "Erro ao realizar login.", error })
    }
}