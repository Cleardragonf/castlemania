import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface GameOverModalProps {
  open: boolean;
  day: number;
  score: number;
  history: string[];
  onClose?: () => void;
}
const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
  maxHeight: '80vh',
  overflowY: 'auto',
};

export const GameOverModal: React.FC<GameOverModalProps> = ({ open, day, score, history }) => {
  const navigate = useNavigate();
  console.log(score, 'GameOverModal score');

  return (
    <Modal
      open={open}
      onClose={() => {}}
      aria-labelledby="game-over-title"
      aria-describedby="game-over-description"
      disableEscapeKeyDown
    >
      <Box sx={style}>
        <Typography id="game-over-title" variant="h5" component="h2" color="error" textAlign="center" gutterBottom>
          Game Over
        </Typography>
        <Typography textAlign="center" mb={2}>
          You survived <strong>{day}</strong> days.
        </Typography>
        <Typography textAlign="center" mb={4}>
          Score: <strong>{score}</strong>
        </Typography>

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Detailed History:
        </Typography>

        {history.length > 0 && (
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
            You started with: {history[0].replace(/^Day 1: /, '')}
          </Typography>
        )}

        <Box
          sx={{
            maxHeight: '40vh',
            overflowY: 'auto',
            mb: 2,
            border: '1px solid #ccc',
            borderRadius: 1,
            p: 1,
            bgcolor: '#f9f9f9',
          }}
        >
          {history.length <= 1 ? (
            <Typography>No further history available.</Typography>
          ) : (
            history.slice(1).map((entry, index) => (
              <Typography key={index} variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {entry}
              </Typography>
            ))
          )}
        </Box>


        <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/home')}>
          Restart Game
        </Button>
      </Box>
    </Modal>
  );
};
