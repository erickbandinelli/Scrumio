import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { get, onValue, remove, set, update } from 'firebase/database'
import { BrowserRouter, useNavigate, useParams } from 'react-router-dom'
import Room from '../Room'
import useRoomStore from '../store/roomStore'

// Mocks para hooks do react-router-dom
const mockedUseParams = useParams as jest.Mock
const mockedUseNavigate = useNavigate as jest.Mock

describe('Room Component', () => {
  let navigateMock: jest.Mock

  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    jest.clearAllMocks()

    // Resetar o estado do store antes de cada teste
    useRoomStore.setState({
      name: '',
      joined: false,
      players: {},
      isRevealed: false,
      roomCreator: null,
      mode: 'normal'
    })

    // Configura o mock de useNavigate
    navigateMock = jest.fn()
    mockedUseNavigate.mockReturnValue(navigateMock)

    // Configura o mock de useParams para retornar um roomId
    mockedUseParams.mockReturnValue({ roomId: 'test-room-id' })

    // Mocka onValue para simular o estado inicial da sala
    // Este mock será usado pelas chamadas iniciais do useEffect no Room.tsx
    ;(onValue as jest.Mock)
      .mockImplementationOnce((query, callback) => {
        // Mock para playersRef
        callback({ val: () => ({ Jogador1: null }) })
        return jest.fn()
      })
      .mockImplementationOnce((query, callback) => {
        // Mock para roomStateRef
        callback({
          val: () => ({
            name: 'Sala de Teste',
            players: { Jogador1: null },
            isRevealed: false,
            creator: 'Jogador1',
            mode: 'normal'
          })
        })
        return jest.fn()
      })

    // Mocka get para simular dados da sala ao entrar
    ;(get as jest.Mock).mockResolvedValue({
      val: () => ({
        name: 'Sala de Teste',
        players: { Jogador1: null },
        isRevealed: false,
        creator: 'Jogador1',
        mode: 'normal'
      })
    })
  })

  it('should render join room form if not joined', () => {
    render(
      <BrowserRouter>
        <Room />
      </BrowserRouter>
    )

    expect(screen.getByPlaceholderText('Digite seu nome')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Entrar na sala/i })
    ).toBeInTheDocument()
  })

  it('should allow a user to join a room', async () => {
    render(
      <BrowserRouter>
        <Room />
      </BrowserRouter>
    )

    const nameInput = screen.getByPlaceholderText('Digite seu nome')
    const joinButton = screen.getByRole('button', { name: /Entrar na sala/i })

    fireEvent.change(nameInput, { target: { value: 'Alice' } })
    fireEvent.click(joinButton)

    await waitFor(() => {
      expect(useRoomStore.getState().joined).toBe(true)
      expect(set).toHaveBeenCalledWith(expect.anything(), null) // set(ref(db, `rooms/${roomId}/players/${name}`), null)
      expect(update).toHaveBeenCalledWith(expect.anything(), {
        isRevealed: false
      }) // update(ref(db, `rooms/${roomId}`), { isRevealed: false })
      expect(
        screen.queryByPlaceholderText('Digite seu nome')
      ).not.toBeInTheDocument()
    })
  })

  it('should display room controls and players after joining', async () => {
    useRoomStore.setState({
      joined: true,
      name: 'Jogador1',
      roomCreator: 'Jogador1',
      players: { Jogador1: null, Jogador2: null }
    })

    render(
      <BrowserRouter>
        <Room />
      </BrowserRouter>
    )

    expect(screen.getByText(/Sala: Sala de Teste/i)).toBeInTheDocument()
    expect(screen.getByText(/Criador da Sala: Jogador1/i)).toBeInTheDocument()
    expect(screen.getByText(/Escolha uma carta:/i)).toBeInTheDocument()
    expect(screen.getByText(/Jogadores:/i)).toBeInTheDocument()
    expect(screen.getByText('Jogador1:')).toBeInTheDocument()
    expect(screen.getByText('Jogador2:')).toBeInTheDocument()
  })

  it('should allow the creator to change room name', async () => {
    useRoomStore.setState({
      joined: true,
      name: 'Jogador1',
      roomCreator: 'Jogador1',
      players: { Jogador1: null }
      // displayedRoomName e editableRoomName são estados locais do componente Room, não do store.
      // Eles serão atualizados pelo mock de onValue.
    })

    render(
      <BrowserRouter>
        <Room />
      </BrowserRouter>
    )

    const roomNameInput = screen.getByLabelText('Nome da sala')
    fireEvent.change(roomNameInput, { target: { value: 'Nova Sala Legal' } })
    fireEvent.blur(roomNameInput) // Simula perder o foco

    await waitFor(() => {
      expect(update).toHaveBeenCalledWith(
        expect.anything(), // ref(db, `rooms/${roomId}`)
        { name: 'Nova Sala Legal' }
      )
      expect(screen.getByText('Nome da sala atualizado!')).toBeInTheDocument()
    })
  })

  it('should allow a player to vote', async () => {
    useRoomStore.setState({
      joined: true,
      name: 'Jogador1',
      roomCreator: 'Jogador1',
      players: { Jogador1: null },
      isRevealed: false
    })

    render(
      <BrowserRouter>
        <Room />
      </BrowserRouter>
    )

    const cardButton = screen.getByRole('button', { name: '5' })
    fireEvent.click(cardButton)

    await waitFor(() => {
      expect(update).toHaveBeenCalledWith(
        expect.anything(), // ref(db, `rooms/${roomId}`)
        { 'players/Jogador1': '5', isRevealed: false }
      )
    })
  })

  it('should allow the creator to reveal votes when all players have voted', async () => {
    useRoomStore.setState({
      joined: true,
      name: 'Jogador1',
      roomCreator: 'Jogador1',
      players: { Jogador1: '5', Jogador2: '8' },
      isRevealed: false
    })

    render(
      <BrowserRouter>
        <Room />
      </BrowserRouter>
    )

    const revealButton = screen.getByRole('button', { name: /Revelar Votos/i })
    expect(revealButton).not.toBeDisabled() // Deve estar habilitado se todos votaram
    fireEvent.click(revealButton)

    await waitFor(() => {
      expect(update).toHaveBeenCalledWith(
        expect.anything(), // ref(db, `rooms/${roomId}`)
        { isRevealed: true }
      )
      expect(screen.getByText(/Média dos Votos:/i)).toBeInTheDocument()
    })
  })

  it('should disable reveal votes button if not all players have voted', () => {
    useRoomStore.setState({
      joined: true,
      name: 'Jogador1',
      roomCreator: 'Jogador1',
      players: { Jogador1: '5', Jogador2: null }, // Jogador2 não votou
      isRevealed: false
    })

    render(
      <BrowserRouter>
        <Room />
      </BrowserRouter>
    )

    const revealButton = screen.getByRole('button', { name: /Revelar Votos/i })
    expect(revealButton).toBeDisabled()
  })

  it('should allow the creator to reset votes', async () => {
    useRoomStore.setState({
      joined: true,
      name: 'Jogador1',
      roomCreator: 'Jogador1',
      players: { Jogador1: '5', Jogador2: '8' },
      isRevealed: true
    })

    render(
      <BrowserRouter>
        <Room />
      </BrowserRouter>
    )

    const resetButton = screen.getByRole('button', {
      name: /Reiniciar Rodada/i
    })
    fireEvent.click(resetButton)

    await waitFor(() => {
      expect(update).toHaveBeenCalledWith(
        expect.anything(), // ref(db, `rooms/${roomId}`)
        { players: { Jogador1: null, Jogador2: null }, isRevealed: false }
      )
    })
  })

  it('should calculate average correctly in normal mode', () => {
    useRoomStore.setState({
      joined: true,
      name: 'Jogador1',
      roomCreator: 'Jogador1',
      players: { Jogador1: '5', Jogador2: '8', Jogador3: '?' },
      isRevealed: true,
      mode: 'normal'
    })

    render(
      <BrowserRouter>
        <Room />
      </BrowserRouter>
    )

    expect(screen.getByText(/Média dos Votos: 6.5/i)).toBeInTheDocument() // (5+8)/2 = 6.5
  })

  it('should calculate average correctly in hours mode', () => {
    useRoomStore.setState({
      joined: true,
      name: 'Jogador1',
      roomCreator: 'Jogador1',
      players: { Jogador1: '0.5', Jogador2: '1', Jogador3: '3' }, // 0.5h, 1h, 8h
      isRevealed: true,
      mode: 'hours'
    })

    render(
      <BrowserRouter>
        <Room />
      </BrowserRouter>
    )

    // (0.5 + 1 + 8) / 3 = 3.166...
    expect(screen.getByText(/Média dos Votos: 3.2h/i)).toBeInTheDocument()
  })

  it('should display "N/A" if no numeric votes in average calculation', () => {
    useRoomStore.setState({
      joined: true,
      name: 'Jogador1',
      roomCreator: 'Jogador1',
      players: { Jogador1: '?', Jogador2: '?' },
      isRevealed: true,
      mode: 'normal'
    })

    render(
      <BrowserRouter>
        <Room />
      </BrowserRouter>
    )

    expect(screen.getByText(/Média dos Votos: N\/A/i)).toBeInTheDocument()
  })

  it('should copy room link to clipboard', async () => {
    useRoomStore.setState({ joined: true, name: 'Jogador1' })
    render(
      <BrowserRouter>
        <Room />
      </BrowserRouter>
    )

    const copyButton = screen.getByRole('button', { name: /Copiar Link/i })
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(document.execCommand).toHaveBeenCalledWith('copy')
      expect(
        screen.getByText('Link da sala copiado para a área de transferência!')
      ).toBeInTheDocument()
    })
  })

  it('should allow creator to change voting mode and reset votes', async () => {
    useRoomStore.setState({
      joined: true,
      name: 'Jogador1',
      roomCreator: 'Jogador1',
      players: { Jogador1: '5', Jogador2: '8' },
      isRevealed: true,
      mode: 'normal'
    })

    render(
      <BrowserRouter>
        <Room />
      </BrowserRouter>
    )

    const modeSelect = screen.getByLabelText(/Modo de Votação:/i)
    fireEvent.change(modeSelect, { target: { value: 'hours' } })

    await waitFor(() => {
      expect(update).toHaveBeenCalledWith(
        expect.anything(), // ref(db, `rooms/${roomId}`)
        { mode: 'hours' }
      )
      // Verifica se resetVotes foi chamado
      expect(update).toHaveBeenCalledWith(
        expect.anything(), // ref(db, `rooms/${roomId}`)
        { players: { Jogador1: null, Jogador2: null }, isRevealed: false }
      )
    })
  })

  it('should remove player from room when "Sair da Sala" is clicked by a non-creator', async () => {
    useRoomStore.setState({
      joined: true,
      name: 'Jogador2', // Não é o criador
      roomCreator: 'Jogador1',
      players: { Jogador1: null, Jogador2: null }
    })

    render(
      <BrowserRouter>
        <Room />
      </BrowserRouter>
    )

    const leaveButton = screen.getByRole('button', { name: /Sair da Sala/i })
    fireEvent.click(leaveButton)

    await waitFor(() => {
      expect(remove).toHaveBeenCalledWith(expect.anything()) // remove(ref(db, `rooms/${roomId}/players/Jogador2`))
      expect(useRoomStore.getState().joined).toBe(false)
      expect(useRoomStore.getState().name).toBe('')
      expect(navigateMock).toHaveBeenCalledWith('/')
    })
  })

  it('should delete the room when "Sair da Sala" is clicked by the creator', async () => {
    useRoomStore.setState({
      joined: true,
      name: 'Jogador1', // É o criador
      roomCreator: 'Jogador1',
      players: { Jogador1: null, Jogador2: null }
    })

    render(
      <BrowserRouter>
        <Room />
      </BrowserRouter>
    )

    const leaveButton = screen.getByRole('button', { name: /Sair da Sala/i })
    fireEvent.click(leaveButton)

    await waitFor(() => {
      expect(remove).toHaveBeenCalledWith(expect.anything()) // remove(ref(db, `rooms/${roomId}`))
      expect(useRoomStore.getState().joined).toBe(false)
      expect(useRoomStore.getState().name).toBe('')
      expect(navigateMock).toHaveBeenCalledWith('/')
    })
  })

  it('should handle beforeunload event for non-creator', async () => {
    useRoomStore.setState({
      joined: true,
      name: 'Jogador2',
      roomCreator: 'Jogador1',
      players: { Jogador1: null, Jogador2: null }
    })

    render(
      <BrowserRouter>
        <Room />
      </BrowserRouter>
    )

    // Simula o evento beforeunload
    fireEvent(window, new Event('beforeunload'))

    await waitFor(() => {
      expect(remove).toHaveBeenCalledWith(expect.anything()) // remove(ref(db, `rooms/${roomId}/players/Jogador2`))
      // Note: navigateMock não será chamado em beforeunload, pois o navegador fecha.
      // A verificação é se a chamada ao Firebase foi feita.
    })
  })

  it('should handle beforeunload event for creator', async () => {
    useRoomStore.setState({
      joined: true,
      name: 'Jogador1',
      roomCreator: 'Jogador1',
      players: { Jogador1: null }
    })

    render(
      <BrowserRouter>
        <Room />
      </BrowserRouter>
    )

    // Simula o evento beforeunload
    fireEvent(window, new Event('beforeunload'))

    await waitFor(() => {
      expect(remove).toHaveBeenCalledWith(expect.anything()) // remove(ref(db, `rooms/${roomId}`))
      // Note: navigateMock não será chamado em beforeunload.
    })
  })
})
