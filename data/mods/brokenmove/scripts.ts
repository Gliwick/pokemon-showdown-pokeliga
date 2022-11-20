export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	init() {
		for (const id in this.data.Moves) {
			const move = this.data.Moves[id];

			const flags = {...move.flags};
			delete flags['cantusetwice'];
			delete flags['charge'];
			delete flags['recharge'];
			this.modData('Moves', id).flags = flags;

			if (['dragonenergy', 'eruption', 'waterspout'].includes(id)) {
				this.modData('Moves', id).basePowerCallback = (pokemon: Pokemon, target: Pokemon, m: ActiveMove) => m.basePower;
			}

			if (move.hasCrashDamage) {
				this.modData('Moves', id).hasCrashDamage = false;
			}

			if (move.mindBlownRecoil) {
				this.modData('Moves', id).mindBlownRecoil = false;
			}

			if (move.recoil) {
				this.modData('Moves', id).recoil = null;
				if (move.basePower && move.basePower < 100) {
					this.modData('Moves', id).drain = move.recoil;
				}
			}

			if (move.self) {
				const self = {...move.self};
				if (self.volatileStatus && !['rage', 'roost'].includes(self.volatileStatus)) {
					delete self['volatileStatus'];
				}
				if (self.boosts && id !== 'diamondstorm') {
					delete self['boosts'];
				}
				this.modData('Moves', id).self = self;
			}

			if (move.selfdestruct) {
				this.modData('Moves', id).selfdestruct = false;
			}

			if (move.onTry && ![
				'comeuppance', 'counter', 'metalburst', 'mirrorcoat',
				'doomdesire', 'futuresight',
				'echoedvoice', 'round',
				'spitup', 'swallow',
				'teleport',
			].includes(id)) {
				this.modData('Moves', id).onTry = () => {};
			}

			if (move.onTryMove && !['meteorbeam', 'pollenpuff', 'skullbash'].includes(id)) {
				this.modData('Moves', id).onTryMove = () => {};
			}
		}
	},
};
