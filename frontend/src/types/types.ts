export type IScreenshots = Record<IWowClass, IScreenshot[]>;

export type IScreenshot = {
	id: number;
	path: string;
	wow_name: string;
	wow_class: string;
};

export type IWowClass =
	| 'death knight'
	| 'demon hunter'
	| 'druid'
	| 'evoker'
	| 'hunter'
	| 'mage'
	| 'monk'
	| 'paladin'
	| 'priest'
	| 'rogue'
	| 'shaman'
	| 'warlock'
	| 'warrior';
