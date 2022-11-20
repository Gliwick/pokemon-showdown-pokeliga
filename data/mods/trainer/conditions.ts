export const Conditions: { [k: string]: ModdedConditionData } = {
	// XD
	reversemode: {
		name: 'ReverseMode',
		onStart(target) {
			this.add('-start', target, 'reversemode');
			this.add('-message', target.name + ' entered REVERSE MODE!');
			this.add('-message', '(the Pokemon receives a 50% Speed boost, may disobey instead of using any moves other than Shadow and will deal damage to itself at the end of every turn)');
		},
		onModifySpePriority: 10,
		onModifySpe(sp) {
			return this.modify(sp, 1.5);
		},
		onBeforeMovePriority: 3,
		onBeforeMove(pokemon, target, move) {
			if (move.type === 'Shadow' || !this.randomChance(pokemon.level, pokemon.level + 100)) {
				return;
			}
			this.add('-message', target.name + ' disobeyed!');
			if (this.randomChance(1, 2)) {
				this.add('-activate', pokemon, 'confusion');
				this.activeTarget = pokemon;
				const damage = this.actions.getConfusionDamage(pokemon, 40);
				if (typeof damage !== 'number') throw new Error("Hyper mode damage not dealt");
				const activeMove = {id: this.toID('confused'), effectType: 'Move', type: '???'};
				this.damage(damage, pokemon, pokemon, activeMove as ActiveMove);
			}
			return false;
		},
		onResidualOrder: 28,
		onResidualSubOrder: 3,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 16);
		},
		onEffectivenessPriority: -2,
		onEffectiveness(typeMod, target, type, move) {
			if (move.type === 'Shadow') return 0;
		},
		onImmunity(type) {
			if (type === 'shadowyaura') return false;
		},
	},
	shadowyaura: {
		name: 'ShadowyAura',
		effectType: 'Weather',
		duration: 5,
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (move.type === 'Shadow') {
				this.debug('ShadowyAura shadow boost');
				return this.chainModify(1.5);
			}
		},
		onFieldStart(field, source, effect) {
			this.add('-weather', 'ShadowyAura');
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'ShadowyAura', '[upkeep]');
			if (this.field.isWeather('shadowyaura')) this.eachEvent('Weather');
		},
		onWeather(target) {
			this.damage(target.baseMaxhp / 16);
		},
		onFieldEnd() {
			this.add('-weather', 'none');
		},
	},

	// GO
	shadow: {
		name: 'Shadow',
		onStart(target, source, sourceEffect) {
			this.add('-start', target, 'shadow');
			this.add('-message', target.name + ' is surrounded by purple fire!');
			this.add('-message', '(attack stats are multiplied by 1.2, defense stats are multiplied by 0.833)');
		},
		onModifyAtkPriority: 10,
		onModifyAtk(atk) {
			return this.modify(atk, 1.2);
		},
		onModifyDefPriority: 10,
		onModifyDef(def) {
			return this.modify(def, [5, 6]);
		},
		onModifySpAPriority: 10,
		onModifySpA(sp) {
			return this.modify(sp, 1.2);
		},
		onModifySpDPriority: 10,
		onModifySpD(sp) {
			return this.modify(sp, [5, 6]);
		},
		onEffectivenessPriority: -2,
		onEffectiveness(typeMod, target, type, move) {
			if (move.type === 'Shadow') return 0;
		},
		onImmunity(type) {
			if (type === 'shadowyaura') return false;
		},
	},

	// PLA
	wildmight: {
		name: 'WildMight',
		onStart(target) {
			this.add('-start', target, 'wildmight');
			this.add('-message', 'The Alpha ' + target.species.baseSpecies + ' is filled with wild might!');
			this.add('-message', "(attack and defense stats are boosted, and the Pokemon will take reduced damage from status conditions)");
		},
		onModifyAtkPriority: 10,
		onModifyAtk(atk) {
			return this.modify(atk, 1.5);
		},
		onModifyDefPriority: 10,
		onModifyDef(def) {
			return this.modify(def, 1.5);
		},
		onModifySpAPriority: 10,
		onModifySpA(sp) {
			return this.modify(sp, 1.5);
		},
		onModifySpDPriority: 10,
		onModifySpD(sp) {
			return this.modify(sp, 1.5);
		},
		onDamage(damage, target, source, effect) {
			if (effect && ['brn', 'psn', 'tox', 'baddreams', 'spikes', 'stealthrock', 'gmaxsteelsurge'].includes(effect.id)) {
				return damage / 2;
			}
		},
	},
	terriblemight: {
		name: 'TerribleMight',
		onStart(target) {
			this.add('-start', target, 'terriblemight');
			this.add('-message', target.name + ' is filled with terrible might!');
			this.add('-message', "(the Pokemon will take reduced damage from status conditions)");
		},
		onDamage(damage, target, source, effect) {
			if (effect && ['brn', 'psn', 'tox', 'baddreams', 'spikes', 'stealthrock', 'gmaxsteelsurge'].includes(effect.id)) {
				return damage / 2;
			}
		},
	},

	// manga
	eeveelution: {
		name: "Eeveelution",
		onStart(target) {
			this.add('-start', target, 'eeveelution');
			this.add('-message', target.name + ' can change its evolutions!');
		},
		onPrepareHit(source, target, move) {
			if (move.hasBounced || move.sourceEffect === 'snatch') return;
			if (!(source.species.baseSpecies === 'Eevee' || source.species.prevo === 'Eevee')) return;
			const type = move.type;
			if (type && source.hp && !source.transformed && source.side.foePokemonLeft()) {
				let forme: string | null = null;
				switch (type) {
				case 'Water':
					forme = 'Vaporeon';
					break;
				case 'Electric':
					forme = 'Jolteon';
					break;
				case 'Fire':
					forme = 'Flareon';
					break;
				case 'Psychic':
					forme = 'Espeon';
					break;
				case 'Normal':
					forme = 'Eevee';
					break;
				}
				if (forme && forme !== source.species.name) {
					this.add('-activate', source, 'eeveelution');
					source.formeChange(forme, this.effect, true);
				}
			}
		},
	},
};
