export const Abilities: { [k: string]: ModdedAbilityData } = {
	overcoat: {
		inherit: true,
		onImmunity(type, pokemon) {
			if (type === 'sandstorm' || type === 'hail' || type === 'powder' || type === 'shadowyaura') return false;
		},
	},
};
