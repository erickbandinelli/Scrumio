// src/store/roomStore.ts
import { create } from 'zustand'

export type PlayerVotes = Record<string, string | null>

export type RoomState = {
  name: string
  setName: (name: string) => void

  joined: boolean
  setJoined: (joined: boolean) => void

  players: PlayerVotes
  setPlayers: (players: PlayerVotes) => void

  isRevealed: boolean
  setIsRevealed: (revealed: boolean) => void

  roomCreator: string | null
  setRoomCreator: (creator: string | null) => void

  mode: 'normal' | 'hours'
  setMode: (mode: 'normal' | 'hours') => void
}

const useRoomStore = create<RoomState>((set) => ({
  name: '',
  setName: (name) => set({ name }),

  joined: false,
  setJoined: (joined) => set({ joined }),

  players: {},
  setPlayers: (players) => set({ players }),

  isRevealed: false,
  setIsRevealed: (revealed) => set({ isRevealed: revealed }),

  roomCreator: null,
  setRoomCreator: (creator) => set({ roomCreator: creator }),

  mode: 'normal',
  setMode: (mode) => set({ mode })
}))

export default useRoomStore
