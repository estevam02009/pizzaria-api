import Order from '../models/Order.js';
import Pizza from '../models/Pizza.js';

// Criar pedido cliente
export const createOrder = async (req, res) => {
    try {
        const { itens, enderecoEntrega, observacoes } = req.body

        // Calcular total
        let total = 0;
        const itensFormatados = []

        for (const item of itens) {
            const pizza = await Pizza.findById(item.pizzaId);
            if (!pizza) return res.status(404).json({ message: 'Pizza não encontrada' });

            const preco = pizza.preco[item.tamanho];
            if (!preco) return res.status(400).json({ message: 'Tamanho de pizza inválido' });

            itensFormatados.push({
                pizza: pizza._id,
                tamanho: item.tamanho,
                quantidade: item.quantidade,
                precoUnitario: preco
            })

            total += preco * item.quantidade;
        }

        const order = new Order({
            cliente: req.user.id,
            itens: itensFormatados,
            total,
            enderecoEntrega,
            observacoes,
        });

        await order.save();
        res.status(201).json({ message: 'Pedido criado com sucesso', order });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar pedido', error: err });
    }
}

// Listar pedidos de clientes
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ cliente: req.user._id }).populate('itens.pizza', 'nome imagem')
        res.json(orders)
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar pedidos', error });
    }
}

// Listar todos os pedidos
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('cliente', 'nome email')
            .populate('itens.pizza', 'nome')
        res.json(orders)
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar pedidos', error });
    }
}

// Atualizar status do pedido
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body
        const order = await Order.findByIdAndUpdate(req.params.id, { status}, { new: true })
        
        if (!order) return res.status(404).json({ message: 'Pedido não encontrado' });

        res.json({ message: 'Status do pedido atualizado com sucesso', order });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar status do pedido', error });
    }
}