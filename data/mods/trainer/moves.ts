export const Moves: { [k: string]: ModdedMoveData } = {
	buzzybuzz: {
		inherit: true,
		basePower: 90,
	},
	terrainpulse: {
		inherit: true,
		onModifyType(move, pokemon) {
			if (!pokemon.isGrounded()) return;
			switch (this.field.terrain) {
			case 'electricterrain':
				move.type = 'Electric';
				break;
			case 'grassyterrain':
				move.type = 'Grass';
				break;
			case 'mistyterrain':
				move.type = 'Fairy';
				break;
			case 'psychicterrain':
				move.type = 'Psychic';
				break;
			case 'dragonwish':
				move.type = 'Dragon';
				break;
			case 'ghostwish':
				move.type = 'Ghost';
				break;
			}
		},
	},
	weatherball: {
		inherit: true,
		onModifyType(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.type = 'Fire';
				break;
			case 'raindance':
			case 'primordialsea':
				move.type = 'Water';
				break;
			case 'sandstorm':
				move.type = 'Rock';
				break;
			case 'hail':
			case 'snow':
				move.type = 'Ice';
				break;
			case 'shadowyaura':
				move.type = '???';
				break;
			}
		},
		onModifyMove(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'hail':
			case 'snow':
			case 'shadowyaura':
				move.basePower *= 2;
				break;
			}
		},
	},

	// XD
	shadowblast: {
		num: 366,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Shadow Blast",
		pp: 40,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		critRatio: 2,
		onEffectiveness(typeMod, target, type) {
			if (!target) return;
			if (type !== target.getTypes()[0]) return;
			return 1;
		},
		secondary: null,
		target: "normal",
		type: "Shadow",
		shortDesc: "High critical hit ratio.",
	},
	shadowbolt: {
		num: 365,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: "Shadow Bolt",
		pp: 40,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onEffectiveness(typeMod, target, type) {
			if (!target) return;
			if (type !== target.getTypes()[0]) return;
			return 1;
		},
		secondary: {
			chance: 10,
			status: 'par',
		},
		target: "normal",
		type: "Shadow",
		shortDesc: "10% chance to paralyze the target.",
	},
	shadowbreak: {
		num: 358,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Shadow Break",
		pp: 40,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onEffectiveness(typeMod, target, type) {
			if (!target) return;
			if (type !== target.getTypes()[0]) return;
			return 1;
		},
		secondary: null,
		target: "normal",
		type: "Shadow",
	},
	shadowchill: {
		num: 364,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: "Shadow Chill",
		pp: 40,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onEffectiveness(typeMod, target, type) {
			if (!target) return;
			if (type !== target.getTypes()[0]) return;
			return 1;
		},
		secondary: {
			chance: 10,
			status: 'frz',
		},
		target: "normal",
		type: "Shadow",
		shortDesc: "10% chance to freeze the target.",
	},
	shadowend: {
		num: 359,
		accuracy: 60,
		basePower: 120,
		category: "Physical",
		name: "Shadow End",
		pp: 40,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		mindBlownRecoil: true,
		onAfterMove(pokemon, target, move) {
			if (move.mindBlownRecoil && !move.multihit) {
				this.damage(Math.ceil(pokemon.maxhp / 2), pokemon, pokemon, this.dex.conditions.get('Shadow End'), true);
			}
		},
		onEffectiveness(typeMod, target, type) {
			if (!target) return;
			if (type !== target.getTypes()[0]) return;
			return 1;
		},
		secondary: null,
		target: "normal",
		type: "Shadow",
		shortDesc: "User loses 50% max HP.",
	},
	shadowfire: {
		num: 363,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: "Shadow Fire",
		pp: 40,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onEffectiveness(typeMod, target, type) {
			if (!target) return;
			if (type !== target.getTypes()[0]) return;
			return 1;
		},
		secondary: {
			chance: 10,
			status: 'brn',
		},
		target: "normal",
		type: "Shadow",
		shortDesc: "10% chance to burn the target.",
	},
	shadowhold: {
		num: 368,
		accuracy: 80,
		basePower: 0,
		category: "Status",
		name: "Shadow Hold",
		pp: 40,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onHit(target, source, move) {
			return target.addVolatile('trapped', source, move, 'trapper');
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Shadow",
		shortDesc: "Prevents the target from switching out.",
	},
	shadowpanic: {
		num: 370,
		accuracy: 60,
		basePower: 0,
		category: "Status",
		name: "Shadow Panic",
		pp: 40,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1},
		volatileStatus: 'confusion',
		secondary: null,
		target: "allAdjacentFoes",
		type: "Shadow",
		shortDesc: "Confuses the target.",
	},
	shadowrave: {
		num: 361,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Shadow Rave",
		pp: 40,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onEffectiveness(typeMod, target, type) {
			if (!target) return;
			if (type !== target.getTypes()[0]) return;
			return 1;
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Shadow",
	},
	shadowrush: {
		num: 357,
		accuracy: 100,
		basePower: 55,
		category: "Physical",
		name: "Shadow Rush",
		pp: 40,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		critRatio: 2,
		onEffectiveness(typeMod, target, type) {
			if (!target) return;
			if (type !== target.getTypes()[0]) return;
			return 1;
		},
		secondary: null,
		target: "normal",
		type: "Shadow",
		shortDesc: "High critical hit ratio.",
	},
	shadowshed: {
		num: 372,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Shadow Shed",
		pp: 40,
		priority: 0,
		flags: {bypasssub: 1},
		onHit(target, source, move) {
			const removeTarget = [
				'reflect', 'lightscreen', 'safeguard', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
			];
			for (const targetCondition of removeTarget) {
				if (target.side.removeSideCondition(targetCondition)) {
					this.add('-sideend', target.side, this.dex.conditions.get(targetCondition).name, '[from] move: Shadow Shed', '[of] ' + source);
				}
			}
			return true;
		},
		secondary: null,
		target: "all",
		type: "Shadow",
		shortDesc: "Clears hazards and screens on both sides.",
	},
	shadowsky: {
		num: 372,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Shadow Sky",
		pp: 40,
		priority: 0,
		flags: {},
		weather: 'ShadowyAura',
		secondary: null,
		target: "all",
		type: "Shadow",
		shortDesc: "For 5 turns, a shadowy aura powers Shadow moves.",
	},
	shadowstorm: {
		num: 362,
		accuracy: 100,
		basePower: 95,
		category: "Special",
		name: "Shadow Storm",
		pp: 40,
		priority: 0,
		flags: {protect: 1},
		onEffectiveness(typeMod, target, type) {
			if (!target) return;
			if (type !== target.getTypes()[0]) return;
			return 1;
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Shadow",
	},
	shadowwave: {
		num: 360,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		name: "Shadow Wave",
		pp: 40,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onEffectiveness(typeMod, target, type) {
			if (!target) return;
			if (type !== target.getTypes()[0]) return;
			return 1;
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Shadow",
	},

	// GO
	aeroblastplus: {
		num: 177,
		accuracy: 100,
		basePower: 170,
		category: "Special",
		name: "Aeroblast Plus",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, distance: 1},
		critRatio: 2,
		secondary: null,
		target: "any",
		type: "Flying",
		shortDesc: "High critical hit ratio.",
	},
	sacredfireplus: {
		num: 221,
		accuracy: 100,
		basePower: 130,
		category: "Physical",
		name: "Sacred Fire Plus",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, defrost: 1},
		secondary: {
			chance: 50,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		shortDesc: "50% chance to burn the target. Thaws user.",
	},

	// Masters
	dragonwish: {
		num: 0,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Dragon Wish",
		pp: 2,
		priority: 0,
		flags: {nonsky: 1},
		terrain: 'dragonwish',
		condition: {
			duration: 5,
			onBasePowerPriority: 6,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Dragon' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
					this.debug('dragon wish boost');
					return this.chainModify([3, 2]);
				}
			},
			onFieldStart(field, source, effect) {
				this.add('-fieldstart', 'move: Dragon Wish');
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
				this.add('-fieldend', 'move: Dragon Wish');
			},
		},
		secondary: null,
		target: "all",
		type: "Dragon",
		shortDesc: "5 turns. Grounded: +Dragon power.",
	},
	ghostwish: {
		num: 0,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Ghost Wish",
		pp: 2,
		priority: 0,
		flags: {nonsky: 1},
		terrain: 'ghostwish',
		condition: {
			duration: 5,
			onBasePowerPriority: 6,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Ghost' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
					this.debug('ghost wish boost');
					return this.chainModify([3, 2]);
				}
			},
			onFieldStart(field, source, effect) {
				this.add('-fieldstart', 'move: Ghost Wish');
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
				this.add('-fieldend', 'move: Ghost Wish');
			},
		},
		secondary: null,
		target: "all",
		type: "Ghost",
		shortDesc: "5 turns. Grounded: +Ghost power.",
	},
	rockwish: {
		num: 0,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Rock Wish",
		pp: 2,
		priority: 0,
		flags: {nonsky: 1},
		terrain: 'rockwish',
		condition: {
			duration: 5,
			onBasePowerPriority: 6,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Rock' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
					this.debug('rock wish boost');
					return this.chainModify([3, 2]);
				}
			},
			onFieldStart(field, source, effect) {
				this.add('-fieldstart', 'move: Rock Wish');
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
				this.add('-fieldend', 'move: Rock Wish');
			},
		},
		secondary: null,
		target: "all",
		type: "Rock",
		shortDesc: "5 turns. Grounded: +Rock power.",
	},
};
