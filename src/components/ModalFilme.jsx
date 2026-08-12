import React from 'react';
import PlataformasStreaming from './PlataformasStreaming';

export default function ModalFilme({ filmeSelecionado, carregandoDetalhes, aoFechar }) {
  if (!filmeSelecionado && !carregandoDetalhes) return null;

  return (
    <div className="modal-overlay" onClick={aoFechar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={aoFechar}>✕</button>

        {carregandoDetalhes ? (
          <div className="status-msg">Carregando detalhes, trailer e streaming...</div>
        ) : (
          <div className="modal-body">
            <img 
              src={filmeSelecionado.Poster !== 'N/A' ? filmeSelecionado.Poster : 'https://via.placeholder.com/300x450?text=Sem+Poster'} 
              alt={filmeSelecionado.Title} 
              className="modal-poster"
            />
            <div className="modal-details">
              <h2>{filmeSelecionado.Title} ({filmeSelecionado.Year})</h2>

              <div className="badges">
                <span className="badge rating">⭐ {filmeSelecionado.imdbRating}</span>
                <span className="badge">{filmeSelecionado.Runtime}</span>
                <span className="badge">{filmeSelecionado.Genre}</span>
              </div>

              {/* Plataformas de Streaming */}
              <PlataformasStreaming plataformas={filmeSelecionado.Plataformas} />

              <p className="plot">
                <strong>Sinopse (PT):</strong> {filmeSelecionado.SinopsePT}
              </p>
              <p><strong>Elenco:</strong> {filmeSelecionado.Actors}</p>
              <p><strong>Direção:</strong> {filmeSelecionado.Director}</p>

              {/* Trailer Incorporado do YouTube */}
              {filmeSelecionado.TrailerKey && (
                <div className="trailer-container">
                  <strong>Trailer Oficial:</strong>
                  <div className="video-responsive">
                    <iframe
                      src={`https://www.youtube.com/embed/${filmeSelecionado.TrailerKey}`}
                      title={`Trailer de ${filmeSelecionado.Title}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}