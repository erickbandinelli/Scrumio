🃏 Planning Poker Online
Bem-vindo ao Planning Poker Online, uma ferramenta interativa e colaborativa para estimativa de tarefas em equipas ágeis. Este projeto permite que equipas criem salas virtuais, votem em estimativas de esforço (pontos de história ou horas) e revelem os resultados em tempo real, facilitando a comunicação e o consenso.

✨ Funcionalidades
Criação de Salas Personalizadas: Crie salas com nomes únicos.

Gestão de Criador da Sala: O primeiro a entrar na sala torna-se o criador, com privilégios de administração.

Estimativa Flexível: Escolha entre o modo "Pontos de Estória" (sequência Fibonacci) ou "Estimativa de Tempo (Horas)", onde 1 sprint equivale a 80 horas (2 semanas).

Votação em Tempo Real: Os jogadores votam secretamente e os resultados são exibidos após a revelação.

Revelação de Votos: O criador da sala pode revelar os votos de todos os participantes.

Reinício de Rodada: O criador pode reiniciar a votação para uma nova tarefa.

Cópia de Link da Sala: Partilhe facilmente o link da sala com a sua equipa.

Edição do Nome da Sala: O criador pode alterar o nome da sala a qualquer momento.

Saída e Exclusão de Sala:

O criador da sala pode excluí-la ao sair.

Outros jogadores são removidos da sala ao sair, mas a sala permanece ativa se o criador ainda estiver presente ou se houver outros jogadores.

A sala é automaticamente limpa se o criador sair e não houver mais jogadores.

Múltiplas Salas Simultâneas: Suporte para várias sessões de Planning Poker em paralelo.

Mensagens de Feedback: Notificações amigáveis para ações do utilizador (ex: link copiado, nome atualizado).

🚀 Tecnologias Utilizadas
React: Biblioteca JavaScript para construção de interfaces de utilizador.

TypeScript: Superset do JavaScript que adiciona tipagem estática.

Firebase Realtime Database: Base de dados NoSQL em tempo real para sincronização de dados entre clientes.

Firebase Authentication: Para autenticação de utilizadores (incluindo autenticação anónima e personalizada).

Zustand: Uma pequena, rápida e escalável solução de gestão de estado.

React Router DOM: Para gestão de rotas na aplicação.

Tailwind CSS: Framework CSS utilitário para estilização rápida e responsiva.

🛠️ Como Usar (Desenvolvimento Local)
Para configurar e executar o projeto no seu ambiente local:

Clone o Repositório:

git clone <URL_DO_SEU_REPOSITORIO>
cd planning-poker-online

Instale as Dependências:

npm install

# ou

yarn install

Configuração do Firebase:

Crie um projeto no Firebase Console.

Configure o Realtime Database e o Firebase Authentication (ative a autenticação anónima).

Obtenha as suas credenciais de configuração do Firebase.

Crie um arquivo .env na raiz do projeto (na mesma pasta de package.json).

Preencha o arquivo .env com as suas credenciais do Firebase, seguindo o formato REACT*APP* para as variáveis:

REACT_APP_FIREBASE_API_KEY='SUA_API_KEY'
REACT_APP_FIREBASE_AUTH_DOMAIN='SEU_AUTH_DOMAIN'
REACT_APP_FIREBASE_DATABASE_URL='SUA_DATABASE_URL'
REACT_APP_FIREBASE_PROJECT_ID='SEU_PROJECT_ID'
REACT_APP_FIREBASE_STORAGE_BUCKET='SEU_STORAGE_BUCKET'
REACT_APP_FIREBASE_MESSAGING_SENDER_ID='SEU_MESSAGING_SENDER_ID'
REACT_APP_FIREBASE_APP_ID='SEU_APP_ID'

Importante: Adicione .env ao seu arquivo .gitignore para não versionar suas credenciais.

Execute o Projeto:

npm start

# ou

yarn start

O aplicativo será aberto no seu navegador em http://localhost:3000.

☁️ Deploy na Vercel
Para implementar o seu aplicativo na Vercel:

Repositório Git: Certifique-se de que o seu código está num repositório Git (GitHub, GitLab, Bitbucket).

Vercel Dashboard:

Aceda ao Vercel Dashboard.

Clique em "New Project" e importe o seu repositório Git.

A Vercel detetará automaticamente que é um projeto React.

Variáveis de Ambiente na Vercel:

Durante a configuração do projeto na Vercel, vá para Settings > Environment Variables.

Adicione cada uma das variáveis do seu arquivo .env (ex: REACT_APP_FIREBASE_API_KEY) com os seus respetivos valores. A Vercel injetará estas variáveis no ambiente de build e runtime.

Deploy:

Confirme as configurações e inicie o deploy. A Vercel construirá e publicará a sua aplicação.

📂 Estrutura do Projeto
.
├── public/
├── src/
│ ├── components/
│ │ └── MessageBox.tsx # Componente para mensagens de feedback
│ ├── store/
│ │ └── roomStore.ts # Gestão de estado da sala com Zustand
│ ├── App.tsx # Componente principal para criar salas
│ ├── Room.tsx # Componente para a lógica da sala de poker
│ └── firebase.ts # Configuração e inicialização do Firebase
├── .env.example # Exemplo de variáveis de ambiente
├── .gitignore # Ficheiros e pastas a ignorar pelo Git
├── package.json # Dependências e scripts do projeto
├── README.md # Este ficheiro
└── tsconfig.json # Configuração do TypeScript

© {new Date().getFullYear()} Planning Poker Online. Todos os direitos reservados.
