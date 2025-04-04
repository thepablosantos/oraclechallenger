import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
  Star as StarIcon,
} from '@mui/icons-material';

interface UserProfileProps {
  onSave: (profile: UserProfileData) => void;
  onGiveStar: () => void;
  stars: number;
}

export interface UserProfileData {
  name: string;
  linkedin: string;
  github: string;
  twitter: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onSave, onGiveStar, stars }) => {
  const [profile, setProfile] = useState<UserProfileData>({
    name: '',
    linkedin: '',
    github: '',
    twitter: '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof UserProfileData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserProfileData, string>> = {};
    
    if (!profile.name.trim()) {
      newErrors.name = 'O nome é obrigatório';
    }
    
    if (profile.linkedin && !profile.linkedin.includes('linkedin.com')) {
      newErrors.linkedin = 'URL do LinkedIn inválida';
    }
    
    if (profile.github && !profile.github.includes('github.com')) {
      newErrors.github = 'URL do GitHub inválida';
    }
    
    if (profile.twitter && !profile.twitter.includes('twitter.com') && !profile.twitter.includes('x.com')) {
      newErrors.twitter = 'URL do Twitter inválida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof UserProfileData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProfile({ ...profile, [field]: event.target.value });
    // Limpar erro quando o usuário começa a digitar
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Por favor, corrija os erros no formulário',
        severity: 'error',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSave(profile);
      setSnackbar({
        open: true,
        message: 'Perfil salvo com sucesso!',
        severity: 'success',
      });
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      setSnackbar({
        open: true,
        message: 'Erro ao salvar perfil',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Perfil do Usuário
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Nome"
            value={profile.name}
            onChange={handleChange('name')}
            margin="normal"
            required
            error={!!errors.name}
            helperText={errors.name}
          />
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="LinkedIn"
              value={profile.linkedin}
              onChange={handleChange('linkedin')}
              error={!!errors.linkedin}
              helperText={errors.linkedin}
              InputProps={{
                startAdornment: <LinkedInIcon sx={{ mr: 1 }} />,
              }}
            />
            <TextField
              fullWidth
              label="GitHub"
              value={profile.github}
              onChange={handleChange('github')}
              error={!!errors.github}
              helperText={errors.github}
              InputProps={{
                startAdornment: <GitHubIcon sx={{ mr: 1 }} />,
              }}
            />
            <TextField
              fullWidth
              label="Twitter"
              value={profile.twitter}
              onChange={handleChange('twitter')}
              error={!!errors.twitter}
              helperText={errors.twitter}
              InputProps={{
                startAdornment: <TwitterIcon sx={{ mr: 1 }} />,
              }}
            />
          </Stack>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button 
              variant="contained" 
              type="submit" 
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Perfil'}
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ mr: 1 }}>
                {stars} Estrelas
              </Typography>
              <IconButton onClick={onGiveStar} color="primary">
                <StarIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </CardContent>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}; 