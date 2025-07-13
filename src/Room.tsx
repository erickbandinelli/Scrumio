// src/Room.tsx
import { get, onValue, ref, remove, set, update } from 'firebase/database'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MessageBox from './components/MessageBox'
import { db } from './firebase'
import useRoomStore, { PlayerVotes } from './store/roomStore'

// Cartas para o modo "Normal" (Pontos de Estória)
const normalCards: string[] = ['1', '2', '3', '5', '8', '13', '?']

// Interface para o mapa de cartas de horas
interface HoursCard {
  value: number | null
  display: string
}

// Cartas para o modo "Horas" com seus valores de exibição e valores numéricos reais (em horas)
const hoursCardsMap: Record<string, HoursCard> = {
  '0': { value: 0, display: '0 - < 30min' },
  '0.5': { value: 0.5, display: '1/2 - 30min - 1h' },
  '1': { value: 1, display: '1 - 1h - 2h' },
  '2': { value: 2, display: '2 - 2h - 4h' },
  '3': { value: 8, display: '3 - 1 dia' },
  '5': { value: 16, display: '5 - 1 a 2 dias' },
  '8': { value: 32, display: '8 - 2 a 4 dias' },
  '13': { value: 64, display: '13 - 4 a 8 dias' },
  '20': { value: 80, display: '20 - > 8 dias' },
  '40': { value: 80, display: '40 - 1 sprint' }, // Valor alterado de 160 para 80 (2 semanas * 40 horas/semana)
  '?': { value: null, display: '?' }
}
const hoursCards: string[] = Object.keys(hoursCardsMap)

export default function Room(): React.ReactElement {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const [roomLink, setRoomLink] = useState<string>('')
  const [displayedRoomName, setDisplayedRoomName] = useState<string>('')
  const [editableRoomName, setEditableRoomName] = useState<string>('')
  const [messageBox, setMessageBox] = useState<{
    show: boolean
    message: string
    type: 'info' | 'success' | 'error'
  }>({ show: false, message: '', type: 'info' })

  const {
    name,
    setName,
    joined,
    setJoined,
    players,
    setPlayers,
    isRevealed,
    setIsRevealed,
    roomCreator,
    setRoomCreator,
    mode,
    setMode
  } = useRoomStore()

  const isCurrentUserCreator = joined && name === roomCreator
  const allPlayersVoted = Object.values(players).every((v) => v !== null)

  // Função para lidar com a saída da sala
  const handleLeaveRoom = useCallback(async () => {
    if (!joined || !name || !roomId) return

    const roomRef = ref(db, `rooms/${roomId}`)
    const playerRef = ref(db, `rooms/${roomId}/players/${name}`)

    try {
      // Se o jogador que saiu for o criador, apaga a sala inteira
      if (isCurrentUserCreator) {
        await remove(roomRef)
        console.log(`Sala ${roomId} apagada pelo criador.`)
      } else {
        // Se não for o criador, apenas remove o jogador da sala
        await remove(playerRef)
        console.log(`Jogador ${name} saiu da sala ${roomId}.`)
      }

      setJoined(false)
      setName('') // Limpa o nome do jogador
      navigate('/') // Redireciona para a página inicial
    } catch (error) {
      console.error('Erro ao sair da sala:', error)
      setMessageBox({
        show: true,
        message: 'Erro ao sair da sala. Tente novamente.',
        type: 'error'
      })
    }
  }, [joined, name, roomId, isCurrentUserCreator, setJoined, setName, navigate])

  useEffect(() => {
    if (roomId) {
      setRoomLink(window.location.origin + `/room/${roomId}`)
    }

    const playersRef = ref(db, `rooms/${roomId}/players`)
    const unsubscribePlayers = onValue(playersRef, (snapshot) => {
      const data: PlayerVotes = snapshot.val() || {}
      setPlayers(data)
    })

    const roomStateRef = ref(db, `rooms/${roomId}`)
    const unsubscribeRoomState = onValue(roomStateRef, (snapshot) => {
      const roomData = snapshot.val() || {}
      setIsRevealed(roomData.isRevealed === true)
      setRoomCreator(roomData.creator || null)
      setMode(roomData.mode || 'normal')
      const fetchedRoomName = roomData.name || `Sala ${roomId}`
      setDisplayedRoomName(fetchedRoomName)
      setEditableRoomName(fetchedRoomName)
    })

    // Adiciona listener para o evento beforeunload
    window.addEventListener('beforeunload', handleLeaveRoom)

    return () => {
      unsubscribePlayers()
      unsubscribeRoomState()
      // Remove listener ao desmontar o componente
      window.removeEventListener('beforeunload', handleLeaveRoom)
    }
  }, [
    roomId,
    setPlayers,
    setIsRevealed,
    setRoomCreator,
    setMode,
    setDisplayedRoomName,
    handleLeaveRoom // Adiciona handleLeaveRoom como dependência
  ])

  const joinRoom = async (): Promise<void> => {
    if (name.trim()) {
      const roomRef = ref(db, `rooms/${roomId}`)
      const roomSnapshot = await get(roomRef)
      let currentRoomData = roomSnapshot.val()

      if (!currentRoomData || !currentRoomData.creator) {
        await update(roomRef, { creator: name })
      }
      if (!currentRoomData || !currentRoomData.mode) {
        await update(roomRef, { mode: 'normal' })
      }

      await set(ref(db, `rooms/${roomId}/players/${name}`), null)
      await update(ref(db, `rooms/${roomId}`), { isRevealed: false })
      setJoined(true)
    }
  }

  const vote = async (value: string): Promise<void> => {
    await update(ref(db, `rooms/${roomId}`), {
      [`players/${name}`]: value,
      isRevealed: false
    })
  }

  const handleModeChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ): Promise<void> => {
    const newMode = event.target.value as 'normal' | 'hours'
    if (isCurrentUserCreator) {
      await update(ref(db, `rooms/${roomId}`), { mode: newMode })
      await resetVotes()
    }
  }

  const revealVotesInFirebase = async (): Promise<void> => {
    if (isCurrentUserCreator && allPlayersVoted) {
      await update(ref(db, `rooms/${roomId}`), {
        isRevealed: true
      })
    }
  }

  const resetVotes = async (): Promise<void> => {
    if (isCurrentUserCreator) {
      const updates: PlayerVotes = {}
      Object.keys(players).forEach((key) => (updates[key] = null))
      await update(ref(db, `rooms/${roomId}`), {
        players: updates,
        isRevealed: false
      })
    }
  }

  const calculateAverage = (): string => {
    let numericVotes: number[] = []

    if (mode === 'hours') {
      numericVotes = Object.values(players)
        .map((v) => hoursCardsMap[v as string]?.value)
        .filter((v): v is number => v !== null && !isNaN(v))
    } else {
      numericVotes = Object.values(players)
        .filter(
          (v): v is string => v !== null && v !== '?' && !isNaN(Number(v))
        )
        .map(Number)
    }

    if (numericVotes.length === 0) {
      return 'N/A'
    }

    const sum = numericVotes.reduce((acc, curr) => acc + curr, 0)
    const average = sum / numericVotes.length

    if (mode === 'hours') {
      if (average < 1) return `${(average * 60).toFixed(0)}min`
      if (average < 8) return `${average.toFixed(1)}h`
      return `${(average / 8).toFixed(1)} dias`
    }

    return average.toFixed(1)
  }

  const formatVoteDisplay = (voteValue: string | null): string => {
    if (voteValue === null) {
      return '—'
    }
    if (voteValue === '?') {
      return '☕'
    }
    if (mode === 'hours' && hoursCardsMap[voteValue]) {
      return hoursCardsMap[voteValue].display
    }
    return voteValue
  }

  const handleCopyLink = (): void => {
    // Cria um elemento de textarea temporário
    const textarea = document.createElement('textarea')
    textarea.value = roomLink
    textarea.style.position = 'fixed' // Evita que o textarea afete o layout
    textarea.style.opacity = '0' // Torna o textarea invisível
    document.body.appendChild(textarea)
    textarea.select() // Seleciona o conteúdo do textarea

    try {
      document.execCommand('copy') // Tenta copiar o conteúdo selecionado
      setMessageBox({
        show: true,
        message: 'Link da sala copiado para a área de transferência!',
        type: 'success'
      })
    } catch (err) {
      console.error('Falha ao copiar o link:', err)
      setMessageBox({
        show: true,
        message:
          'Não foi possível copiar o link. Por favor, copie manualmente.',
        type: 'error'
      })
    } finally {
      document.body.removeChild(textarea) // Remove o textarea temporário
    }
  }

  // Função para atualizar o nome da sala no Firebase
  const updateRoomName = async (): Promise<void> => {
    if (isCurrentUserCreator && editableRoomName.trim() !== displayedRoomName) {
      await update(ref(db, `rooms/${roomId}`), {
        name: editableRoomName.trim()
      })
      setMessageBox({
        show: true,
        message: 'Nome da sala atualizado!',
        type: 'success'
      })
    }
  }

  const currentCards = mode === 'hours' ? hoursCards : normalCards

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 font-inter">
      <header className="w-full bg-blue-700 text-white py-4 px-6 shadow-md fixed top-0 left-0 z-50 rounded-b-lg">
        <h1 className="text-2xl font-semibold">Scrumio Poker</h1>
      </header>

      <main className="flex-grow flex items-center justify-center w-full mt-20 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8 mt-4">
          <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
            Sala:
            {isCurrentUserCreator ? (
              <input
                type="text"
                value={editableRoomName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditableRoomName(e.target.value)
                }
                onBlur={updateRoomName} // Salva ao perder o foco
                className="ml-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-3xl font-bold text-blue-700"
                aria-label="Nome da sala"
              />
            ) : (
              <span className="ml-2">{displayedRoomName}</span>
            )}
          </h1>

          {joined && (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-lg font-semibold text-blue-800 mb-2">
                Compartilhe este link com seu time:
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  value={roomLink}
                  readOnly
                  className="w-full bg-blue-100 border border-blue-300 p-2 rounded-md text-blue-900 font-mono text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ease-in-out whitespace-nowrap shadow-md hover:shadow-lg"
                >
                  Copiar Link
                </button>
              </div>
            </div>
          )}

          {!joined ? (
            <div className="space-y-4 mt-6">
              <input
                type="text"
                placeholder="Digite seu nome"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={joinRoom}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out disabled:opacity-50 shadow-md hover:shadow-lg"
                disabled={!name.trim()}
              >
                Entrar na sala
              </button>
            </div>
          ) : (
            <>
              {roomCreator && (
                <p className="text-md text-gray-600 mb-4 text-center">
                  Criador da Sala:{' '}
                  <span className="font-semibold text-blue-700">
                    {roomCreator}
                  </span>
                  {isCurrentUserCreator && (
                    <span className="ml-2 text-green-600">(Você)</span>
                  )}
                </p>
              )}

              {isCurrentUserCreator && (
                <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-inner">
                  <label
                    htmlFor="voting-mode"
                    className="block text-md font-medium text-gray-700 mb-2"
                  >
                    Modo de Votação:
                  </label>
                  <select
                    id="voting-mode"
                    value={mode}
                    onChange={handleModeChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="normal">Pontos de Estória</option>
                    <option value="hours">Estimativa de Tempo (Horas)</option>
                  </select>
                </div>
              )}

              <h2 className="text-xl font-semibold text-gray-800 mt-6">
                Escolha uma carta:
              </h2>
              <div className="flex flex-wrap gap-3 mt-4 justify-center">
                {currentCards.map((cardValue) => (
                  <button
                    key={cardValue}
                    onClick={() => vote(cardValue)}
                    className={`
                      px-8 py-5 border-2 rounded-lg font-bold text-xl min-w-[70px]
                      transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2
                      ${players[name] === cardValue ? 'bg-blue-600 text-white border-blue-700 focus:ring-blue-500 shadow-md' : 'bg-gray-100 text-blue-700 border-blue-500 hover:bg-blue-200 focus:ring-blue-500'}
                    `}
                    disabled={isRevealed}
                  >
                    {mode === 'hours' && cardValue !== '?'
                      ? hoursCardsMap[cardValue]?.display.split(' - ')[0]
                      : cardValue}
                  </button>
                ))}
              </div>

              <h2 className="text-xl font-semibold text-gray-800 mt-8">
                Jogadores:
              </h2>
              <div className="space-y-3 mt-4">
                {Object.entries(players).map(([player, voteValue]) => (
                  <div
                    key={player}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md shadow-sm"
                  >
                    <p className="text-lg text-gray-700 font-medium">
                      {player}:
                    </p>
                    {isRevealed ? (
                      <span className="text-xl font-bold text-blue-900">
                        {formatVoteDisplay(voteValue)}
                      </span>
                    ) : (
                      <span className="text-xl">{voteValue ? '✔️' : '—'}</span>
                    )}
                  </div>
                ))}
              </div>

              {isRevealed && (
                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-800">
                    Média dos Votos: {calculateAverage()}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-4 mt-8">
                {isCurrentUserCreator && (
                  <>
                    <button
                      onClick={resetVotes}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
                    >
                      Reiniciar Rodada
                    </button>

                    {!isRevealed && (
                      <button
                        onClick={revealVotesInFirebase}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 shadow-md hover:shadow-lg"
                        disabled={!allPlayersVoted}
                      >
                        Revelar Votos
                      </button>
                    )}
                  </>
                )}
                {joined && ( // Botão Sair da Sala visível para qualquer jogador na sala
                  <button
                    onClick={handleLeaveRoom}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 shadow-md hover:shadow-lg"
                  >
                    Sair da Sala
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="w-full text-center py-4 text-gray-600 text-sm mt-auto">
        &copy; {new Date().getFullYear()} Scrumio Planning Poker Online. Todos
        os direitos reservados.
      </footer>

      {messageBox.show && (
        <MessageBox
          message={messageBox.message}
          type={messageBox.type}
          onClose={() => setMessageBox({ ...messageBox, show: false })}
        />
      )}
    </div>
  )
}
