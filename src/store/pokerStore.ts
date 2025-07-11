import { create } from "zustand";

type Player = {
  name: string;
  vote?: string;
};

type State = {
  players: Player[];
  cards: string[];
  addPlayer: (name: string) => void;
  castVote: (name: string, vote: string) => void;
  revealVotes: boolean;
  toggleReveal: () => void;
  resetVotes: () => void;
};

export const usePokerStore = create<State>((set) => ({
  players: [],
  cards: ["1", "2", "3", "5", "8", "13", "?"],
  revealVotes: false,
  addPlayer: (name) =>
    set((state) => ({
      players: [...state.players, { name }],
    })),
  castVote: (name, vote) =>
    set((state) => ({
      players: state.players.map((p) => (p.name === name ? { ...p, vote } : p)),
    })),
  toggleReveal: () => set((state) => ({ revealVotes: !state.revealVotes })),
  resetVotes: () =>
    set((state) => ({
      players: state.players.map((p) => ({ ...p, vote: undefined })),
      revealVotes: false,
    })),
}));
