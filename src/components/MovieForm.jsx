import { useEffect, useState } from 'react';
import { ActorsApi, MoviesApi } from '../api.js';

const initialState = { titulo: '', faixaEtaria: '', genero: '', atores: [] };

export default function MovieForm({ onSaved, movie, onCancel }) {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [actors, setActors] = useState([]);
  const [newActorName, setNewActorName] = useState('');
  const isEdit = !!movie?.id;

  useEffect(() => {
    loadActors();
  }, []);

  useEffect(() => {
    if (movie) {
      setValues({
        titulo: movie.titulo || '',
        faixaEtaria: String(movie.faixaEtaria ?? ''),
        genero: movie.genero || '',
        atores: movie.atores ? [...movie.atores] : [],
      });
    } else {
      setValues(initialState);
    }
  }, [movie]);

  async function loadActors() {
    try { setActors(await ActorsApi.list()); } catch (e) { console.error(e); }
  }

  function validate(v) {
    const errs = {};
    if (!v.titulo?.trim()) errs.titulo = 'Título é obrigatório';
    const fe = Number(v.faixaEtaria);
    if (!Number.isFinite(fe) || fe < 0) errs.faixaEtaria = 'Faixa etária deve ser um número >= 0';
    if (!v.genero?.trim()) errs.genero = 'Gênero é obrigatório';
    // atores optional but must be numbers
    if (!Array.isArray(v.atores)) errs.atores = 'Seleção de atores inválida';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      titulo: values.titulo.trim(),
      faixaEtaria: Number(values.faixaEtaria),
      genero: values.genero.trim(),
      atores: values.atores.map(Number),
    };
    const errs = validate(payload);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      if (isEdit) await MoviesApi.update(movie.id, payload);
      else await MoviesApi.create(payload);
      onSaved?.();
      setValues(initialState);
    } catch (err) {
      // map backend validation errors
      const be = {};
      if (err?.details) {
        if (Array.isArray(err.details)) {
          err.details.forEach((d) => { be[d.field] = d.message; });
        } else if (err.details.missing) {
          be.atores = 'Alguns atores selecionados não existem';
        }
      }
      if (!Object.keys(be).length) be.global = err.message;
      setErrors(be);
    }
  }

  async function handleAddActor(e) {
    e.preventDefault();
    const name = newActorName.trim();
    if (!name) return;
    try {
      const created = await ActorsApi.create({ nome: name });
      setActors((prev) => [...prev, created]);
      setNewActorName('');
    } catch (err) {
      alert(err.message);
    }
  }

  function toggleActor(id) {
    setValues((v) => {
      const set = new Set(v.atores);
      if (set.has(id)) set.delete(id); else set.add(id);
      return { ...v, atores: Array.from(set) };
    });
  }

  return (
    <form onSubmit={handleSubmit} className="movie-form">
      <h2>{isEdit ? 'Editar Filme' : 'Novo Filme'}</h2>
      {errors.global && <div className="error">{errors.global}</div>}
      <div className="field">
        <label>Título</label>
        <input value={values.titulo} onChange={(e) => setValues({ ...values, titulo: e.target.value })} />
        {errors.titulo && <span className="error">{errors.titulo}</span>}
      </div>
      <div className="field">
        <label>Faixa Etária</label>
        <input type="number" min={0} value={values.faixaEtaria} onChange={(e) => setValues({ ...values, faixaEtaria: e.target.value })} />
        {errors.faixaEtaria && <span className="error">{errors.faixaEtaria}</span>}
      </div>
      <div className="field">
        <label>Gênero</label>
        <input value={values.genero} onChange={(e) => setValues({ ...values, genero: e.target.value })} />
        {errors.genero && <span className="error">{errors.genero}</span>}
      </div>
      <div className="field">
        <label>Atores</label>
        <div className="actors-list">
          {actors.map((a) => (
            <label key={a.id} className="checkbox">
              <input type="checkbox" checked={values.atores.includes(a.id)} onChange={() => toggleActor(a.id)} /> {a.nome}
            </label>
          ))}
          {actors.length === 0 && <small>Nenhum ator. Adicione abaixo.</small>}
        </div>
        {errors.atores && <span className="error">{errors.atores}</span>}
        <div className="add-actor">
          <input placeholder="Nome do novo ator" value={newActorName} onChange={(e) => setNewActorName(e.target.value)} />
          <button onClick={handleAddActor}>Adicionar Ator</button>
        </div>
      </div>
      <div className="actions">
        <button type="submit">{isEdit ? 'Salvar' : 'Criar'}</button>
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel}>Cancelar</button>
        )}
      </div>
    </form>
  );
}
