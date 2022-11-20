export const Items: {[k: string]: ModdedItemData} = {
	safetygoggles: {
		inherit: true,
		onImmunity(type, pokemon) {
			if (type === 'sandstorm' || type === 'powder' || type === 'shadowyaura') return false;
		},
	},
};
