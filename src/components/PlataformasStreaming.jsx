import React from 'react';

export default function PlataformasStreaming({ plataformas }) {
  if (!plataformas || plataformas.length === 0) {
    return (
      <div className="streaming-container">
        <strong className="streaming-label">Onde Assistir:</strong>
        <span className="streaming-empty">Não disponível nos streamings principais.</span>
      </div>
    );
  }

  return (
    <div className="streaming-container">
      <strong className="streaming-label">Onde Assistir (BR):</strong>
      <div className="streaming-list">
        {plataformas.map((plataforma, index) => (
          <span key={index} className="badge streaming-badge">
            {plataforma}
          </span>
        ))}
      </div>
    </div>
  );
}