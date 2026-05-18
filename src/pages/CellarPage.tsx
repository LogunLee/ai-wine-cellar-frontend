import { Box, Container, Typography, Paper } from '@mui/material'
import { WineBar } from '@mui/icons-material'

const CellarPage = () => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
      Погреб
    </Typography>

    <Paper
      elevation={1}
      sx={{
        p: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <WineBar sx={{ fontSize: 64, color: 'text.disabled' }} />
      <Typography variant="h6" color="text.secondary">
        Погреб пуст
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Добавьте первую бутылку, чтобы начать
      </Typography>
    </Paper>
  </Container>
)

export default CellarPage
