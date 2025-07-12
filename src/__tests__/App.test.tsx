// src/__tests__/App.test.tsx
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { push, ref, set } from 'firebase/database'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import App from '../App'

// Mocka o useNavigate para que possamos espiar suas chamadas
const mockedUseNavigate = useNavigate as jest.Mock

describe('App Component', () => {
  let navigateMock: jest.Mock

  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    jest.clearAllMocks()
    // Configura o mock de useNavigate
    navigateMock = jest.fn()
    mockedUseNavigate.mockReturnValue(navigateMock)
  })

  it('should render the create room form', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    expect(screen.getByText('Criar Nova Sala')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Digite o nome da nova sala')
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Criar Sala/i })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Para entrar em uma sala existente/i)
    ).toBeInTheDocument()
  })

  it('should enable the "Criar Sala" button when room name is entered', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    const input = screen.getByPlaceholderText('Digite o nome da nova sala')
    const createButton = screen.getByRole('button', { name: /Criar Sala/i })

    expect(createButton).toBeDisabled()
    fireEvent.change(input, { target: { value: 'Minha Sala de Teste' } })
    expect(createButton).not.toBeDisabled()
  })

  it('should show a message box if room name is empty on createRoom', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    const createButton = screen.getByRole('button', { name: /Criar Sala/i })
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(
        screen.getByText('Por favor, digite um nome para a sala.')
      ).toBeInTheDocument()
    })
    expect(
      screen.getByRole('button', { name: /Close message/i })
    ).toBeInTheDocument() // Verifica o botão de fechar do MessageBox
  })

  it('should create a room and navigate to the room page', async () => {
    // Mocka o retorno de push para que key seja acessível
    ;(push as jest.Mock).mockReturnValue({ key: 'mocked-room-id' })

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    const input = screen.getByPlaceholderText('Digite o nome da nova sala')
    const createButton = screen.getByRole('button', { name: /Criar Sala/i })

    fireEvent.change(input, { target: { value: 'Minha Sala de Teste' } })
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith(ref(expect.anything(), 'rooms'))
      expect(set).toHaveBeenCalledWith(
        ref(expect.anything(), 'rooms/mocked-room-id'),
        {
          name: 'Minha Sala de Teste',
          players: {},
          isRevealed: false,
          creator: null,
          mode: 'normal'
        }
      )
      expect(navigateMock).toHaveBeenCalledWith('/room/mocked-room-id')
    })
  })
})
