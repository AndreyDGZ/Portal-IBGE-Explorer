// Definimos as interfaces (tipos) para ajudar o TypeScript a entender o formato dos dados que vêm da API
export interface Regiao {
  id: number;
  sigla: string;
  nome: string;
}

export interface UF {
  id: number;
  sigla: string;
  nome: string;
  regiao: Regiao;
}

export interface Mesorregiao {
  id: number;
  nome: string;
  UF: UF;
}

export interface Microrregiao {
  id: number;
  nome: string;
  mesorregiao: Mesorregiao;
}

export interface Municipio {
  id: number;
  nome: string;
  microrregiao: Microrregiao;
}

// Novos tipos para a busca de estados
export interface Estado {
  id: number;
  sigla: string;
  nome: string;
  regiao: Regiao;
}

// Tipos para a resposta da API do SIDRA (População)
export interface LocalidadeSidra {
  id: string;
  nome: string;
}

export interface SerieSidra {
  "2022": string; // A chave do ano vem como string
}

export interface ResultadoSidra {
  localidade: LocalidadeSidra;
  serie: SerieSidra;
}

export interface RespostaSidra {
  id: string;
  variavel: string;
  unidade: string;
  resultados: [{
    series: ResultadoSidra[];
  }];
}

export interface CidadePopulacao {
  id: string;
  nome: string;
  populacao: number;
}
