export class MockService {
  private connected: boolean = false;

  async connect() {
    try {
      this.connected = true;
      return true;
    } catch (error) {
      console.error('Erro ao conectar:', error);
      return false;
    }
  }

  async saveProfile(profile: {
    name: string;
    linkedin: string;
    github: string;
    twitter: string;
  }) {
    try {
      if (!this.connected) throw new Error('Não conectado');
      console.log('Salvando perfil:', profile);
      return true;
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      return false;
    }
  }

  async giveStar(toAddress: string) {
    try {
      if (!this.connected) throw new Error('Não conectado');
      console.log('Dando estrela para:', toAddress);
      return true;
    } catch (error) {
      console.error('Erro ao dar estrela:', error);
      return false;
    }
  }

  async getStars(address: string): Promise<number> {
    try {
      console.log('Obtendo estrelas para:', address);
      return Math.floor(Math.random() * 100); // Retorna um número aleatório de 0 a 99
    } catch (error) {
      console.error('Erro ao obter estrelas:', error);
      return 0;
    }
  }

  async getTopUsers(limit: number = 10): Promise<Array<{ address: string; stars: number }>> {
    try {
      console.log('Obtendo top usuários, limite:', limit);
      // Gera uma lista de usuários mock
      return Array.from({ length: limit }, (_, i) => ({
        address: `user${i + 1}.eth`,
        stars: Math.floor(Math.random() * 100)
      }));
    } catch (error) {
      console.error('Erro ao obter top usuários:', error);
      return [];
    }
  }
} 