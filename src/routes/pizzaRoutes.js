import express from "express";
import { getPizzas, getPizzaById, createPizza, updatePizza, deletePizza } from "../controllers/pizzaController.js";
import { auth, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Público
router.get("/", getPizzas);
router.get("/:id", getPizzaById);

// Admin
router.post("/", auth, authorize("admin"), createPizza);
router.put("/:id", auth, authorize("admin"), updatePizza);
router.delete("/:id", auth, authorize("admin"), deletePizza);

export default router;
