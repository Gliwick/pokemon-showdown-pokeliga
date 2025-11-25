/* eslint max-len: ["error", 140] */

import {toID} from '../../../sim/dex';
import {Species} from '../../../sim/dex-species';
import {RandomTeams} from '../../random-battles/gen9/teams';

const LEVEL = 50;

type Tier = 'Uber' | 'Master' | 'Veteran' | 'Ace';

type Tierable<T> = T | Partial<Record<Tier, T>>

type PartialPokemonSet = Pick<PokemonSet, 'species'> & Omit<Partial<PokemonSet>, 'moves' | 'ability' | 'item' | 'nature' | 'teraType'>;

interface MTFormatData extends PartialPokemonSet {
	// set data
	readonly moves: (string | string[])[];
	readonly abilities: string[];
	readonly items?: string[];
	readonly natures?: string[];
	readonly teraTypes?: string[];

	// availability
	readonly tiers?: string[];
	readonly required?: string[];
	readonly incompatible?: string[];
	readonly spriteId?: string;

	// battle eggects
	readonly aura?: SparseBoostsTable;
	readonly status?: string;

	readonly tierSpecific?: Record<Tier, Omit<Partial<MTFormatData>, 'tierSpecific'>>;
}

interface TrainerPokemonSet extends PokemonSet {
	trainerName: string;
	trainerSprite: string;
	possibleSpeed?: number[];

	aura?: SparseBoostsTable;
	status?: string;
	weather?: string;
}

interface Team {
	readonly sprite?: string | Sprite[];
	readonly tiers?: Tier[];
	readonly types?: Tierable<string[]>;
	readonly essentialPokemon?: Record<string, MTFormatData[]>;
	readonly essentialByTier?: Partial<Record<Tier, Record<string, MTFormatData[]>>>;
	readonly essentialBySprite?: Record<string, Record<string, MTFormatData[]>>;
	readonly pokemon: Record<string, MTFormatData[]>;
}

interface Sprite {
	readonly id: string;
	readonly link: string;
	readonly isRegular?: boolean;
	readonly name?: string;
	readonly tiers?: Tier[];
}
const REGULAR_SPRITE = 'REGULAR';

interface Trainer extends Team {
	readonly names?: string[];
	readonly name?: string;
	readonly links?: string[];
	readonly link?: string;
	readonly gen?: number | 'Anime';
	readonly game?: 'XD' | 'Colosseum' | 'Battle Revolution' | 'GO' | 'LGPE' | 'PLA' | 'PLZA';
	readonly teams?: Team[];
}

interface TeamDetails {
	hasSpecies: Record<string, boolean>;
	count: Record<string, number>;
}

const getTypes = (team: Team, tier: Tier): string[] => {
	if (Array.isArray(team.types)) return team.types;
	if (typeof team.types === 'object') return team.types[tier] || [];
	return [];
};

const AVAILABLE_TIERS: Tier[] = ['Uber', 'Master', 'Master', 'Master', 'Veteran', 'Veteran', 'Veteran', 'Ace', 'Ace', 'Ace'];
const TIER_SCALE: Record<Tier, number> = {
	Uber: 75,
	Master: 80,
	Veteran: 80,
	Ace: 83,
};
const COMPETITIVE_MOVES: Record<string, string[]> = {
	'Aegislash': ["King's Shield"],
	'Alakazam': ['Calm Mind', 'Recover'],
	'Annihilape': ['Rage Fist'],
	'Blastoise': ['Shell Smash'],
	'Cloyster': ['Shell Smash'],
	'Dragonite': ['Dragon Dance'],
	'Drednaw': ['Shell Smash'],
	'Dudunsparce': ['Boomburst'],
	'Dudunsparce-Three-Segment': ['Boomburst'],
	'Entei': ['Sacred Fire'],
	'Flygon': ['Dragon Dance'],
	'Galvantula': ['Sticky Web'],
	'Garchomp': ['Swords Dance'],
	'Gorebyss': ['Shell Smash'],
	'Gyarados': ['Dragon Dance'],
	'Haxorus': ['Dragon Dance', 'Swords Dance'],
	'Kommo-o': ['Clangorous Soul'],
	'Kingambit': ['Sucker Punch'],
	'Kyogre': ['Calm Mind', 'Water Spout'],
	'Latias': ['Calm Mind', 'Recover', 'Roost'],
	'Latios': ['Calm Mind', 'Recover', 'Roost'],
	'Lugia': ['Aeroblast Plus', 'Calm Mind', 'Recover', 'Roost', 'Shadow Blast', 'Shadow Storm'],
	'Lunala': ['Calm Mind'],
	'Manaphy': ['Tail Glow'],
	'Metagross': ['Hone Claws', 'Meteor Mash'],
	'Mewtwo': ['Calm Mind', 'Recover'],
	'Noivern': ['Boomburst'],
	'Pawmot': ['Revival Blessing'],
	'Polteageist': ['Shell Smash'],
	'Regieleki': ['Tera Blast'],
	'Revavroom': ['Shift Gear'],
	'Ribombee': ['Quiver Dance', 'Sticky Web'],
	'Salamence': ['Dragon Dance'],
	'Terapagos': ['Calm Mind'],
	'Torterra': ['Shell Smash'],
	'Toxapex': ['Recover'],
	'Toxtricity': ['Boomburst'],
	'Tyranitar': ['Dragon Dance'],
	'Venomoth': ['Quiver Dance'],
	'Victini': ['V-create'],
	'Volcarona': ['Quiver Dance'],
	'Weavile': ['Swords Dance'],
	'Xerneas': ['Geomancy'],
	'Zapdos': ['Air Slash', 'Hurricane'],
	'Zamazenta-Crowned': ['Body Press'],
	'Zekrom': ['Dragon Dance'],
};

const BULBAPEDIA_LINK = 'https://bulbapedia.bulbagarden.net/wiki/';

const SEASONAL_TRAINERS: Record<Tier | '*', string[]> = {
	'*': [
		// Anime gen 6
		'Alain', 'Sawyer',
		// Paradox
		'Lucius', 'Bede'
	],
	'Uber': [],
	'Master': [
		// Diancie, Paradox
		'Hilbert/Hilda/Nate/Rosa'
	],
	'Veteran': [],
	'Ace': [],
};
const filterSeasonalTeams = (id: string, team: Team, tier: Tier, isTrainer: boolean): boolean => {
	if (!isTrainer) {
		return true;
	}
	const t = (team as Trainer);
	return t.gen === 6 || t.gen === 9;
};

const SEASONAL_SPRITES: Record<string, string[]> = {
	'Hilbert/Hilda/Nate/Rosa': ['Hilda', 'Hilda Special', 'Hilda Champion'],
	'Aliana/Bryony/Celosia/Mable': ['Mable']
};
const filterSeasonalSprites = (sprite: Sprite, trainerId: string, tier: Tier): boolean => (
	(!sprite.tiers || sprite.tiers.includes(tier)) &&
	(!SEASONAL_SPRITES[trainerId] || SEASONAL_SPRITES[trainerId].includes(sprite.id))
);

const SEASONAL_POKEMON: Record<string, string[]> = {
};

export class RandomMTTeams extends RandomTeams {
	trainerTier?: Tier;
	trainerTypes: string[] = [];

	randomTrainerSets: AnyObject = {
		singles: require('./random-trainer-sets.json'),
		// doubles: require('./random-double-trainer-sets.json'),
	};

	filterIfNotEmpty<T>(array: T[], predicate: (s: T) => boolean): T[] {
		const filteredArray = array.filter(predicate);
		return filteredArray.length ? filteredArray : array;
	}
	randomMTSet(formatData: MTFormatData, trainer: Trainer, teamDetails: Readonly<TeamDetails>, tier: Tier): TrainerPokemonSet {
		const tierFormatData = {...formatData, ...(formatData.tierSpecific?.[tier] || {})};

		const template = this.dex.species.get(formatData.species);

		const randomMoves = (tierFormatData.moves && [...tierFormatData.moves]) || [];
		const moves: string[] = [];
		for (const m of randomMoves) {
			let randomMove = Array.isArray(m) ? m : [m];
			if (teamDetails.count['raindance'] > 0 || teamDetails.count['Drizzle'] > 0) {
				randomMove = this.filterIfNotEmpty(randomMove, name => name === 'Thunder');
			}
			moves.push(this.sample(randomMove));
		}

		const nature = this.sampleIfArray(tierFormatData.natures || 'Hardy');

		let abilities = tierFormatData.abilities;
		if (abilities.length > 1) {
			abilities = this.filterIfNotEmpty(abilities, (name => (['Chlorophyll', 'Solar Power'].includes(name)) === (
				teamDetails.count['sunnyday'] > 0 || teamDetails.count['Drought'] > 0 || teamDetails.count['Orichalcum Pulse'] > 0
			)));
			abilities = this.filterIfNotEmpty(abilities, (name => (['Rain Dish', 'Swift Swim'].includes(name)) === (
				teamDetails.count['raindance'] > 0 || teamDetails.count['Drizzle'] > 0
			)));
			abilities = this.filterIfNotEmpty(abilities, (name => (['Sand Rush', 'Sand Veil'].includes(name)) === (
				teamDetails.count['sandstorm'] > 0 || teamDetails.count['Sand Stream'] > 0 || teamDetails.count['Sand Spit'] > 0)
			));
			abilities = this.filterIfNotEmpty(abilities, (name =>
				(name === 'Snow Cloak') === (teamDetails.count['snowscape'] > 0 || teamDetails.count['Snow Warning'] > 0)
			));
			abilities = this.filterIfNotEmpty(abilities, (name => (name === 'Merciless') === (
				teamDetails.count['poisonfang'] > 0 || teamDetails.count['toxic'] > 0 || teamDetails.count['toxicspikes'] > 0
			)));
		}
		const ability = this.sample(abilities);


		let item = this.sampleIfArray(tierFormatData.items || '');
		const level = this.getMTLevel(tierFormatData, template, moves, ability, item, tier);
		if (
			!item && tier === 'Uber' && !tierFormatData.aura && !tierFormatData.status && template.tier !== 'Uber' &&
			level === LEVEL && !moves.includes('Acrobatics') &&
			Object.values(template.baseStats).reduce((sum, stat) => sum + stat, 0) < 660
		) {
			let items = ['Sitrus Berry', 'Focus Sash', 'Lum Berry'];
			if (moves.includes('Aurora Veil') || moves.includes('Light Screen') || moves.includes('Reflect')) items = ['Light Clay'];
			if ([
				'Comatose', 'Flare Boost', 'Guts', 'Marvel Scale', 'Natural Cure', 'Purifying Salt', 'Quick Feet', 'Toxic Boost',
			].includes(ability) || moves.includes('Heal Bell')) {
				items = items.filter(i => i !== 'Lum Berry');
			} else {
				if (moves.includes('Rest')) items = ['Lum Berry'];
			}
			item = this.sample(items);
		}

		let teraType: string;
		if (tierFormatData.teraTypes) {
			teraType = this.sample(tierFormatData.teraTypes);
		} else {
			let teraTypes = template.types;
			if (template.baseSpecies === 'Ogerpon') teraTypes = [template.types[template.types.length - 1]];
			if (template.baseSpecies === 'Terapagos') teraTypes = ['Stellar'];
			if (Object.values(template.abilities).includes('Overgrow')) teraTypes = ['Grass'];
			if (Object.values(template.abilities).includes('Blaze')) teraTypes = ['Fire'];
			if (Object.values(template.abilities).includes('Torrent')) teraTypes = ['Water'];

			if (ability === 'Levitate') {
				teraTypes = this.filterIfNotEmpty(teraTypes, t => t !== 'Flying');
			}
			if (ability === 'Lightning Rod') {
				teraTypes = this.filterIfNotEmpty(teraTypes, t => t !== 'Ground');
			}
			if (ability === 'Static') {
				teraTypes = this.filterIfNotEmpty(teraTypes, t => t !== 'Electric');
			}

			let moveTypes: string[] = [];
			for (const m of moves) {
				const move = this.dex.moves.get(m);
				if (move.category !== 'Status' && !move.damage && !move.damageCallback) moveTypes.push(move.type);
				if (move.id === 'weatherball') moveTypes = moveTypes.concat(['Fire', 'Ice', 'Rock', 'Water']);
			}
			teraTypes = this.filterIfNotEmpty(teraTypes, t => moveTypes.includes(t));

			teraType = this.sample(teraTypes);
		}

		const evsAndIvs = this.getEVsAndIVs(template, ability, item, level, moves);

		return {
			name: tierFormatData.name || template.baseSpecies || template.name,
			species: tierFormatData.species,
			moves,
			nature,
			gender: tierFormatData.gender || '',
			ability,
			item,
			level,
			shiny: tierFormatData.shiny,
			happiness: tierFormatData.happiness,
			evs: Object.assign(evsAndIvs.evs, tierFormatData.evs || {}),
			ivs: Object.assign(evsAndIvs.ivs, tierFormatData.ivs || {}),
			teraType,

			trainerName: trainer.name || '',
			trainerSprite: tierFormatData.spriteId || '',

			aura: tierFormatData.aura,
			status: tierFormatData.status,
		};
	}
	getMTLevel(formatData: MTFormatData, species: Species, moves: string[], abilityName: string, itemName: string, tier: Tier) {
		if (formatData.level) {
			return formatData.level;
		}

		let speciesLevel = this.getLevel(species, false);
		if (
			['Aegislash', 'Deoxys-Defense', 'Gorebyss', 'Krookodile', 'Venomoth'].includes(species.name) ||
			(species.name === 'Gothitelle' && abilityName === 'Shadow Tag') ||
			(species.name === 'Landorus' && abilityName === 'Sand Force')
		) {
			speciesLevel = TIER_SCALE['Master'] - 1;
		}
		if (
			['Gigalith', 'Reuniclus', 'Wobbuffet'].includes(species.name) ||
			(species.name === 'Politoed' && abilityName === 'Drizzle') ||
			(species.name === 'Torkoal' && abilityName === 'Drought') ||
			(species.name === 'Malamar' && abilityName === 'Contrary')
		) {
			speciesLevel = TIER_SCALE['Ace'] - 1;
		}
		if (['Castform', 'Pidgeot', 'Primeape', 'Swellow'].includes(species.name)) {
			speciesLevel = 88;
		}

		const competitiveConditions: boolean[] = [];
		if (Object.values(species.abilities).some(name => this.isCompetitiveAbility(this.dex.abilities.get(name)))) {
			competitiveConditions.push(this.isCompetitiveAbility(this.dex.abilities.get(abilityName)));
		}
		const competitiveMoves = COMPETITIVE_MOVES[species.name];
		if (competitiveMoves) {
			competitiveConditions.push(itemName.startsWith('Choice') || moves.some(m => competitiveMoves.includes(m)));
		}
		if (species.nfe) {
			competitiveConditions.push(['Eviolite', 'Light Ball'].includes(itemName));
		}

		const tierLevel = TIER_SCALE[tier];
		let scaledLevel;
		if (speciesLevel >= 88) {
			scaledLevel = LEVEL + 2;
		} else if (competitiveConditions.length && competitiveConditions.every(b => !b)) {
			scaledLevel = LEVEL;
		} else if (speciesLevel >= tierLevel) {
			scaledLevel = LEVEL;
		} else if (abilityName === 'Grassy Surge' && !moves.includes('Grassy Glide')) {
			scaledLevel = LEVEL - 1;
		} else {
			scaledLevel = Math.min(LEVEL - 2, Math.floor(speciesLevel * LEVEL / tierLevel));
		}

		if (moves.some(m => ['Hypnosis', 'Lovely Kiss', 'Sleep Powder', 'Spore', 'Yawn'].includes(m))) {
			scaledLevel -= 2;
		}
		if (itemName === 'Ultranecrozium Z') {
			scaledLevel -= 1;
		}

		return scaledLevel;
	}
	isCompetitiveAbility(ability: Ability) {
		return ability.rating >= 4 || ['Moxie', 'Sharpness'].includes(ability.name);
	}
	updateTeamDetails(teamDetails: TeamDetails, pokeSet: TrainerPokemonSet) {
		teamDetails.hasSpecies[pokeSet.species] = true;
		this.addTeamDetails(teamDetails, [pokeSet.species,
			...this.dex.species.get(pokeSet.species).types,
			...pokeSet.moves.map(m => toID(m)),
			pokeSet.item, pokeSet.ability]);
	}
	addTeamDetails(teamDetails: TeamDetails, items: string[]) {
		items.forEach(item => {
			teamDetails.count[item] = (teamDetails.count[item] || 0) + 1;
		});
	}
	getSpeed(pokeSet: TrainerPokemonSet): number {
		const template = this.dex.species.get(pokeSet.species);
		let spe = Math.floor(Math.floor(
			2 * template.baseStats.spe + pokeSet.ivs.spe + Math.floor(pokeSet.evs.spe / 4)
		) * pokeSet.level / 100 + 5);
		if (['Brave', 'Relaxed', 'Quiet', 'Sassy'].includes(pokeSet.nature)) {
			spe = Math.floor(0.9 * spe);
		}
		if (['Timid', 'Hasty', 'Jolly', 'Naive'].includes(pokeSet.nature)) {
			spe = Math.floor(1.1 * spe);
		}
		return spe;
	}
	getSpeeds(pokeSets: MTFormatData[], trainer: Trainer, tier: Tier, level: number): number[] {
		return pokeSets
			.flatMap(p => {
				// remove all random elements
				const pokeSetNoRandom = {...p, level: level};
				if (pokeSetNoRandom.items?.length !== 1) delete pokeSetNoRandom.items;
				if (pokeSetNoRandom.natures?.length !== 1) delete pokeSetNoRandom.natures;
				if (pokeSetNoRandom.teraTypes?.length !== 1) delete pokeSetNoRandom.teraTypes;
				return pokeSetNoRandom.abilities.map(a => ({...pokeSetNoRandom, abilities: [a]}));
			})
			.map(p => {
				const pokeSetNoRandom = {
					...p,
					moves: p.moves.flatMap(m => {
						if (Array.isArray(m)) return m;
						else return [m];
					}),
				};
				return pokeSetNoRandom;
			})
			.map(p => this.randomMTSet(p, trainer, {hasSpecies: {}, count: {}}, tier))
			.map(p => this.getSpeed(p));
	}
	randomMTTeam(side: PlayerOptions): TrainerPokemonSet[] {
		const trainerSets = this.randomTrainerSets[this.format.gameType] as Record<string, Trainer>;
		const tierToIds: Record<Tier, string[]> = {
			'Uber': [],
			'Master': [],
			'Veteran': [],
			'Ace': [],
		};
		for (const t of (Object.keys(tierToIds) as Tier[])) {
			tierToIds[t] = Object.keys(trainerSets)
				.filter(id => (
					SEASONAL_TRAINERS['*'].includes(id) || SEASONAL_TRAINERS[t].includes(id) ||
					filterSeasonalTeams(id, trainerSets[id], t, true)
				)).filter(id => ((trainerSets[id].tiers || ['Veteran']).includes(t)));
			console.log(`${t}: ${tierToIds[t].length} trainers`);
		}

		if (!this.trainerTier) this.trainerTier = this.sample(AVAILABLE_TIERS);
		const tier = this.trainerTier;
		// const tier = 'Master' as Tier; // debug only

		let ids = tierToIds[tier];

		const opponentTypes = this.trainerTypes;
		if (opponentTypes.length) {
			ids = ids.filter(id => {
				const trainerSet = trainerSets[id];
				const types = getTypes(trainerSet, tier);
				for (const type1 of opponentTypes) {
					for (const type2 of types) {
						const type1on2 = this.dex.getEffectiveness(type1, type2);
						const type2on1 = this.dex.getEffectiveness(type2, type1);
						if (type1on2 !== type2on1 || type1on2 > 0) {
							return false;
						}
					}
				}
				return true;
			});
		}

		let id = this.sample(ids);
		const commonSprite = trainerSets[id].sprite;
		if (((
			commonSprite && typeof commonSprite === 'object' &&
			!commonSprite.some(s => (s.id === REGULAR_SPRITE || s.isRegular) && (!s.tiers || s.tiers.includes(tier)))
		) || (tier === 'Uber' && trainerSets[id].tiers?.includes?.('Ace'))) && this.random(2) > 0
		) id = this.sample(ids);
		// id = 'Masamune'; // debug only
		console.log(tier, id);
		const trainerSet = trainerSets[id];

		// stub for doubles
		const trainers = [trainerSet];
		/* let trainers = trainerSet.trainers ? [...trainerSet.trainers] : [trainerSet];
		if (uber && this.format.gameType === 'doubles') {
			if (uber) {
				let uberTrainers = trainers.filter(trainer => (('uberPokemon' in trainer) || trainer.name === 'N'));
				let uberTrainer = this.sampleNoReplace(uberTrainers);
				trainers = trainers.filter(trainer => (trainer.name !== uberTrainer.name));
				let otherTrainer = this.sampleNoReplace(trainers);
				trainers = [uberTrainer, otherTrainer];
			} else {
				trainers = trainers.filter(trainer => (!trainer.uberOnly));
				while (trainers.length > 2) {
					this.sampleNoReplace(trainers);
				}
			}
		}

		if (trainers.length === 2 && this.random(2) === 0) {
			trainers = [trainers[1], trainers[0]];
		}*/

		const trainersPokemon: TrainerPokemonSet[][] = [];
		const teamDetails: TeamDetails = {hasSpecies: {}, count: {}};
		for (const t of trainers) {
			const trainer = {...t};

			const trainerPokemon: TrainerPokemonSet[] = [];

			const pokemonTeams = (trainer.teams ?
				this.filterIfNotEmpty(trainer.teams, team => filterSeasonalTeams(id, team, tier, false)) :
				[trainer]
			).filter(pokemonTeam => ((pokemonTeam.tiers || ['Veteran']).includes(tier)));
			const pokemonTeam = this.sample(pokemonTeams);

			let sprite: Sprite;
			const sprites = pokemonTeam.sprite || trainer.sprite || '';
			if (typeof sprites === 'string') {
				sprite = {id: REGULAR_SPRITE, link: sprites};
			} else {
				const tierSprites = this.filterIfNotEmpty(
					sprites.filter(s => !s.tiers || s.tiers.includes(tier)),
					s => filterSeasonalSprites(s, id, tier)
				);
				const regular = tierSprites.filter(s => s.id === REGULAR_SPRITE || s.isRegular);
				const special = tierSprites.filter(s => !(s.id === REGULAR_SPRITE || s.isRegular));
				if (regular.length && (!special.length || this.random(5) > 0)) sprite = {...this.sample(regular)};
				else sprite = {...this.sample(special)};
			}

			let essentialPokemon = Object.entries(pokemonTeam.essentialPokemon || {});
			if (pokemonTeam.essentialByTier?.[tier]) {
				essentialPokemon = Object.entries(pokemonTeam.essentialByTier[tier] || []).concat(essentialPokemon);
			}
			if (pokemonTeam.essentialBySprite?.[sprite.id]) {
				essentialPokemon = Object.entries(pokemonTeam.essentialBySprite[sprite.id]).concat(essentialPokemon);
			}

			const randomPokemon = pokemonTeam.pokemon;

			const seasonalPokemon = SEASONAL_POKEMON[id];
			if (seasonalPokemon?.length) {
				const seasonalPokeIds = Object.keys(randomPokemon)
					.filter(pid => randomPokemon[pid].some(p => seasonalPokemon.includes(p.species)));
				essentialPokemon = essentialPokemon.concat(Object.entries(randomPokemon).filter(e => seasonalPokeIds.includes(e[0])));
			}

			const allSets = essentialPokemon.map(e => e[1]).flat(1).concat(Object.values(randomPokemon).flat(1));

			const pokeIds: string[] = [];

			for (const entry of essentialPokemon) {
				const pokeId = entry[0];
				if (pokeIds.includes(pokeId)) continue;

				const pokeSets = this.filterIfNotEmpty(entry[1], p => (SEASONAL_POKEMON[id] || []).includes(p.species));
				let rejected = false;
				let formatData;
				let count = 0;
				do {
					formatData = this.sample(pokeSets);

					rejected = false;

					if (formatData.tiers && !formatData.tiers.includes(tier)) rejected = true;
					if (formatData.spriteId && formatData.spriteId !== sprite.id) rejected = true;
					if (teamDetails.hasSpecies[formatData.species]) rejected = true;
					if (formatData.items?.includes?.('Eviolite') && this.random(2) > 0) rejected = true;
					for (const required of (formatData.required || [])) {
						if (!teamDetails.count[required]) rejected = true;
					}
					for (const incompatible of (formatData.incompatible || [])) {
						if (teamDetails.count[incompatible] || teamDetails.hasSpecies[incompatible]) rejected = true;
					}

					pokeIds.push(pokeId);
					count++;
				} while (rejected && count <= 36);
				if (count > 36) {
					console.log('Exceeded pokemon set tries', pokeSets, teamDetails);
				}

				const pokeSet = this.randomMTSet(formatData, trainer, teamDetails, tier);
				this.updateTeamDetails(teamDetails, pokeSet);
				pokeSet.possibleSpeed = this.getSpeeds(allSets.filter(p => (p.species === pokeSet.species)),
					trainer, tier, pokeSet.level || LEVEL);

				trainerPokemon.push(pokeSet);
			}

			const trainerTypes = getTypes(trainerSet, tier);

			let pokemonPool = Object.keys(randomPokemon)
				.filter(pid => !pokeIds.includes(pid) && randomPokemon[pid].some(p => !p.spriteId || p.spriteId === sprite.id));

			let count = 0;
			while (trainerPokemon.length < 6 / trainers.length && count < 36) {
				count++;

				const pokeId = this.sample(pokemonPool);
				const formatData = this.sample(randomPokemon[pokeId]);

				let rejected = false;
				if (formatData.tiers && !formatData.tiers.includes(tier)) rejected = true;
				if (teamDetails.hasSpecies[formatData.species]) rejected = true;

				const template = this.dex.species.get(formatData.species);
				for (const pokeType of template.types) {
					if (!trainerTypes.includes(pokeType) && teamDetails.count[pokeType] >= 2) rejected = true;
				}

				for (const required of (formatData.required || [])) {
					if (!teamDetails.count[required]) rejected = true;
				}
				for (const incompatible of (formatData.incompatible || [])) {
					if (teamDetails.count[incompatible]) rejected = true;
				}

				if (formatData.items?.includes?.('Eviolite') && this.random(2) > 0) rejected = true;

				if (!rejected) {
					pokemonPool = pokemonPool.filter(pid => (pid !== pokeId));
					pokeIds.push(pokeId);

					const pokeSet = this.randomMTSet(formatData, trainer, teamDetails, tier);
					this.updateTeamDetails(teamDetails, pokeSet);
					pokeSet.possibleSpeed = this.getSpeeds(allSets.filter(p => (p.species === pokeSet.species)),
						trainer, tier, pokeSet.level || LEVEL);
					trainerPokemon.push(pokeSet);
				}
			}

			const names = trainer.names || [sprite.name || trainer.name || id];
			const link = names.map((name, i) => {
				const article = trainer.links?.[i] || trainer.link || name.replace(' ', '_');
				return '<a href="' + BULBAPEDIA_LINK + article + '">' + name + '</a>';
			}).join(' and ');

			for (const poke of trainerPokemon) {
				// adjust speed for Trick Room teams
				if (teamDetails.count['trickroom'] >= 2 && poke.item !== 'Choice Scarf') {
					poke.evs.spe = 0;
					poke.ivs.spe = 0;
					if (poke.possibleSpeed) {
						const spe = this.getSpeed(poke);
						poke.possibleSpeed.push(spe);
					}
				}

				// set trainer name and sprite
				poke.trainerName = link;
				poke.trainerSprite = sprite.link;
			}

			trainersPokemon.push(trainerPokemon);
		}

		// calculate repeating types for fair matchup
		if (!this.trainerTypes.length) {
			this.trainerTypes = this.dex.types.names().filter(t => teamDetails.count[t] >= 3);
		}

		return trainersPokemon.flat(1);
	}
}

export default RandomMTTeams;
