import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    itens: [
        {
            pizza: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Pizza",
                required: true,
            },
            nome: { type: String, required: true },
            tamanho: { type: String, required: true },
            quantidade: { type: Number, required: true },
            precoUnitario: { type: Number, required: true }, // ✅ corrigido
            subtotal: { type: Number, required: true },       // ✅ novo
        },
    ],
    total: { type: Number, required: true },
    enderecoEntrega: { type: String, required: true },
    observacoes: { type: String },
    status: {
        type: String,
        enum: ["pendente", "em preparo", "saiu para entrega", "entregue"],
        default: "pendente",
    },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
