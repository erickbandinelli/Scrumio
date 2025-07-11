import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { onValue, ref, set, update } from "firebase/database";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase";

const cards = ["1", "2", "3", "5", "8", "13", "?"];

export default function Room() {
  const { roomId } = useParams();
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [players, setPlayers] = useState<Record<string, string | null>>({});

  useEffect(() => {
    const playersRef = ref(db, `rooms/${roomId}/players`);
    const unsubscribe = onValue(playersRef, (snapshot) => {
      const data = snapshot.val() || {};
      setPlayers(data);
    });
    return () => unsubscribe();
  }, [roomId]);

  const joinRoom = async () => {
    if (name.trim()) {
      await set(ref(db, `rooms/${roomId}/players/${name}`), null);
      setJoined(true);
    }
  };

  const vote = async (value: string) => {
    await update(ref(db, `rooms/${roomId}/players`), {
      [name]: value,
    });
  };

  const revealVotes = Object.values(players).every((v) => v !== null);

  const resetVotes = async () => {
    const updates: any = {};
    Object.keys(players).forEach((key) => (updates[key] = null));
    await update(ref(db, `rooms/${roomId}/players`), updates);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Sala: {roomId}</Typography>

      {!joined ? (
        <Stack spacing={2} mt={3}>
          <TextField
            label="Digite seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button variant="contained" onClick={joinRoom}>
            Entrar na sala
          </Button>
        </Stack>
      ) : (
        <>
          <Typography variant="h6" mt={3}>
            Escolha uma carta:
          </Typography>
          <Stack direction="row" flexWrap="wrap">
            {cards.map((card) => (
              <Button
                key={card}
                onClick={() => vote(card)}
                variant="outlined"
                sx={{ m: 1 }}
              >
                {card}
              </Button>
            ))}
          </Stack>

          <Typography variant="h6" mt={4}>
            Jogadores:
          </Typography>
          <Stack spacing={1}>
            {Object.entries(players).map(([player, vote]) => (
              <Typography key={player}>
                {player}: {revealVotes ? (vote ?? "—") : vote ? "✔️" : "—"}
              </Typography>
            ))}
          </Stack>

          <Stack direction="row" spacing={2} mt={3}>
            <Button variant="contained" onClick={resetVotes}>
              Reiniciar Rodada
            </Button>
          </Stack>
        </>
      )}
    </Container>
  );
}
