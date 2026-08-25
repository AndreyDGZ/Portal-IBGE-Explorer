import { useState, useEffect } from 'react';
import './App.css';
import { Municipio, Estado, RespostaSidra, CidadePopulacao } from './types';

function App() {
  // --- ESTADOS DA FUNCIONALIDADE DE BUSCA DE CIDADES ---
  const [buscaCidade, setBuscaCidade] = useState('');
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [sugestoesCidade, setSugestoesCidade] = useState<Municipio[]>([]);
  const [cidadeSelecionada, setCidadeSelecionada] = useState<Municipio | null>(null);

  // --- ESTADOS DA NOVA FUNCIONALIDADE DE BUSCA DE ESTADOS ---
  const [buscaEstado, setBuscaEstado] = useState('');
  const [estadosBrasil, setEstadosBrasil] = useState<Estado[]>([]);
  const [sugestoesEstado, setSugestoesEstado] = useState<Estado[]>([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState<Estado | null>(null);
  
  const [cidadesPopulosas, setCidadesPopulosas] = useState<CidadePopulacao[]>([]);
  const [carregandoPopulosas, setCarregandoPopulosas] = useState(false);

  // Carregamento inicial (Cidades e Estados)
  useEffect(() => {
    // Pegando as variáveis de ambiente do Vite
    const urlApiCidades = import.meta.env.VITE_IBGE_API_URL;
    const urlApiEstados = import.meta.env.VITE_IBGE_API_ESTADOS_URL;

    // Busca de Cidades
    fetch(urlApiCidades)
      .then((resposta) => resposta.json())
      .then((dados) => setMunicipios(dados))
      .catch((erro) => console.error("Erro ao buscar cidades:", erro));

    // Busca de Estados
    fetch(urlApiEstados)
      .then((resposta) => resposta.json())
      .then((dados) => setEstadosBrasil(dados))
      .catch((erro) => console.error("Erro ao buscar estados:", erro));
  }, []);

  // --- LÓGICA DA BUSCA DE CIDADES ---
  const handleBuscaCidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setBuscaCidade(valor);

    if (valor.trim().length > 0) {
      const termoBusca = valor.toLowerCase();
      const cidadesFiltradas = municipios.filter((cidade) =>
        cidade.nome.toLowerCase().includes(termoBusca)
      );
      setSugestoesCidade(cidadesFiltradas.slice(0, 10));
    } else {
      setSugestoesCidade([]);
      setCidadeSelecionada(null);
    }
  };

  const selecionarCidade = (cidade: Municipio) => {
    setCidadeSelecionada(cidade);
    setBuscaCidade(cidade.nome);
    setSugestoesCidade([]);
  };

  // --- LÓGICA DA BUSCA DE ESTADOS ---
  const handleBuscaEstadoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setBuscaEstado(valor);

    if (valor.trim().length > 0) {
      const termoBusca = valor.toLowerCase();
      // Filtra estados pelo nome ou pela sigla (ex: SP ou São Paulo)
      const estadosFiltrados = estadosBrasil.filter((est) =>
        est.nome.toLowerCase().includes(termoBusca) || est.sigla.toLowerCase().includes(termoBusca)
      );
      setSugestoesEstado(estadosFiltrados);
    } else {
      setSugestoesEstado([]);
      setEstadoSelecionado(null);
      setCidadesPopulosas([]);
    }
  };

  const selecionarEstado = async (estado: Estado) => {
    setEstadoSelecionado(estado);
    setBuscaEstado(`${estado.nome} - ${estado.sigla}`);
    setSugestoesEstado([]);
    
    // Inicia a busca das 10 cidades mais populosas
    buscarCidadesPopulosas(estado.id);
  };

  const buscarCidadesPopulosas = async (idEstado: number) => {
    setCarregandoPopulosas(true);
    
    // Pega a URL base da variável de ambiente
    const urlApiPopulacaoBase = import.meta.env.VITE_IBGE_API_POPULACAO_URL;
    
    // Monta a URL completa adicionando o parâmetro de localidades para o estado escolhido
    // N6[N3[{ID_ESTADO}]] significa: Traz todos os N6 (Municípios) que pertencem ao N3 (Estado) informado
    const urlCompleta = `${urlApiPopulacaoBase}?localidades=N6[N3[${idEstado}]]`;

    try {
      const resposta = await fetch(urlCompleta);
      const dados: RespostaSidra[] = await resposta.json();
      
      // Valida se a API retornou o formato esperado
      if (dados && dados.length > 0 && dados[0].resultados && dados[0].resultados.length > 0) {
        const series = dados[0].resultados[0].series;
        
        // Mapeamos os dados brutos da API para o nosso formato mais simples
        const cidadesExtraidas: CidadePopulacao[] = series.map(item => ({
          id: item.localidade.id,
          // A API retorna o nome no formato "Nome da Cidade - UF", usamos split para limpar
          nome: item.localidade.nome.split(' - ')[0],
          populacao: parseInt(item.serie["2022"]) || 0
        }));

        // Ordenamos do maior para o menor (decrescente) usando a população
        const cidadesOrdenadas = cidadesExtraidas.sort((a, b) => b.populacao - a.populacao);
        
        // Pegamos apenas as 10 primeiras
        setCidadesPopulosas(cidadesOrdenadas.slice(0, 10));
      } else {
        setCidadesPopulosas([]);
      }
    } catch (erro) {
      console.error("Erro ao buscar população:", erro);
    } finally {
      setCarregandoPopulosas(false);
    }
  };

  return (
    <div className="layout-principal">
      <h1 className="titulo-app">Portal IBGE Explorer</h1>
      
      <div className="cards-container">
        {/* CARD 1: BUSCA DE CIDADES */}
        <div className="card">
          <h2>Buscar Cidade</h2>
          
          <div className="busca-container">
            <input
              type="text"
              placeholder="Digite o nome da cidade..."
              value={buscaCidade}
              onChange={handleBuscaCidadeChange}
              className="input-busca"
            />
            
            {sugestoesCidade.length > 0 && (
              <ul className="lista-sugestoes">
                {sugestoesCidade.map((cidade) => (
                  <li key={cidade.id} onClick={() => selecionarCidade(cidade)}>
                    {cidade.nome} - {cidade.microrregiao.mesorregiao.UF.sigla}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {cidadeSelecionada && (
            <div className="detalhes-selecao">
              <h3>Detalhes</h3>
              <p><strong>Nome:</strong> {cidadeSelecionada.nome}</p>
              <p><strong>Estado:</strong> {cidadeSelecionada.microrregiao.mesorregiao.UF.nome} ({cidadeSelecionada.microrregiao.mesorregiao.UF.sigla})</p>
              <p><strong>Região:</strong> {cidadeSelecionada.microrregiao.mesorregiao.UF.regiao.nome}</p>
              <p><strong>Microrregião:</strong> {cidadeSelecionada.microrregiao.nome}</p>
            </div>
          )}
        </div>

        {/* CARD 2: BUSCA DE ESTADOS E POPULAÇÃO */}
        <div className="card">
          <h2>Estados e População</h2>
          
          <div className="busca-container">
            <input
              type="text"
              placeholder="Digite o estado (ex: São Paulo)..."
              value={buscaEstado}
              onChange={handleBuscaEstadoChange}
              className="input-busca"
            />
            
            {sugestoesEstado.length > 0 && (
              <ul className="lista-sugestoes">
                {sugestoesEstado.map((estado) => (
                  <li key={estado.id} onClick={() => selecionarEstado(estado)}>
                    {estado.nome} - {estado.sigla}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {estadoSelecionado && (
            <div className="detalhes-selecao">
              <h3>10 Maiores Cidades ({estadoSelecionado.sigla})</h3>
              
              {carregandoPopulosas ? (
                <p>Carregando Censo 2022...</p>
              ) : cidadesPopulosas.length > 0 ? (
                <ul className="lista-populacao">
                  {cidadesPopulosas.map((cidade) => (
                    <li key={cidade.id}>
                      <span className="nome-cidade-pop"><strong>{cidade.nome}:</strong></span>
                      <span className="numero-populacao">
                        {cidade.populacao.toLocaleString('pt-BR')} hab.
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Não foi possível carregar as cidades.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
