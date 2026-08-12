import React, { useState, useEffect } from 'react';
import './App.css';

import Header from './components/Header';
import GradeFilmes from './components/GradeFilmes';
import ModalFilme from './components/ModalFilme';

// Leitura segura das chaves de API a partir das variáveis de ambiente
const CHAVE_API = import.meta.env.VITE_OMDB_KEY;
const CHAVE_TMDB = import.meta.env.VITE_TMDB_KEY;

const BUSCAS_EM_DESTAQUE = ['Avengers', 'Batman', 'Spider-Man', 'Dune', 'Avatar', 'Oppenheimer'];

export default function App() {
  const [termoBusca, setTermoBusca] = useState('');
  const [tituloSecao, setTituloSecao] = useState('Filmes em Destaque');
  const [categoriaAtiva, setCategoriaAtiva] = useState('');
  const [filmes, setFilmes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [filmeSelecionado, setFilmeSelecionado] = useState(null);
  const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);

  // Tradutor com limitação de caracteres
  const traduzirTexto = async (texto, deIdioma, paraIdioma) => {
    if (!texto || texto === 'N/A') return texto;
    try {
      const textoCortado = texto.length > 450 ? texto.slice(0, 450) + '...' : texto;

      const resposta = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textoCortado)}&langpair=${deIdioma}|${paraIdioma}`
      );
      const dados = await resposta.json();

      if (dados.responseStatus !== 200) return textoCortado;

      return dados.responseData?.translatedText || textoCortado;
    } catch (err) {
      return texto;
    }
  };

  // Busca conjunta de Plataformas de Streaming + Trailer na TMDB
  const buscarDadosTMDB = async (imdbId) => {
    try {
      const resFind = await fetch(
        `https://api.themoviedb.org/3/find/${imdbId}?api_key=${CHAVE_TMDB}&external_source=imdb_id`
      );
      const dataFind = await resFind.json();
      const tmdbId = dataFind.movie_results[0]?.id;

      if (!tmdbId) return { plataformas: [], trailerKey: null };

      const [resProviders, resVideos] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/watch/providers?api_key=${CHAVE_TMDB}`),
        fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/videos?api_key=${CHAVE_TMDB}`)
      ]);

      const dataProviders = await resProviders.json();
      const dataVideos = await resVideos.json();

      const provedoresBR = dataProviders.results?.BR?.flatrate || [];
      const plataformas = provedoresBR.map((p) => p.provider_name);

      const trailer = dataVideos.results?.find(
        (v) => v.site === 'YouTube' && v.type === 'Trailer'
      ) || dataVideos.results?.[0];

      return {
        plataformas,
        trailerKey: trailer ? trailer.key : null
      };
    } catch (err) {
      console.error('Erro ao buscar dados na TMDB:', err);
      return { plataformas: [], trailerKey: null };
    }
  };

  // Busca principal de Filmes na OMDb
  const buscarFilmes = async (termo) => {
    setCarregando(true);
    setErro('');

    try {
      const termoEmIngles = await traduzirTexto(termo, 'pt-BR', 'en');
      const resposta = await fetch(
        `https://www.omdbapi.com/?apikey=${CHAVE_API}&s=${encodeURIComponent(termoEmIngles)}`
      );
      const dados = await resposta.json();

      if (dados.Response === 'True') {
        setFilmes(dados.Search);
      } else {
        setFilmes([]);
        setErro(dados.Error === 'Movie not found!' ? 'Nenhum filme encontrado.' : dados.Error);
      }
    } catch (err) {
      setErro('Erro de conexão ao buscar filmes.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    const termoAleatorio = BUSCAS_EM_DESTAQUE[Math.floor(Math.random() * BUSCAS_EM_DESTAQUE.length)];
    buscarFilmes(termoAleatorio);
  }, []);

  const aoBuscar = (e) => {
    e.preventDefault();
    if (!termoBusca.trim()) return;
    setCategoriaAtiva('');
    setTituloSecao(`Resultados para: "${termoBusca}"`);
    buscarFilmes(termoBusca);
  };

  const aoClicarCategoria = (categoria) => {
    setCategoriaAtiva(categoria);
    setTermoBusca('');
    setTituloSecao(`Categoria: ${categoria}`);
    buscarFilmes(categoria);
  };

  const abrirDetalhesFilme = async (id) => {
    setCarregandoDetalhes(true);
    try {
      const resposta = await fetch(
        `https://www.omdbapi.com/?apikey=${CHAVE_API}&i=${id}&plot=short`
      );
      const dados = await resposta.json();

      if (dados.Response === 'True') {
        const sinopseTraduzida = await traduzirTexto(dados.Plot, 'en', 'pt-BR');
        const { plataformas, trailerKey } = await buscarDadosTMDB(id);

        setFilmeSelecionado({ 
          ...dados, 
          SinopsePT: sinopseTraduzida,
          Plataformas: plataformas,
          TrailerKey: trailerKey
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCarregandoDetalhes(false);
    }
  };

  return (
    <div className="app-container">
      <Header 
        termoBusca={termoBusca}
        setTermoBusca={setTermoBusca}
        aoBuscar={aoBuscar}
        categoriaAtiva={categoriaAtiva}
        aoClicarCategoria={aoClicarCategoria}
      />

      <main className="content">
        <h2 style={{ marginBottom: '20px', fontSize: '1.2rem', color: '#94a3b8' }}>
          {tituloSecao}
        </h2>

        {carregando && <div className="status-msg">🔍 Pesquisando e traduzindo...</div>}
        {erro && <p className="error-msg">{erro}</p>}

        {!carregando && !erro && (
          <GradeFilmes filmes={filmes} abrirDetalhesFilme={abrirDetalhesFilme} />
        )}
      </main>

      <ModalFilme 
        filmeSelecionado={filmeSelecionado}
        carregandoDetalhes={carregandoDetalhes}
        aoFechar={() => setFilmeSelecionado(null)}
      />
    </div>
  );
}