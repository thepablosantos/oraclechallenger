#![no_std]

multiversx_sc::imports!();

#[multiversx_sc::contract]
pub trait OracleContract {
    #[init]
    fn init(&self) {}

    #[endpoint]
    fn save_profile(
        &self,
        name: ManagedBuffer,
        linkedin: ManagedBuffer,
        github: ManagedBuffer,
        twitter: ManagedBuffer,
    ) {
        let caller = self.blockchain().get_caller();
        self.profiles(&caller).set(Profile {
            name,
            linkedin,
            github,
            twitter,
        });
    }

    #[endpoint]
    fn give_star(&self, to_address: ManagedAddress) {
        let caller = self.blockchain().get_caller();
        require!(caller != to_address, "Cannot give star to yourself");

        // Verificar limite diário
        let today = self.blockchain().get_block_timestamp() / 86400;
        let stars_given_today = self.stars_given_today(&caller, today);
        require!(stars_given_today < 5, "Daily star limit reached");

        // Calcular custo exponencial
        let stars_received = self.stars_received(&to_address).get();
        let cost = self.calculate_star_cost(stars_received);

        // Transferir tokens
        self.send().direct_egld(&caller, &to_address, &cost);

        // Atualizar contadores
        self.stars_received(&to_address).set(stars_received + 1);
        self.stars_given_today(&caller, today).set(stars_given_today + 1);
    }

    #[view(getProfile)]
    fn get_profile(&self, address: ManagedAddress) -> Profile<Self::Api> {
        self.profiles(&address).get()
    }

    #[view(getStars)]
    fn get_stars(&self, address: ManagedAddress) -> u64 {
        self.stars_received(&address).get()
    }

    #[view(getTopUsers)]
    fn get_top_users(&self, limit: usize) -> MultiValueEncoded<Self::Api, ManagedAddress> {
        // Implementação simplificada - em produção, use um heap ou ordenação
        let mut result = MultiValueEncoded::new();
        let mut users: Vec<(ManagedAddress, u64)> = Vec::new();

        self.stars_received().iter().for_each(|(address, stars)| {
            users.push((address, stars));
        });

        users.sort_by(|a, b| b.1.cmp(&a.1));

        for (address, _) in users.iter().take(limit) {
            result.push(address.clone());
        }

        result
    }

    fn calculate_star_cost(&self, current_stars: u64) -> BigUint {
        // Custo base: 0.1 EGLD
        let base_cost = self.types().big_uint_from(100_000_000_000_000_000u64);
        // Aumenta exponencialmente: base_cost * (1.5 ^ current_stars)
        base_cost * BigUint::from(15u64).pow(current_stars) / BigUint::from(10u64).pow(current_stars)
    }

    #[storage_mapper("profiles")]
    fn profiles(&self, address: &ManagedAddress) -> SingleValueMapper<Profile<Self::Api>>;

    #[storage_mapper("stars_received")]
    fn stars_received(&self, address: &ManagedAddress) -> SingleValueMapper<u64>;

    #[storage_mapper("stars_given_today")]
    fn stars_given_today(&self, address: &ManagedAddress, day: u64) -> SingleValueMapper<u64>;
}

#[derive(TypeAbi, TopEncode, TopDecode, NestedEncode, NestedDecode)]
pub struct Profile<M: ManagedTypeApi> {
    pub name: ManagedBuffer<M>,
    pub linkedin: ManagedBuffer<M>,
    pub github: ManagedBuffer<M>,
    pub twitter: ManagedBuffer<M>,
} 