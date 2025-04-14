import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Button, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  Tabs,
  Tab,
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  AccountCircle, 
  EmojiEvents, 
  Info, 
  Close as CloseIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { UserProfile } from '../components/UserProfile';
import { UserRanking } from '../components/UserRanking';
import { MultiversXService } from '../services/multiversx';
import { ConnectWallet } from '../components/ConnectWallet';

const service = new MultiversXService();

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface UserProfileData {
  name: string;
  linkedin: string;
  github: string;
  twitter: string;
}

interface User {
  address: string;
  stars: number;
}

export const Home: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [stars] = useState(0);
  const [topUsers, setTopUsers] = useState<User[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [userStats, setUserStats] = useState({
    totalStars: 0,
    rank: 0,
    contributions: 0
  });

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const connected = await service.connect();
        setIsConnected(connected);
        if (connected) {
          const users = await service.getTopUsers();
          setTopUsers(users);
          
          setUserStats({
            totalStars: await service.getStars('current-user'),
            rank: Math.floor(Math.random() * 100),
            contributions: Math.floor(Math.random() * 50)
          });
        }
      } catch (error) {
        console.error('Erro ao inicializar:', error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSaveProfile = async (profile: UserProfileData) => {
    if (!isConnected) {
      alert('Por favor, conecte sua carteira primeiro');
      return;
    }
    const success = await service.saveProfile(profile);
    if (success) {
      alert('Perfil salvo com sucesso!');
    }
  };

  const handleConnect = async (walletName: string) => {
    setLoading(true);
    try {
      // Simula uma conexão com delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsConnected(true);
      console.log(`Conectado com ${walletName}`);
    } catch (error) {
      console.error('Erro ao conectar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      width: '100vw',
      bgcolor: '#f5f5f5'
    }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Oracle Challenger
          </Typography>
          {isConnected ? (
            <IconButton color="inherit">
              <AccountCircle />
            </IconButton>
          ) : (
            <ConnectWallet onConnect={handleConnect} isLoading={loading} />
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: 250,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ width: 250 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton onClick={handleDrawerToggle}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <List>
            <ListItem button onClick={() => { setTabValue(0); handleDrawerToggle(); }}>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary="Meu Perfil" />
            </ListItem>
            <ListItem button onClick={() => { setTabValue(1); handleDrawerToggle(); }}>
              <ListItemIcon>
                <EmojiEvents />
              </ListItemIcon>
              <ListItemText primary="Ranking" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <Info />
              </ListItemIcon>
              <ListItemText primary="Sobre" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8,
          pb: 4,
          px: 2,
          width: '100%',
          maxWidth: '1200px',
          mx: 'auto',
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
          </Box>
        ) : !isConnected ? (
          <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Bem-vindo ao Oracle Challenger
            </Typography>
            <Typography variant="body1" paragraph>
              Conecte sua carteira para começar a construir sua reputação na blockchain.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => service.connect().then(setIsConnected)}
              startIcon={<AccountCircle />}
            >
              Conectar Carteira
            </Button>
          </Paper>
        ) : (
          <>
            <Card sx={{ mb: 4, mt: 2 }}>
              <CardContent>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom>
                      Suas Estatísticas
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <StarIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body1">
                        {userStats.totalStars} estrelas recebidas
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Ranking #{userStats.rank} • {userStats.contributions} contribuições
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Paper sx={{ width: '100%', mb: 4 }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="basic tabs example"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab label="Meu Perfil" />
                <Tab label="Ranking" />
              </Tabs>
              <TabPanel value={tabValue} index={0}>
                <UserProfile
                  onSave={handleSaveProfile}
                  onGiveStar={() => {}}
                  stars={stars}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <UserRanking users={topUsers} />
              </TabPanel>
            </Paper>
          </>
        )}
      </Box>

      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          bgcolor: 'background.paper', 
          mt: 'auto',
          width: '100%',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Oracle Challenger. Todos os direitos reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}; 