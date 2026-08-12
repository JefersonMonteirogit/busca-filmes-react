import React from 'react';

export default function GradeFilmes({ filmes, abrirDetalhesFilme }) {
  return (
    <div className="movie-grid">
      {filmes.map((filme) => (
        <div 
          key={filme.imdbID} 
          className="movie-card"
          onClick={() => abrirDetalhesFilme(filme.imdbID)}
        >
          <div className="poster-wrapper">
            <img
              src={filme.Poster !== 'N/A' ? filme.Poster : 'https://via.placeholder.com/300x450?text=Sem+Imagem'}
              alt={filme.Title}
            />
          </div>
          <div className="movie-info">
            <h3>{filme.Title}</h3>
            <span className="movie-year">{filme.Year}</span>
          </div>
        </div>
      ))}
    </div>
  );
}