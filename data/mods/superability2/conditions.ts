export const Conditions: { [k: string]: ModdedConditionData } = {
	slp: {
		inherit: true,
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'slp', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else if (sourceEffect && sourceEffect.effectType === 'Move') {
				this.add('-status', target, 'slp', '[from] move: ' + sourceEffect.name);
			} else {
				this.add('-status', target, 'slp');
			}
			// 1-3 turns
			const multiplier = (sourceEffect?.effectType === 'Ability') ? 2 : 1;
			this.effectState.startTime = multiplier * this.random(2, 5);
			this.effectState.time = this.effectState.startTime;

			if (target.removeVolatile('nightmare')) {
				this.add('-end', target, 'Nightmare', '[silent]');
			}
		},
		onBeforeMove(pokemon, target, move) {
			if (pokemon.hasAbility('earlybird')) {
				pokemon.statusState.time -= 2;
			}
			pokemon.statusState.time--;
			if (pokemon.statusState.time <= 0) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'slp');
			if (move.sleepUsable) {
				return;
			}
			return false;
		},
	},

	futuremove: {
		inherit: true,
		onEnd(target) {
			const data = this.effectState;
			// time's up; time to hit! :D
			const move = this.dex.moves.get(data.move);
			if (target.fainted || target === data.source) {
				this.hint(`${move.name} did not hit because the target is ${(target.fainted ? 'fainted' : 'the user')}.`);
				return;
			}

			this.add('-end', target, 'move: ' + move.name);
			target.removeVolatile('Protect');
			target.removeVolatile('Endure');

			if (data.source.hasAbility('infiltrator') && this.gen >= 6) {
				data.moveData.infiltrates = true;
			}
			if (data.source.hasAbility('normalize') && this.gen >= 6) {
				data.moveData.type = 'Normal';
			}
			if (data.source.hasAbility('adaptability') && this.gen >= 6) {
				data.moveData.stab = (8 / 3);
			}
			const hitMove = new this.dex.Move(data.moveData) as ActiveMove;

			this.actions.trySpreadMoveHit([target], data.source, hitMove, true);
			if (data.source.isActive && data.source.hasItem('lifeorb') && this.gen >= 5) {
				this.singleEvent('AfterMoveSecondarySelf', data.source.getItem(), data.source.itemState, data.source, target, data.source.getItem());
			}
			this.activeMove = null;

			this.checkWin();
		},
	},

	raindance: {
		inherit: true,
		durationCallback(source, target, effect) {
			let duration = 5;
			if (effect?.effectType === 'Ability') {
				duration *= 2;
			}
			if (source?.hasItem('damprock')) {
				duration += 3;
			}
			return duration;
		},
	},
	sunnyday: {
		inherit: true,
		durationCallback(source, target, effect) {
			let duration = 5;
			if (effect?.effectType === 'Ability') {
				duration *= 2;
			}
			if (source?.hasItem('heatrock')) {
				duration += 3;
			}
			return duration;
		},
	},
	sandstorm: {
		inherit: true,
		durationCallback(source, target, effect) {
			let duration = 5;
			if (effect?.effectType === 'Ability') {
				duration *= 2;
			}
			if (source?.hasItem('smoothrock')) {
				duration += 3;
			}
			return duration;
		},
	},
	snow: {
		inherit: true,
		durationCallback(source, target, effect) {
			let duration = 5;
			if (effect?.effectType === 'Ability') {
				duration *= 2;
			}
			if (source?.hasItem('icyrock')) {
				duration += 3;
			}
			return duration;
		},
	},

	commanded: {
		inherit: true,
		onStart(pokemon) {
			this.boost({atk: 4, spa: 4, spe: 4, def: 4, spd: 4}, pokemon);
		},
	},
};
