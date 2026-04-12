import { useEffect, useState } from 'react';
import { publicApi } from '../services/http';

export const ApiExplorer = () => {
  const [characters, setCharacters] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Consulta la API publica cada vez que cambia la pagina o el texto de busqueda.
  useEffect(() => {
    const controller = new AbortController();

    const fetchCharacters = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await publicApi.get('/character', {
          params: {
            page,
            name: query || undefined,
          },
          signal: controller.signal,
        });
        setCharacters(data.results);
        setPages(data.info.pages);
      } catch (err) {
        if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
          setCharacters([]);
          setPages(1);
          setError('No encontramos resultados para esa busqueda.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
    return () => controller.abort();
  }, [page, query]);

  // Reinicia la paginacion cada vez que el usuario cambia el texto de busqueda.
  const handleSearch = (event) => {
    setPage(1);
    setQuery(event.target.value);
  };

  return (
    // Seccion de demostracion para buscar personajes y paginar resultados.
    <section className="panel api-panel" id="api">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Explorador de API</p>
          <h2>Buscador y paginacion con Axios</h2>
        </div>
        <span className="status-badge">Rick and Morty API</span>
      </div>

      <div className="search-row">
        <input
          className="input"
          type="search"
          placeholder="Busca por nombre de personaje"
          value={query}
          onChange={handleSearch}
        />
        <div className="pagination-inline">
          <button className="button ghost" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>
            Anterior
          </button>
          <span>
            Pagina {page} de {pages}
          </span>
          <button className="button ghost" disabled={page === pages} onClick={() => setPage((current) => current + 1)}>
            Siguiente
          </button>
        </div>
      </div>

      {loading ? <p className="muted">Cargando personajes...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      <div className="character-grid">
        {characters.map((character) => (
          <article className="character-card" key={character.id}>
            <img src={character.image} alt={character.name} />
            <div>
              <h3>{character.name}</h3>
              <p>{character.species}</p>
              <span>
                {character.status} - {character.gender}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
