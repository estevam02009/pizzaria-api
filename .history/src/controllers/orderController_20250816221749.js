import Order from "../models/Order.js";
import Pizza from "../models/Pizza.js";
import axios from "axios";

import { sendWhatsAppMessage } from "../services/whatsappService.js";

// Criar novo pedido
export const createOrder = async (req, res) => {
    try {
        const { itens, enderecoEntrega, observacoes } = req.body;

        // 🔒 Verifica se há itens
        if (!itens || itens.length === 0) {
            return res.status(400).json({ message: "O pedido deve conter ao menos uma pizza." });
        }

        let total = 0;
        const itensDetalhados = [];

        for (const item of itens) {
            const pizza = await Pizza.findById(item.pizza);
            if (!pizza) {
                return res.status(404).json({ message: `Pizza com ID ${item.pizza} não encontrada.` });
            }

            // 🔒 Verifica se o tamanho existe
            if (!pizza.preco[item.tamanho]) {
                return res.status(400).json({ message: `Tamanho '${item.tamanho}' não disponível para a pizza ${pizza.nome}.` });
            }

            const preco = pizza.preco[item.tamanho];
            const subtotal = preco * item.quantidade;
            total += subtotal;

            itensDetalhados.push({
                pizza: pizza._id,
                nome: pizza.nome,
                tamanho: item.tamanho,
                quantidade: item.quantidade,
                preco,
                subtotal,
            });
        }

        // Salva pedido no banco
        const novoPedido = new Order({
            cliente: req.user._id, // vem do middleware de autenticação
            itens: itensDetalhados,
            total,
            enderecoEntrega,
            observacoes,
        });

        await novoPedido.save();

        // 📝 Monta mensagem para WhatsApp
        const itensMsg = itensDetalhados
            .map(item => `${item.quantidade}x ${item.nome} (${item.tamanho}) - R$ ${item.subtotal.toFixed(2)}`)
            .join("\n");

        const mensagem = `🍕 *Novo pedido!*  
👤 Cliente: ${req.user.nome}  
📍 Endereço: ${enderecoEntrega}  
📝 Obs: ${observacoes || "Nenhuma"}  

📦 Itens:  
${itensMsg}  

💰 Total: R$ ${total.toFixed(2)}`;

        // Envia mensagem ao WhatsApp (se configurado)
        try {
            await axios.post("https://graph.facebook.com/v18.0/{YOUR_PHONE_ID}/messages", {
                messaging_product: "whatsapp",
                to: process.env.WHATSAPP_NUMBER, // Número que receberá os pedidos
                type: "text",
                text: { body: mensagem },
            }, {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json",
                },
            });
        } catch (whatsErr) {
            console.error("⚠️ Erro ao enviar WhatsApp:", whatsErr.response?.data || whatsErr.message);
        }

        res.status(201).json({ message: "Pedido criado com sucesso!", pedido: novoPedido });

    } catch (err) {
        console.error("❌ Erro no createOrder:", err);
        res.status(500).json({ message: "Erro ao criar pedido", error: err.message, stack: err.stack });
    }
};

// Listar pedidos do cliente
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ cliente: req.user._id }).populate("itens.pizza", "nome imagem");
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar pedidos", err });
    }
};

// Listar todos pedidos (admin)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("cliente", "nome email")
            .populate("itens.pizza", "nome");
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar pedidos", err });
    }
};

// Atualizar status do pedido (admin)
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!order) return res.status(404).json({ message: "Pedido não encontrado" });

        res.json({ message: "Status atualizado com sucesso!", order });
    } catch (err) {
        res.status(500).json({ message: "Erro ao atualizar pedido", err });
    }
};
