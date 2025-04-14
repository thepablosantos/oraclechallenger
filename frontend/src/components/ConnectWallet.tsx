import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  CircularProgress,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

interface WalletOption {
  name: string;
  icon: string;
  installed: boolean;
}

const mockWallets: WalletOption[] = [
  {
    name: 'MetaMask',
    icon: '🦊',
    installed: true
  },
  {
    name: 'MultiversX DeFi Wallet',
    icon: '🌐',
    installed: false
  },
  {
    name: 'Coinbase Wallet',
    icon: '🔵',
    installed: false
  }
];

interface ConnectWalletProps {
  onConnect: (walletName: string) => Promise<void>;
  isLoading?: boolean;
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({ onConnect, isLoading = false }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const open = Boolean(anchorEl);

  console.log("Estado de carregamento:", isLoading);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Botão de conexão clicado");
    if (!isLoading) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleWalletSelect = async (walletName: string) => {
    setConnectingWallet(walletName);
    handleClose();
    try {
      await onConnect(walletName);
    } finally {
      setConnectingWallet(null);
    }
  };

  const isConnecting = isLoading || connectingWallet !== null;

  console.log("Renderizando o componente ConnectWallet");

  return (
    <>
      <Button
        variant="contained"
        onClick={handleClick}
        startIcon={isConnecting ? <CircularProgress size={20} color="inherit" /> : <AccountBalanceWalletIcon />}
        disabled={isConnecting}
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
          minWidth: '180px',
        }}
      >
        {isConnecting 
          ? connectingWallet 
            ? `Conectando ${connectingWallet}...` 
            : 'Conectando...'
          : 'Conectar Carteira'
        }
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'wallet-button',
        }}
      >
        {mockWallets.map((wallet) => (
          <MenuItem
            key={wallet.name}
            onClick={() => handleWalletSelect(wallet.name)}
            disabled={!wallet.installed || isConnecting}
          >
            <ListItemIcon>
              <Typography fontSize="20px">{wallet.icon}</Typography>
            </ListItemIcon>
            <ListItemText>
              {wallet.name}
              {!wallet.installed && (
                <Typography variant="caption" color="text.secondary" display="block">
                  Não instalada
                </Typography>
              )}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}; 