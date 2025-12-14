# Frontend Web

Este é o frontend web do projeto IGESC CONECTA.

## Tecnologias utilizadas

React 19

TypeScript

Vite

React Router DOM

Axios

Material UI

MUI X (Date Pickers / Charts)

Styled Components

Bootstrap

Day.js

JWT Decode

React Toastify

OpenApiTools

## Como executar

Clone o repositório:

```
git clone <url-do-repo>
cd <nome-da-pasta>
```

Instale as dependências:

```
npm install
```

Execute o projeto:

```
npm run dev
```

Acesse no navegador:
http://localhost:5173

## Scripts disponíveis

npm run dev → inicia o servidor de desenvolvimento

npm run build → gera a versão de produção

npm run preview → pré-visualiza a build de produção

npm run lint → roda o ESLint

npm run typecheck → verifica tipos com TypeScript

npm run test → executa testes com Vitest

npm run format → formata o código com Prettier

npm run generate-api -> gera integração com backend

## Comandos Firebase
firebase login -> faz login no Firebase
firebase logout -> faz logout no Firebase
firebase deploy --only hosting --project igesc-conecta -> faz o deploy do código no Firebase

## Estrutura do projeto
```
src/
├── api/ # Endpoints prontos para uso, gerado pelo openapitools
├── assets/ # Arquivos estáticos (imagens,fontes,ícones)
├── components/ # Componentes reutilizáveis
├── hooks/ # Custom hooks
├── pages/ # Páginas da aplicação
├── routes/ # Configuração de rotas
├── services/ # Regras Api
├── store/ # Estado global (Context/Redux/Zustand)
├── styles/ # Estilos globais e temas
├── types/ # Types/interfaces em TypeScript
├── utils/ # Funções utilitárias
├── App.tsx # Componente principal
└── main.tsx # Ponto de entrada da aplicação
```

## Qualidade e boas práticas

ESLint + Prettier para linting e formatação

TypeScript com strict mode

Vitest + Testing Library para testes unitários

Aliases configurados (@ → src) no Vite/TS

CI/CD (opcional) com GitHub Actions