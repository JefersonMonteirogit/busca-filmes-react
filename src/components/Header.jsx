import React from 'react';

const CATEGORIAS = ['Suspense', 'Comédia', 'Anime', 'Terror', 'Ficção Científica','Romance','Drama'];

export default function Header({ 
  termoBusca, 
  setTermoBusca, 
  aoBuscar, 
  categoriaAtiva, 
  aoClicarCategoria 
}) {
  return (
    <header className="header">
      <h1>🎬 Hora da Seção</h1>
      <p>Busque seus filmes e séries favoritos em tempo real</p>
      
      <form onSubmit={aoBuscar} className="search-form">
        <input
          type="text"
          placeholder="Digite o nome de um filme (ex: Homem de Ferro, Matrix)..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      <div className="category-container">
        {CATEGORIAS.map((categoria) => (
          <button
            key={categoria}
            className={`category-btn ${categoriaAtiva === categoria ? 'active' : ''}`}
            onClick={() => aoClicarCategoria(categoria)}
          >
            {categoria}
          </button>
        ))}
      </div>
    </header>
  );
}