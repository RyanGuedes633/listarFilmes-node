import { useEffect, useState } from 'react';
import { MoviesApi } from '../api.js';
import MovieForm from './MovieForm.jsx';

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { refresh(); }, []);

  async function refresh() {
    setLoading(true); setError('');
    try { setMovies(await MoviesApi.list()); }
    catch (e) { setError(e.message || 'Erro ao carregar filmes'); }
    finally { setLoading(false); }
  }

  function onCreate() { setEditing(null); setShowForm(true); }
  function onEdit(movie) { setEditing(movie); setShowForm(true); }
  async function onDelete(movie) {
    if (!confirm(`Excluir filme "${movie.titulo}"?`)) return;
    try { await MoviesApi.delete(movie.id); await refresh(); }
    catch (e) { alert(e.message || 'Erro ao excluir'); }
  }

  function onSaved() { setShowForm(false); setEditing(null); refresh(); }

  return (
    <div className="movie-list">
      <div className="header">
        <h1>Cadastro de Filmes</h1>
        <button onClick={onCreate}>Novo Filme</button>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <MovieForm movie={editing} onSaved={onSaved} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {loading && <p>Carregando...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <table className="table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Faixa Etária</th>
              <th>Gênero</th>
              <th>Atores</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((m) => (
              <tr key={m.id}>
                <td>{m.titulo}</td>
                <td>{m.faixaEtaria}</td>
                <td>{m.genero}</td>
                <td>{(m.atoresDetalhes || []).map((a) => a?.nome).filter(Boolean).join(', ')}</td>
                <td>
                  <button onClick={() => onEdit(m)}>Editar</button>
                  <button className="danger" onClick={() => onDelete(m)}>Excluir</button>
                </td>
              </tr>
            ))}
            {movies.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center' }}>Nenhum filme cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
