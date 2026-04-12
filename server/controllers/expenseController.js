import mongoose from 'mongoose';
import { Expense } from '../models/Expense.js';

export const getExpenses = async (req, res) => {
  try {
    // Lista los gastos del usuario actual ordenados del mas reciente al mas antiguo.
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1, createdAt: -1 });
    return res.json(expenses);
  } catch {
    return res.status(500).json({ message: 'No se pudieron cargar los gastos' });
  }
};

export const createExpense = async (req, res) => {
  try {
    // Crea un nuevo gasto validando los campos obligatorios del formulario.
    const { title, category, amount, date, paymentMethod, note } = req.body;

    if (!title || !category || !amount || !date || !paymentMethod) {
      return res.status(400).json({ message: 'Completa los campos obligatorios' });
    }

    const expense = await Expense.create({
      user: req.user._id,
      title,
      category,
      amount: Number(amount),
      date,
      paymentMethod,
      note,
    });

    return res.status(201).json(expense);
  } catch {
    return res.status(500).json({ message: 'No se pudo crear el gasto' });
  }
};

export const updateExpense = async (req, res) => {
  try {
    // Verifica el id, localiza el gasto del usuario y actualiza solo los campos enviados.
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Id de gasto invalido' });
    }

    const fields = ['title', 'category', 'amount', 'date', 'paymentMethod', 'note'];
    const updates = {};
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const expense = await Expense.findOne({ _id: id, user: req.user._id });

    if (!expense) {
      return res.status(404).json({ message: 'Gasto no encontrado' });
    }

    fields.forEach((field) => {
      if (updates[field] !== undefined) {
        expense[field] = field === 'amount' ? Number(updates[field]) : updates[field];
      }
    });

    await expense.save();
    return res.json(expense);
  } catch {
    return res.status(500).json({ message: 'No se pudo actualizar el gasto' });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    // Elimina un gasto solo si pertenece al usuario autenticado.
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Id de gasto invalido' });
    }

    const expense = await Expense.findOneAndDelete({ _id: id, user: req.user._id });

    if (!expense) {
      return res.status(404).json({ message: 'Gasto no encontrado' });
    }

    return res.json({ message: 'Gasto eliminado correctamente' });
  } catch {
    return res.status(500).json({ message: 'No se pudo eliminar el gasto' });
  }
};
