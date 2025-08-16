import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    itens: [
        {
            pizza: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Pizza",
                required: true
            },
            tamanho: {
                type: String,
                enum: ["pequeno", "medio", "grande"],
                required: true
            },
            quantidade: {
                type: Number,
                default: 1
            },
            precoUnitario: {
                type: Number,
                required: true
            }
        }
    ],
    total: {
        type: Number,
        required: true
    },
    enderecoEntrega: {
        type: String,
        required: true
    },
    observacoes: {
        type: String
    },
    status: {
        type: String,
        enum: ["pendente", "em preparo", "a caminho", "entregue", "cancelado"],
        default: "pendente"
    }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;
