export const Moves: { [k: string]: ModdedMoveData } = {
	belch: {
		inherit: true,
		onDisableMove() {},
	},
	bellydrum: {
		inherit: true,
		onHit(target) {
			this.boost({atk: 12}, target);
		},
	},
	clangoroussoul: {
		inherit: true,
		onTry() {},
		onHit() {},
	},
	curse: {
		inherit: true,
		onTryHit(target, source, move) {
			if (!source.hasType('Ghost')) {
				delete move.volatileStatus;
				delete move.onHit;
				move.self = {boosts: {atk: 1, def: 1}};
			} else if (move.volatileStatus && target.volatiles['curse']) {
				return false;
			}
		},
		onHit() {},
	},
	defog: {
		inherit: true,
		onHit(target, source, move) {
			let success = false;
			if (!target.volatiles['substitute'] || move.infiltrates) success = !!this.boost({evasion: -1});
			const removeTarget = [
				'reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist',
			];
			const removeSource = [
				'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
			];
			for (const targetCondition of removeTarget) {
				if (target.side.removeSideCondition(targetCondition)) {
					if (!removeSource.includes(targetCondition)) continue;
					this.add('-sideend', target.side, this.dex.conditions.get(targetCondition).name, '[from] move: Defog', '[of] ' + source);
					success = true;
				}
			}
			for (const sideCondition of removeSource) {
				if (source.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', source.side, this.dex.conditions.get(sideCondition).name, '[from] move: Defog', '[of] ' + source);
					success = true;
				}
			}
			this.field.clearTerrain();
			return success;
		},
	},
	flatter: {
		inherit: true,
		boosts: null,
	},
	filletaway: {
		inherit: true,
		onTry() {},
		onHit() {},
	},
	flowershield: {
		inherit: true,
		onHitField(t, source, move) {
			let success = false;
			for (const pokemon of this.getAllActive()) {
				success = this.boost({def: 1}, pokemon, source, move) || success;
			}
			return success;
		},
	},
	focuspunch: {
		inherit: true,
		beforeMoveCallback() {},
	},
	gearup: {
		inherit: true,
		onHitSide(side, source, move) {
			const targets = side.allies();
			if (!targets.length) return false;
			let didSomething = false;
			for (const target of targets) {
				didSomething = this.boost({atk: 1, spa: 1}, target, source, move, false, true) || didSomething;
			}
			return didSomething;
		},
	},
	hurricane: {
		inherit: true,
		onModifyMove(move, pokemon, target) {
			switch (target?.effectiveWeather()) {
			case 'raindance':
			case 'primordialsea':
				move.accuracy = true;
				break;
			}
		},
	},
	meteorbeam: {
		inherit: true,
		onTryMove(attacker, defender, move) {
			this.boost({spa: 1}, attacker, attacker, move);
		},
	},
	moonlight: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
	},
	magneticflux: {
		inherit: true,
		onHitSide(side, source, move) {
			const targets = side.allies();
			if (!targets.length) return false;
			let didSomething = false;
			for (const target of targets) {
				didSomething = this.boost({def: 1, spd: 1}, target, source, move, false, true) || didSomething;
			}
			return didSomething;
		},
	},
	morningsun: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
	},
	present: {
		inherit: true,
		onModifyMove(move, pokemon, target) {
			const rand = this.random(10);
			if (rand < 2) {
				move.damageCallback = (p: Pokemon, t: Pokemon) => this.clampIntRange(t.getUndynamaxedHP() / 4, 1);
				move.infiltrates = true;
			} else if (rand < 6) {
				move.basePower = 40;
			} else if (rand < 9) {
				move.basePower = 80;
			} else {
				move.basePower = 120;
			}
		},
	},
	rest: {
		inherit: true,
		onTry() {},
		onHit(target) {
			this.heal(target.maxhp);
		},
	},
	rototiller: {
		inherit: true,
		onHitField(target, source) {
			for (const pokemon of this.getAllActive()) {
				this.boost({atk: 1, spa: 1}, pokemon, source);
			}
		},
	},
	shedtail: {
		inherit: true,
		onTryHit(source) {
			if (!this.canSwitch(source.side) || source.volatiles['commanded']) {
				this.add('-fail', source);
				return this.NOT_FAIL;
			}
			if (source.volatiles['substitute']) {
				this.add('-fail', source, 'move: Shed Tail');
				return this.NOT_FAIL;
			}
			if (source.hp <= Math.ceil(source.maxhp / 4)) {
				this.add('-fail', source, 'move: Shed Tail', '[weak]');
				return this.NOT_FAIL;
			}
		},
		onHit(target) {
			this.directDamage(Math.ceil(target.maxhp / 4));
		},
	},
	shellsmash: {
		inherit: true,
		boosts: {
			atk: 2,
			spa: 2,
			spe: 2,
		},
	},
	skullbash: {
		inherit: true,
		onTryMove(attacker, defender, move) {
			this.boost({def: 1}, attacker, attacker, move);
		},
	},
	solarbeam: {
		inherit: true,
		onTryMove() {},
		onBasePower() {},
	},
	solarblade: {
		inherit: true,
		onTryMove() {},
		onBasePower() {},
	},
	stuffcheeks: {
		inherit: true,
		onDisableMove() {},
		onTry() {},
		onHit(pokemon) {
			if (!this.boost({def: 2})) return null;
			if (pokemon.getItem().isBerry) pokemon.eatItem(true);
		},
	},
	swagger: {
		inherit: true,
		boosts: null,
	},
	synthesis: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
	},
	thunder: {
		inherit: true,
		onModifyMove(move, pokemon, target) {
			switch (target?.effectiveWeather()) {
			case 'raindance':
			case 'primordialsea':
				move.accuracy = true;
				break;
			}
		},
	},
};
