import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { expenseApi } from '../services/http';

const emptyForm = {
  title: '',
  category: '',
  amount: '',
  date: '',
  paymentMethod: 'Tarjeta',
  note: '',
};

export const ExpensesManager = () => {
  const { auth } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Configura el token JWT para cada peticion privada del CRUD.
  const config = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }),
    [auth.token],
  );

  // Carga todos los gastos del usuario autenticado al entrar al panel.
  const loadExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await expenseApi.get('/', config);
      setExpenses(data);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudieron cargar los gastos.');
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  // Actualiza el formulario y limpia el error del campo que el usuario corrige.
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFormErrors((current) => ({ ...current, [name]: '' }));
  };

  // Valida los campos del CRUD antes de crear o actualizar un gasto.
  const validateForm = () => {
    const nextErrors = {};

    if (form.title.trim().length < 3) {
      nextErrors.title = 'Escribe un concepto con minimo 3 caracteres.';
    }

    if (form.category.trim().length < 3) {
      nextErrors.category = 'La categoria debe tener minimo 3 caracteres.';
    }

    if (!form.amount || Number(form.amount) <= 0) {
      nextErrors.amount = 'Ingresa un monto mayor a 0.';
    }

    if (!form.date) {
      nextErrors.date = 'Selecciona una fecha.';
    }

    if (!form.paymentMethod) {
      nextErrors.paymentMethod = 'Selecciona un metodo de pago.';
    }

    if (form.note.trim().length > 120) {
      nextErrors.note = 'La nota no puede superar 120 caracteres.';
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // Decide si se crea o se actualiza un gasto segun si existe un id en edicion.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    if (!validateForm()) {
      setSubmitting(false);
      return;
    }

    try {
      if (editingId) {
        await expenseApi.put(`/${editingId}`, form, config);
      } else {
        await expenseApi.post('/', form, config);
      }

      setForm(emptyForm);
      setFormErrors({});
      setEditingId('');
      await loadExpenses();
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo guardar el gasto.');
    } finally {
      setSubmitting(false);
    }
  };

  // Pasa los datos del gasto seleccionado al formulario para editarlo.
  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setFormErrors({});
    setForm({
      title: expense.title,
      category: expense.category,
      amount: expense.amount,
      date: expense.date.slice(0, 10),
      paymentMethod: expense.paymentMethod,
      note: expense.note || '',
    });
  };

  // Restaura el formulario al estado inicial cuando se cancela la edicion.
  const handleCancelEdit = () => {
    setEditingId('');
    setFormErrors({});
    setForm(emptyForm);
  };

  // Elimina un gasto y vuelve a consultar la lista actualizada.
  const handleDelete = async (id) => {
    try {
      await expenseApi.delete(`/${id}`, config);
      await loadExpenses();
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo eliminar el gasto.');
    }
  };

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyBudget = 2500000;
  const budgetProgress = Math.min((totalSpent / monthlyBudget) * 100, 100);
  const categoriesCount = new Set(expenses.map((expense) => expense.category)).size;
  const averageTicket = expenses.length ? totalSpent / expenses.length : 0;

  return (
    // Contenedor del dashboard financiero con resumen y panel de movimientos.
    <section className="dashboard-shell">
      <div className="dashboard-content">
        <section className="panel" id="resumen">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Dashboard privado</p>
              <h1>Control de gastos personales</h1>
            </div>
            <span className="status-badge">Sesion de {auth.user?.name}</span>
          </div>

          <div className="stats-grid stats-grid-minimal">
            <article className="stat-card blue">
              <span>Total de gastos</span>
              <strong>{expenses.length}</strong>
            </article>
            <article className="stat-card coral">
              <span>Categorias</span>
              <strong>{categoriesCount}</strong>
            </article>
            <article className="stat-card mint">
              <span>Gastado</span>
              <strong>${totalSpent.toLocaleString('es-CO')}</strong>
            </article>
            <article className="stat-card sand">
              <span>Ticket promedio</span>
              <strong>${averageTicket.toLocaleString('es-CO', { maximumFractionDigits: 0 })}</strong>
            </article>
          </div>

          <div className="chart-card">
            <div className="chart-row">
              <span>Consumo mensual</span>
              <span>
                ${Math.max(monthlyBudget - totalSpent, 0).toLocaleString('es-CO')} disponibles · {budgetProgress.toFixed(0)}%
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-bar" style={{ width: `${budgetProgress}%` }} />
            </div>
          </div>
        </section>

        {/* Zona operativa del CRUD: formulario a la izquierda e historial a la derecha. */}
        <section className="expense-layout" id="mis-gastos">
          <article className="panel expense-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Mis gastos</p>
                <h2>{editingId ? 'Edita un movimiento' : 'Registra un nuevo gasto'}</h2>
              </div>
              <span className="status-badge">{editingId ? 'Modo edicion' : 'Nuevo registro'}</span>
            </div>

            <form className="expense-form expense-form-minimal" onSubmit={handleSubmit}>
              <label className="field">
                <span>Concepto</span>
                <input className="input" name="title" placeholder="Ej. Mercado quincenal" value={form.title} onChange={handleChange} />
                {formErrors.title ? <small className="error-text">{formErrors.title}</small> : null}
              </label>

              <label className="field">
                <span>Categoria</span>
                <input className="input" name="category" placeholder="Ej. Alimentacion" value={form.category} onChange={handleChange} />
                {formErrors.category ? <small className="error-text">{formErrors.category}</small> : null}
              </label>

              <label className="field">
                <span>Monto</span>
                <input className="input" name="amount" type="number" min="0" step="0.01" placeholder="0" value={form.amount} onChange={handleChange} />
                {formErrors.amount ? <small className="error-text">{formErrors.amount}</small> : null}
              </label>

              <label className="field">
                <span>Fecha</span>
                <input className="input" name="date" type="date" value={form.date} onChange={handleChange} />
                {formErrors.date ? <small className="error-text">{formErrors.date}</small> : null}
              </label>

              <label className="field">
                <span>Metodo de pago</span>
                <select className="input" name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
                  <option>Tarjeta</option>
                  <option>Efectivo</option>
                  <option>Transferencia</option>
                  <option>Nequi</option>
                </select>
                {formErrors.paymentMethod ? <small className="error-text">{formErrors.paymentMethod}</small> : null}
              </label>

              <label className="field expense-note-field">
                <span>Nota</span>
                <textarea
                  className="input textarea"
                  name="note"
                  placeholder="Detalle opcional del gasto"
                  value={form.note}
                  onChange={handleChange}
                  rows={4}
                />
                <small className="field-help">{form.note.length}/120 caracteres</small>
                {formErrors.note ? <small className="error-text">{formErrors.note}</small> : null}
              </label>

              <div className="expense-form-actions">
                <button className="button primary" type="submit" disabled={submitting}>
                  {submitting ? 'Guardando...' : editingId ? 'Actualizar gasto' : 'Crear gasto'}
                </button>
                {editingId ? (
                  <button className="button ghost" type="button" onClick={handleCancelEdit}>
                    Cancelar
                  </button>
                ) : null}
              </div>
            </form>
          </article>

          <article className="panel expense-list-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Historial</p>
                <h2>Movimientos recientes</h2>
              </div>
              <span className="status-badge">{expenses.length} registros</span>
            </div>

            {error ? <p className="error-text">{error}</p> : null}
            {loading ? <p className="muted">Cargando gastos...</p> : null}

            {!loading && expenses.length === 0 ? (
              <div className="expense-empty-state">
                <h3>Aun no tienes gastos guardados</h3>
                <p>Empieza por registrar tu primer movimiento para ver el historial ordenado aqui.</p>
              </div>
            ) : null}

            <div className="expense-table expense-table-minimal">
              <div className="expense-head">
                <span>Concepto</span>
                <span>Categoria</span>
                <span>Pago</span>
                <span>Fecha</span>
                <span>Monto</span>
                <span>Acciones</span>
              </div>

              {expenses.map((expense) => (
                <div className="expense-row expense-row-minimal" key={expense._id}>
                  <div>
                    <strong>{expense.title}</strong>
                    <small>{expense.note || 'Sin nota adicional'}</small>
                  </div>
                  <span>{expense.category}</span>
                  <span>{expense.paymentMethod}</span>
                  <span>{new Date(expense.date).toLocaleDateString('es-CO')}</span>
                  <span className="expense-amount">${expense.amount.toLocaleString('es-CO')}</span>
                  <div className="table-actions">
                    <button className="button ghost" type="button" onClick={() => handleEdit(expense)}>
                      Editar
                    </button>
                    <button className="button danger" type="button" onClick={() => handleDelete(expense._id)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <div className="dashboard-api-note" id="api-dashboard">
          <p>Tambien deje el apartado de API dentro del dashboard para que combines datos externos con tu panel privado.</p>
        </div>
      </div>
    </section>
  );
};
