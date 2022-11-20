/* eslint max-len: ["error", 140] */

import {MoveCounter, RandomTeams} from '../../random-teams';

type RandomSpeciesData = RandomTeamsTypes.RandomSpeciesData;
type RandomSetData = RandomTeamsTypes.RandomSetData;
type Role = RandomTeamsTypes.Role;

interface ExtendedRandomSpeciesData {
	level?: number;
	sets: ExtendedRandomSetData[];
}

interface ExtendedRandomSetData extends Omit<RandomSetData, 'movepool'> {
	movepool?: string[];
	addedMovepool?: string[];
	removedMovepool?: string[];
	addedTeraTypes?: string[];
	removedTeraTypes?: string[];
}

export class RandomSATeams extends RandomTeams {
	saRandomSets: Partial<Record<string, ExtendedRandomSpeciesData>> = require('./random-sets.json');
	randomSets = Object.entries(require('../../random-sets.json') as Record<string, RandomSpeciesData>)
		.concat(['zweilous', 'girafarig']
			.map(species => [species, this.saRandomSets[species] as RandomSpeciesData]))
		.reduce((randomSets, [species, data]) => {
			const saData = this.saRandomSets[species];
			const roleToSaSet = (saData?.sets || []).reduce((acc, v) => {
				acc[v.role] = v;
				return acc;
			}, {} as Partial<Record<Role, ExtendedRandomSetData>>);
			let sets = data.sets.map(set => {
				const saSet = roleToSaSet[set.role];
				return {
					role: set.role,
					movepool: saSet?.movepool ||
						set.movepool.filter(m => !(saSet?.removedMovepool || []).includes(m)).concat(saSet?.addedMovepool || []),
					teraTypes: saSet?.teraTypes ||
						(set.teraTypes || []).filter(m => !(saSet?.removedTeraTypes || []).includes(m)).concat(saSet?.addedTeraTypes || []),
					preferredTypes: set.preferredTypes,
				} as RandomSetData;
			});

			const roles = data.sets.map(set => set.role);
			sets = sets.concat((saData?.sets || [])
				.filter(set => !roles.includes(set.role))
				.map(set => ({
					role: set.role,
					movepool: set.movepool || [],
					teraTypes: set.teraTypes,
				} as RandomSetData)));

			randomSets[species] = {
				level: saData?.level || data.level,
				sets,
			} as RandomSpeciesData;
			return randomSets;
		}, {} as Record<string, RandomSpeciesData>);

	getAbility(
		types: string[],
		moves: Set<string>,
		abilities: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role,
	): string {
		if (['delphox', 'typhlosion', 'typhlosionhisui'].includes(species.id)) return 'Blaze';
		if (['dedenne', 'greedent'].includes(species.id)) return 'Cheek Pouch';
		if (['girafarig'].includes(species.id)) return 'Early Bird';
		if (['revavroom'].includes(species.id)) return 'Filter';
		if (['drifblim'].includes(species.id)) return 'Flare Boost';
		if (['flapple'].includes(species.id)) return 'Hustle';
		if (['crabominable'].includes(species.id)) return 'Iron Fist';
		if (['gyarados', 'krookodile', 'mightyena', 'salamence'].includes(species.id)) return 'Moxie';
		if (['torterra'].includes(species.id)) return 'Overgrow';
		if (['staraptor'].includes(species.id)) return 'Reckless';
		if (['pyroar'].includes(species.id)) return 'Rivalry';
		if (['dudunsparce', 'dudunsparcethreesegment', 'sawsbuck'].includes(species.id)) return 'Serene Grace';
		if (['copperajah', 'tauros'].includes(species.id)) return 'Sheer Force';
		if (['camerupt'].includes(species.id)) return 'Solid Rock';
		if (['perrserker'].includes(species.id)) return 'Steely Spirit';
		if (['avalugghisui', 'bruxish', 'drednaw'].includes(species.id)) return 'Strong Jaw';
		if (['ariados', 'leavanny'].includes(species.id)) return 'Swarm';
		if (['kricketune', 'maushold', 'mausholdfour', 'persian', 'scizor', 'scyther'].includes(species.id)) return 'Technician';
		if (['appletun'].includes(species.id)) return 'Thick Fat';
		if (['lokix', 'noctowl', 'venomoth'].includes(species.id)) return 'Tinted Lens';
		if (['empoleon', 'samurott'].includes(species.id)) return 'Torrent';
		if (['ceruledge', 'polteageist'].includes(species.id)) return 'Weak Armor';

		if (species.id === 'armarouge') {
			if (teraType === 'Grass') {
				return 'Flash Fire';
			}
			return 'Weak Armor';
		}
		if (species.id === 'bronzong') {
			return this.sample(['Heatproof', 'Levitate']);
		}
		if (species.id === 'chesnaught') {
			if (moves.has('trailblaze') || moves.has('woodhammer')) {
				return 'Overgrow';
			}
			return 'Bulletproof';
		}
		if (species.id === 'corviknight') {
			return this.sample(['Mirror Armor', 'Pressure']);
		}
		if (species.id.startsWith('decidueye')) {
			if (moves.has('leafblade')) {
				return 'Overgrow';
			}
		}
		if (species.id === 'infernape') {
			if (role === 'Setup Sweeper') {
				 return 'Blaze';
			}
			return 'Iron Fist';
		}
		if (species.id === 'fezandipiti') {
			if (role === 'Tera Blast user') {
				 return 'Toxic Chain';
			}
			return 'Technician';
		}
		if (species.id === 'gogoat') {
			if (teamDetails.grassyterrain) {
				return 'Grass Pelt';
			}
			return 'Sap Sipper';
		}
		if (species.id === 'haxorus') {
			return this.sample(['Mold Breaker', 'Rivalry']);
		}
		if (species.id === 'inteleon') {
			if (role === 'Setup Sweeper') {
				return 'Sniper';
			}
			return 'Torrent';
		}
		if (species.id === 'magcargo') {
			if (role === 'Setup Sweeper') {
				return 'Weak Armor';
			}
			return 'Flame Body';
		}
		if (species.id === 'sandaconda') {
			if (moves.has('Rest')) {
				return 'Shed Skin';
			}
			return 'Sand Spit';
		}
		if (species.id === 'toxicroak') {
			if (teamDetails.rain) {
				return 'Dry Skin';
			}
			return 'Poison Touch';
		}
		if (species.id === 'ursaring') {
			if (role === 'Fast Attacker') {
				return 'Quick Feet';
			}
			return 'Guts';
		}
		if (species.id === 'voclarona') {
			if (moves.has('bugbuzz')) {
				return 'Swarm';
			}
			return 'Flame Body';
		}

		return super.getAbility(types, moves, abilities, counter, teamDetails, species, isLead, isDoubles, teraType, role);
	}

	getItem(
		ability: string,
		types: string[],
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role,
	): string {
		if (['girafarig', 'zweilous'].includes(species.id)) return 'Eviolite';

		if (species.id === 'ursaring') {
			if (role === 'Fast Attacker') {
				return 'Toxic Orb';
			}
			return 'Eviolite';
		}

		return super.getItem(ability, types, moves, counter, teamDetails, species, isLead, teraType, role);
	}
}

export default RandomSATeams;
