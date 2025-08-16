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
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar pedido', error });
    }
}