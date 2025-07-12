// src/__tests__/roomStore.test.ts
import { act } from 'react-dom/test-utils'
import useRoomStore from '../store/roomStore'

describe('useRoomStore', () => {
  // Resetar o estado do store antes de cada teste para garantir isolamento
  beforeEach(() => {
    act(() => {
      useRoomStore.setState({
        name: '',
        joined: false,
        players: {},
        isRevealed: false,
        roomCreator: null,
        mode: 'normal'
      })
    })
  })

  it('should initialize with default values', () => {
    const state = useRoomStore.getState()
    expect(state.name).toBe('')
    expect(state.joined).toBe(false)
    expect(state.players).toEqual({})
    expect(state.isRevealed).toBe(false)
    expect(state.roomCreator).toBe(null)
    expect(state.mode).toBe('normal')
  })

  it('should set the name', () => {
    act(() => {
      useRoomStore.getState().setName('Alice')
    })
    expect(useRoomStore.getState().name).toBe('Alice')
  })

  it('should set joined status', () => {
    act(() => {
      useRoomStore.getState().setJoined(true)
    })
    expect(useRoomStore.getState().joined).toBe(true)
  })

  it('should set players', () => {
    const mockPlayers = { Alice: '5', Bob: null }
    act(() => {
      useRoomStore.getState().setPlayers(mockPlayers)
    })
    expect(useRoomStore.getState().players).toEqual(mockPlayers)
  })

  it('should set revealed status', () => {
    act(() => {
      useRoomStore.getState().setIsRevealed(true)
    })
    expect(useRoomStore.getState().isRevealed).toBe(true)
  })

  it('should set room creator', () => {
    act(() => {
      useRoomStore.getState().setRoomCreator('Charlie')
    })
    expect(useRoomStore.getState().roomCreator).toBe('Charlie')
  })

  it('should set mode', () => {
    act(() => {
      useRoomStore.getState().setMode('hours')
    })
    expect(useRoomStore.getState().mode).toBe('hours')
  })
})
