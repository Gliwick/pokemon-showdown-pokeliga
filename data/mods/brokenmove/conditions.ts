export const Conditions: { [k: string]: ModdedConditionData } = {
	stall: {
		inherit: true,
		onStallMove(pokemon) {
			return true;
		},
	},
};
