// src/App.tsx
import { push, ref, set } from 'firebase/database'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MessageBox from './components/MessageBox'
import { db } from './firebase'

function App(): React.ReactElement {
  const [roomNameInput, setRoomNameInput] = useState<string>('')
  const [messageBox, setMessageBox] = useState<{
    show: boolean
    message: string
    type: 'info' | 'success' | 'error'
  }>({ show: false, message: '', type: 'info' })
  const navigate = useNavigate()

  const createRoom = async (): Promise<void> => {
    if (roomNameInput.trim()) {
      const newRoomRef = push(ref(db, 'rooms'))
      const newRoomId = newRoomRef.key

      if (newRoomId) {
        await set(newRoomRef, {
          name: roomNameInput.trim(),
          players: {},
          isRevealed: false,
          creator: null,
          mode: 'normal'
        })
        navigate(`/room/${newRoomId}`)
      }
    } else {
      setMessageBox({
        show: true,
        message: 'Por favor, digite um nome para a sala.',
        type: 'error'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-inter">
      <header className="w-full bg-blue-700 text-white py-4 px-6 shadow-md fixed top-0 left-0 z-50 flex justify-center items-center rounded-b-lg">
        <h1 className="text-3xl font-semibold">Scrumio Poker</h1>
      </header>

      <main className="flex-grow flex items-center justify-center w-full">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
            Criar Nova Sala {/* Título atualizado para maior clareza */}
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Digite o nome da nova sala"
              value={roomNameInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRoomNameInput(e.target.value)
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={createRoom}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out disabled:opacity-50 shadow-md hover:shadow-lg"
              disabled={!roomNameInput.trim()}
            >
              Criar Sala
            </button>
          </div>

          <p className="text-center text-gray-500 mt-6">
            Para entrar em uma sala existente, cole o link compartilhado na
            barra de endereço do seu navegador.
          </p>
        </div>
      </main>

      <footer className="w-full text-center py-4 text-gray-600 text-sm mt-auto">
        &copy; {new Date().getFullYear()} Planning Poker Online. Todos os
        direitos reservados.
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

export default App
