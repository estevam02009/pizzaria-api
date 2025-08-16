import Pizza from "../models/Pizza.js";

// Listar todas as pizzas
export const getPizzas = async (req, res) => {
    try {
        const pizzas = await Pizza.find();
        res.json(pizzas);
    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar pizzas" });
    }
};

// Buscar pizza por ID
export const getPizzaById = async (req, res) => {
    try {
        const pizza = await Pizza.findById(req.params.id);
        if (!pizza) return res.status(404).json({ message: "Pizza não encontrada" });
        res.json(pizza);
    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar pizza" });
    }
};

// Criar nova pizza (admin)
export const createPizza = async (req, res) => {
    try {
        const { nome, descricao, imagem, preco, categoria } = req.body;

        const pizza = new Pizza({ nome, descricao, imagem, preco, categoria });
        await pizza.save();

        res.status(201).json({ message: "Pizza criada com sucesso!", pizza });
    } catch (err) {
        res.status(500).json({ message: "Erro ao criar pizza", err });
    }
};

// Atualizar pizza (admin)
export const updatePizza = async (req, res) => {
    try {
        const pizza = await Pizza.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!pizza) return res.status(404).json({ message: "Pizza não encontrada" });
        res.json({ message: "Pizza atualizada!", pizza });
    } catch (err) {
        res.status(500).json({ message: "Erro ao atualizar pizza" });
    }
};

// Deletar pizza (admin)
export const deletePizza = async (req, res) => {
    try {
        const pizza = await Pizza.findByIdAndDelete(req.params.id);
        if (!pizza) return res.status(404).json({ message: "Pizza não encontrada" });
        res.json({ message: "Pizza removida com sucesso" });
    } catch (err) {
        res.status(500).json({ message: "Erro ao remover pizza" });
    }
};
