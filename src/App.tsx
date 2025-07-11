import { Button, Container, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function App() {
  const navigate = useNavigate();

  const createRoom = () => {
    const roomId = uuidv4();
    navigate(`/room/${roomId}`);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom align="center">
        Planning Poker Online
      </Typography>
      <Stack spacing={2} alignItems="center">
        <Button variant="contained" onClick={createRoom}>
          Criar Nova Sala
        </Button>
      </Stack>
    </Container>
  );
}
