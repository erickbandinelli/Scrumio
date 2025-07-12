# 🃏 Planning Poker Online

**Bem-vindo ao Planning Poker Online**, uma ferramenta interativa e colaborativa para estimativa de tarefas em equipes ágeis.  
Crie salas virtuais, vote em estimativas e veja os resultados em tempo real — tudo de forma simples e intuitiva.

---

## ✨ Funcionalidades

✅ **Criação de Salas Personalizadas**  
Crie salas com nomes únicos e compartilhe com sua equipe.

👑 **Gestão do Criador da Sala**  
O primeiro a entrar torna-se o administrador, com permissões exclusivas.

📊 **Estimativa Flexível**  
Escolha entre:

- Pontos de Estória (sequência de Fibonacci)
- Estimativa de Tempo (1 sprint = 80h)

🔒 **Votação Secreta em Tempo Real**  
Todos votam secretamente e os votos são revelados ao comando do criador.

🔁 **Reinício de Rodada**  
Reinicie a votação para uma nova tarefa com um clique.

🔗 **Compartilhamento de Link**  
Copie o link da sala com facilidade.

✏️ **Edição do Nome da Sala**  
O criador pode renomear a sala a qualquer momento.

🚪 **Saída e Exclusão de Sala**

- O criador pode excluir a sala ao sair.
- Se apenas jogadores saírem, a sala permanece ativa.
- A sala é apagada automaticamente se o criador sair e não houver mais jogadores.

📂 **Múltiplas Salas Simultâneas**  
Suporte para várias sessões em paralelo.

💬 **Mensagens de Feedback**  
Notificações amigáveis como: "link copiado", "nome atualizado", etc.

---

## 🚀 Tecnologias Utilizadas

- ⚛️ **React** – Biblioteca para interfaces declarativas.
- 📘 **TypeScript** – Tipagem estática para maior segurança.
- 🔥 **Firebase Realtime Database** – Sincronização em tempo real.
- 🔐 **Firebase Auth** – Autenticação anônima e personalizada.
- 🧠 **Zustand** – Gerenciamento de estado minimalista.
- 🌐 **React Router DOM** – Navegação entre páginas.
- 🎨 **Tailwind CSS** – Estilização rápida e responsiva.

---

## 🛠️ Como Usar (Desenvolvimento Local)

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/planning-poker-online.git
cd planning-poker-online
```

### 2. Instale as Dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure o Firebase

- Crie um projeto no [Firebase Console](https://console.firebase.google.com)
- Ative o Realtime Database e a autenticação anônima
- Crie um arquivo `.env` na raiz com suas credenciais:

```env
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_DATABASE_URL=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
```

⚠️ **Importante:** Adicione `.env` no `.gitignore`.

### 4. Execute o Projeto

```bash
npm start
# ou
yarn start
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## ☁️ Deploy na Vercel

1. **Crie um repositório Git**
2. **Acesse o [Vercel Dashboard](https://vercel.com/dashboard)** e clique em **New Project**
3. **Importe o repositório**
4. **Adicione as variáveis de ambiente** em:  
   `Settings > Environment Variables`
5. **Clique em Deploy**

---

## 📂 Estrutura do Projeto

```
planning-poker-online/
├── public/
├── src/
│   ├── components/
│   │   └── MessageBox.tsx        # Mensagens de feedback
│   ├── store/
│   │   └── roomStore.ts          # Zustand: estado da sala
│   ├── App.tsx                   # Criar ou entrar em salas
│   ├── Room.tsx                  # Lógica da sala de poker
│   └── firebase.ts               # Configuração do Firebase
├── .env.example                  # Exemplo de variáveis de ambiente
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

---

## 🧾 Licença

MIT © Planning Poker Online  
Todos os direitos reservados – 2025
