import {
  Button,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CardOption from "./components/CardOption";
import PlayerList from "./components/PlayerList";
import { usePokerStore } from "./store/pokerStore";

export default function App() {
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const { addPlayer, cards, castVote, toggleReveal, revealVotes, resetVotes } =
    usePokerStore();

  const handleJoin = () => {
    if (name.trim()) {
      addPlayer(name);
      setJoined(true);
    }
  };

  const handleVote = (vote: string) => {
    castVote(name, vote);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Scrumio
      </Typography>

      {!joined ? (
        <Stack spacing={2}>
          <TextField
            label="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button variant="contained" onClick={handleJoin}>
            Entrar
          </Button>
        </Stack>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Escolha uma carta:
          </Typography>
          <Stack direction="row" flexWrap="wrap">
            {cards.map((value) => (
              <CardOption key={value} value={value} onSelect={handleVote} />
            ))}
          </Stack>

          <Divider sx={{ my: 3 }} />

          <PlayerList />

          <Stack direction="row" spacing={2} mt={3}>
            <Button variant="outlined" onClick={toggleReveal}>
              {revealVotes ? "Esconder" : "Revelar"} Votos
            </Button>
            <Button variant="contained" color="error" onClick={resetVotes}>
              Reiniciar
            </Button>
          </Stack>
        </>
      )}
    </Container>
  );
}
