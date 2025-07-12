// src/setupTests.ts
// Este arquivo é executado automaticamente antes de cada suíte de testes.

// Mock do Firebase
// É crucial mockar o Firebase para que os testes não tentem se conectar a um banco de dados real.
// Usamos jest.mock para substituir os módulos do Firebase por implementações de teste.

// Mock para firebase/app
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({
    // Retorna um objeto mockado para a instância do app
  }))
}))

// Mock para firebase/database
jest.mock('firebase/database', () => ({
  getDatabase: jest.fn(() => ({
    // Retorna um objeto mockado para a instância do database
  })),
  ref: jest.fn((db, path) => ({
    // Mocka a função ref para retornar um objeto simples com o caminho
    toString: () => path, // Útil para verificar caminhos em mocks
    key: 'mocked-room-id' // Propriedade key para o push
  })),
  push: jest.fn((ref) => ({
    key: 'mocked-room-id', // Mocka a geração de IDs únicos
    ref: ref
  })),
  set: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  onValue: jest.fn((query, callback) => {
    // Mocka onValue para simular dados do banco de dados.
    // Você pode ajustar isso para simular diferentes estados.
    const mockSnapshot = {
      val: () => ({
        name: 'Sala de Teste',
        players: {},
        isRevealed: false,
        creator: null,
        mode: 'normal'
      })
    }
    callback(mockSnapshot)
    return jest.fn() // Retorna uma função de unsubscribe mockada
  }),
  get: jest.fn(() =>
    Promise.resolve({
      val: () => ({
        name: 'Sala de Teste',
        players: { Jogador1: null },
        isRevealed: false,
        creator: 'Jogador1',
        mode: 'normal'
      })
    })
  )
}))

// Mock para firebase/auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    // Retorna um objeto mockado para a instância do auth
  })),
  signInAnonymously: jest.fn(() =>
    Promise.resolve({
      user: { uid: 'mock-uid-anon' }
    })
  ),
  signInWithCustomToken: jest.fn(() =>
    Promise.resolve({
      user: { uid: 'mock-uid-custom' }
    })
  ),
  onAuthStateChanged: jest.fn((auth, callback) => {
    // Simula um usuário autenticado
    callback({ uid: 'mock-uid', email: 'test@example.com' })
    return jest.fn() // Retorna uma função de unsubscribe mockada
  })
}))

// Mock do React Router DOM
// Para testar componentes que usam hooks como useNavigate e useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Importa e mantém as implementações reais, exceto as que serão mockadas
  useNavigate: jest.fn(), // Mocka useNavigate
  useParams: jest.fn(() => ({ roomId: 'test-room-id' })) // Mocka useParams
}))

// Mock para document.execCommand('copy')
// Necessário para testar a função de copiar link
Object.defineProperty(document, 'execCommand', {
  value: jest.fn()
})

// Importação global para @testing-library/jest-dom
// Estende as expectativas do Jest com matchers personalizados para o DOM.
import '@testing-library/jest-dom'

// Mock para variáveis globais do ambiente Canvas
// Se o seu código usa __app_id, __firebase_config, __initial_auth_token,
// você precisa declará-los para o ambiente de teste.
// No entanto, para testes unitários, geralmente é melhor mockar as funções que os utilizam.
// Para fins de compilação, podemos declará-los aqui se forem referenciados diretamente.
declare global {
  var __app_id: string | undefined
  var __firebase_config: string | undefined
  var __initial_auth_token: string | undefined
}

// Atribua valores mockados se necessário para evitar erros de referência em tempo de teste
global.__app_id = 'mock-app-id'
global.__firebase_config = JSON.stringify({})
global.__initial_auth_token = 'mock-auth-token'
