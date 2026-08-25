# Portal IBGE Explorer

Landing page desenvolvida em **React + TypeScript** que consome a API pública do IBGE para permitir a busca de cidades e estados brasileiros diretamente no navegador, sem precisar de back-end próprio.

---

## Funcionalidades

- **Busca de cidades com autocomplete:** o usuário digita o nome de um município e recebe sugestões em tempo real. Ao selecionar uma cidade, são exibidas informações como nome, estado, região do país e microrregião.
- **Busca por estado com ranking de população:** o usuário digita o nome (ou sigla) de um estado e, ao selecioná-lo, a aplicação exibe as 10 cidades mais populosas daquele estado com base nos dados do Censo 2022 do IBGE.

---

## Tecnologias

| Tecnologia | Finalidade |
|---|---|
| [React 18](https://react.dev/) | Biblioteca principal de interface |
| [TypeScript 5](https://www.typescriptlang.org/) | Tipagem estática do JavaScript |
| [Vite 4](https://vitejs.dev/) | Ferramenta de build e servidor de desenvolvimento |
| [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) | Suporte ao JSX/React dentro do Vite |
| [API IBGE Localidades](https://servicodados.ibge.gov.br/api/docs/localidades) | Dados de municípios e estados |
| [API IBGE SIDRA](https://servicodados.ibge.gov.br/api/docs/agregados) | Dados populacionais do Censo 2022 |

---

## Como rodar localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado (versão 16 ou superior)
- [Git](https://git-scm.com/) instalado

### Passo a passo

**1. Clone o repositório**
```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

**2. Instale as dependências**
```bash
npm install
```

**3. Crie o arquivo `.env` na raiz do projeto**

Crie um arquivo chamado `.env` na raiz do projeto e adicione as variáveis abaixo com os respectivos valores das URLs da API do IBGE:

```env
VITE_IBGE_API_URL=
VITE_IBGE_API_ESTADOS_URL=
VITE_IBGE_API_POPULACAO_URL=
```

> ⚠️ Os valores dessas variáveis são as URLs públicas da API do IBGE. O arquivo `.env` está listado no `.gitignore` e **não deve ser enviado ao GitHub**.

**4. Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`.

---

## Deploy

O projeto está publicado na Netlify e pode ser acessado pelo link abaixo:

🔗 **`https://hilarious-axolotl-be8088.netlify.app/`**

> As variáveis de ambiente também precisam ser cadastradas no painel da Netlify em: `Project configuration > Environment variables`.

---

## Sobre

Este é um projeto de estudo desenvolvido com foco em:

- **Consumo de API REST** com `fetch` nativo do JavaScript
- **Autocomplete** com filtragem em tempo real de grandes listas de dados
- **Boas práticas de configuração** com variáveis de ambiente (`.env`), evitando expor informações no código-fonte
- **Tipagem estática** com TypeScript para tornar o código mais seguro e legível
- **Componentização** e gerenciamento de estado com React Hooks (`useState`, `useEffect`)
