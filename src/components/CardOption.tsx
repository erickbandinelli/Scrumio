import { Card, CardActionArea, Typography } from "@mui/material";

type Props = {
  value: string;
  onSelect: (value: string) => void;
};

export default function CardOption({ value, onSelect }: Props) {
  return (
    <Card sx={{ width: 80, m: 1 }}>
      <CardActionArea onClick={() => onSelect(value)}>
        <Typography variant="h5" align="center" p={2}>
          {value}
        </Typography>
      </CardActionArea>
    </Card>
  );
}
