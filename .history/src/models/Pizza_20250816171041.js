import mongoose from "mongoose";

const pizzaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    descricao: {
        type: String,
        trim: true
    },
    imagem: {
        type: String, // URL da imagem
        default: ""
    },
    preco: {
        pequeno: { type: Number, required: true },
        medio: { type: Number, required: true },
        grande: { type: Number, required: true }
    },
    categoria: {
        type: String, // ex: "Tradicional", "Especial", "Doce"
        default: "Tradicional"
    },
    disponivel: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Pizza = mongoose.model("Pizza", pizzaSchema);

export default Pizza;
