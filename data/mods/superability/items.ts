export const Items: {[k: string]: ModdedItemData} = {
	jabocaberry: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Physical' && source.hp && source.isActive && !source.hasAbility('magicguard')) {
				if (target.eatItem()) {
					const multiplier = target.hasAbility('ripen') ? 4 : 1;
					this.damage(source.baseMaxhp * multiplier / 8, source, target);
				}
			}
		},
	},
	rowapberry: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Special' && source.hp && source.isActive && !source.hasAbility('magicguard')) {
				if (target.eatItem()) {
					const multiplier = target.hasAbility('ripen') ? 4 : 1;
					this.damage(source.baseMaxhp * multiplier / 8, source, target);
				}
			}
		},
	},
};
