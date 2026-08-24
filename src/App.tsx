import { useState, useEffect } from 'react';
import './App.css';
import { Municipio } from './types';

function App() {
  // Estado para armazenar o que o usuário digita na busca
  const [busca, setBusca] = useState('');
  
  // Estado para armazenar todos os municípios retornados pela API
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  
  // Estado para armazenar as sugestões filtradas baseadas na busca
  const [sugestoes, setSugestoes] = useState<Municipio[]>([]);
  
  // Estado para armazenar a cidade que o usuário selecionou clicando
  const [cidadeSelecionada, setCidadeSelecionada] = useState<Municipio | null>(null);

  // useEffect roda quando o componente é montado na tela
  useEffect(() => {
    // Acessamos a variável de ambiente que guarda a URL da API
    // No Vite, variáveis de ambiente que começam com VITE_ são expostas no import.meta.env
    const urlApi = import.meta.env.VITE_IBGE_API_URL;

    // Fazemos a requisição para a API
    fetch(urlApi)
      .then((resposta) => resposta.json())
      .then((dados) => {
        // Guardamos os dados no estado
        setMunicipios(dados);
      })
      .catch((erro) => console.error("Erro ao buscar cidades:", erro));
  }, []); // Array de dependências vazio significa que roda apenas uma vez no carregamento

  // Função que lida com a digitação no campo de busca
  const handleBuscaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setBusca(valor);

    // Se o usuário digitou algo, filtramos as cidades
    if (valor.trim().length > 0) {
      // Convertendo para minúsculo para a busca não ser sensível a maiúsculas/minúsculas
      const termoBusca = valor.toLowerCase();
      const cidadesFiltradas = municipios.filter((cidade) =>
        cidade.nome.toLowerCase().includes(termoBusca)
      );
      
      // Limitamos a 10 sugestões para não poluir a tela
      setSugestoes(cidadesFiltradas.slice(0, 10));
    } else {
      // Se apagar tudo, limpamos as sugestões e a cidade selecionada
      setSugestoes([]);
      setCidadeSelecionada(null);
    }
  };

  // Função chamada ao clicar em uma sugestão
  const selecionarCidade = (cidade: Municipio) => {
    setCidadeSelecionada(cidade); // Define a cidade escolhida para mostrar os detalhes
    setBusca(cidade.nome);        // Preenche o input com o nome da cidade
    setSugestoes([]);             // Limpa a lista de sugestões
  };

  return (
    <div className="container">
      <h1>Buscar Cidade Brasileira</h1>
      
      <div className="busca-container">
        <input
          type="text"
          placeholder="Digite o nome da cidade..."
          value={busca}
          onChange={handleBuscaChange}
          className="input-busca"
        />
        
        {/* Mostra a lista de sugestões apenas se houver alguma */}
        {sugestoes.length > 0 && (
          <ul className="lista-sugestoes">
            {sugestoes.map((cidade) => (
              <li 
                key={cidade.id} 
                onClick={() => selecionarCidade(cidade)}
              >
                {cidade.nome} - {cidade.microrregiao.mesorregiao.UF.sigla}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Se uma cidade foi selecionada, exibe os detalhes dela */}
      {cidadeSelecionada && (
        <div className="detalhes-cidade">
          <h2>Detalhes da Cidade</h2>
          <p><strong>Nome:</strong> {cidadeSelecionada.nome}</p>
          <p><strong>Estado:</strong> {cidadeSelecionada.microrregiao.mesorregiao.UF.nome} ({cidadeSelecionada.microrregiao.mesorregiao.UF.sigla})</p>
          <p><strong>Região do País:</strong> {cidadeSelecionada.microrregiao.mesorregiao.UF.regiao.nome}</p>
          <p><strong>Mesorregião:</strong> {cidadeSelecionada.microrregiao.mesorregiao.nome}</p>
          <p><strong>Microrregião:</strong> {cidadeSelecionada.microrregiao.nome}</p>
        </div>
      )}
    </div>
  );
}

export default App;
