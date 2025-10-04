# SeiQueDevo! - Gerenciador Financeiro Kanban

Uma aplicação web moderna para gestão financeira pessoal com uma interface visual e interativa no estilo Kanban. Organize suas receitas e despesas de forma intuitiva, arrastando e soltando seus lançamentos entre categorias.

Agora com suporte a **PWA** para instalação e uso offline, e uma poderosa funcionalidade de **lançamentos recorrentes** para automatizar seu fluxo financeiro.

## ✨ Funcionalidades Principais

  - **Instalável como Aplicativo (PWA):** Instale o FinanKanban no seu computador ou celular para uma experiência de aplicativo nativo, com acesso rápido e funcionamento offline.
  - **Lançamentos Recorrentes:** Crie regras para despesas e receitas mensais (como aluguel, salários e assinaturas) e deixe o sistema gerá-las automaticamente a cada novo mês.
  - **Dashboard Kanban:** Visualize suas finanças como um quadro, onde colunas são categorias e cards são seus lançamentos.
  - **Gestão por Mês:** Navegue facilmente entre os meses para ver o histórico e planejar o futuro.
  - **Drag & Drop:** Mova lançamentos entre categorias de forma simples e veja os totais serem atualizados em tempo real.
  - **Cálculos Automáticos:** O sistema calcula o total por categoria e o saldo do mês (Receitas - Despesas) em tempo real.
  - **Persistência Local:** Seus dados são salvos diretamente no seu navegador. Sem necessidade de cadastro, 100% privado e offline-first.
  - **Temas Dark/Light:** Escolha entre o tema claro ou escuro para uma visualização mais confortável.
  - **Exportação/Importação:** Exporte seus dados para um arquivo JSON como backup ou para compartilhar, e importe-os quando precisar.

## 🚀 Tecnologias Utilizadas

  - **React:** Biblioteca para construção da interface de usuário.
  - **Vite:** Ferramenta de build extremamente rápida para desenvolvimento front-end.
  - **@dnd-kit/core:** Uma biblioteca moderna, leve e acessível para funcionalidades de arrastar e soltar.
  - **vite-plugin-pwa:** Para automação da criação do Service Worker e do manifesto da aplicação, transformando-a em um PWA.
  - **LocalStorage API:** Para armazenamento de dados no lado do cliente.
  - **Variáveis CSS:** Para uma estilização moderna e suporte a temas (Dark/Light).

## 📦 Como Executar o Projeto Localmente

Siga os passos abaixo para ter uma cópia do projeto rodando na sua máquina.

### Pré-requisitos

  - [Node.js](https://nodejs.org/) (versão 16 ou superior)
  - npm ou yarn

### Instalação

1.  **Clone o repositório:**

    ```bash
    git clone  https://github.com/mflavioas/Finance-Kanban.git
    ```

2.  **Navegue até o diretório do projeto:**

    ```bash
    cd Finance-Kanban
    ```

3.  **Instale as dependências:**

    ```bash
    npm install
    ```

4.  **Inicie o servidor de desenvolvimento:**

    ```bash
    npm run dev
    ```

5.  Abra seu navegador e acesse `http://localhost:5173` (ou a porta indicada no seu terminal).

> **Nota Importante sobre PWA:** As funcionalidades de PWA (como instalação e service worker offline) não funcionam no servidor de desenvolvimento (`npm run dev`). Para testá-las, você deve gerar a versão de produção:
>
> ```bash
> # 1. Crie a build de produção
> npm run build
> ```

> # 2\. Inicie um servidor para a build
>
> npm run preview
>
> ```
> ```

## 📁 Estrutura do Projeto

O projeto é organizado de forma a separar responsabilidades, facilitando a manutenção e escalabilidade.

```
src/
├── assets/         # Estilos globais, fontes e imagens (logo)
├── components/     # Componentes React reutilizáveis (Board, Card, Header, Modal)
├── hooks/          # Hooks customizados (ex: useLocalStorage)
├── App.jsx         # Componente principal que organiza a aplicação
└── main.jsx        # Ponto de entrada da aplicação
public/             # Arquivos estáticos (ícones do PWA)
```

## 🔮 Próximos Passos e Melhorias

  - [ ] Implementar uma área de relatórios com gráficos.
  - [ ] Adicionar funcionalidade de busca para encontrar lançamentos.
  - [ ] Permitir o uso de tags/etiquetas para categorizar melhor as transações.
  - [ ] Criar uma visualização anual com o resumo de cada mês.

