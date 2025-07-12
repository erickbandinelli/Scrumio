import { Card, CardContent, Stack, Typography } from '@mui/material'
import { usePokerStore } from '../store/roomStore'

export default function PlayerList() {
  const { players, revealVotes } = usePokerStore()

  return (
    <Stack spacing={2}>
      {players.map((player) => (
        <Card key={player.name}>
          <CardContent>
            <Typography>
              {player.name}:{' '}
              {revealVotes ? (player.vote ?? '—') : player.vote ? '✔️' : '—'}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}
