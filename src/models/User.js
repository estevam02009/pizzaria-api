import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    senha: {
        type: String,
        required: true,
        minlength: 6
    },
    telefone: {
        type: String,
    },
    endereco: {
        type: String,
    },
    role: {
        type: String,
        enum: ['cliente', 'admin'],
        default: 'cliente'
    }
}, { timestamps: true })

export default mongoose.model('User', userSchema)