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
