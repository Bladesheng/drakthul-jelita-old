/**
 * Downloads all images from Google Sheets and names them by their class based on their position
 * Usage: wait for all images to load and then paste this into console
 */

const WOW_CLASSES = [
	{ name: 'death_knight', maxLeft: 120 },
	{ name: 'demon_hunter', maxLeft: 260 },
	{ name: 'druid', maxLeft: 430 },
	{ name: 'evoker', maxLeft: 580 },
	{ name: 'hunter', maxLeft: 710 },
	{ name: 'mage', maxLeft: 840 },
	{ name: 'monk', maxLeft: 970 },
	{ name: 'paladin', maxLeft: 1130 },
	{ name: 'priest', maxLeft: 1320 },
	{ name: 'rogue', maxLeft: 1470 },
	{ name: 'shaman', maxLeft: 1620 },
	{ name: 'warlock', maxLeft: 1770 },
	{ name: 'warrior', maxLeft: 1980 },
];

[...document.querySelectorAll('.waffle-borderless-embedded-object-overlay')]
	.filter((img) => getComputedStyle(img).display !== 'none')
	.forEach((img, i) => {
		const left = getComputedStyle(img).left.replace('px', '');
		const leftNumber = parseInt(left);

		const className = WOW_CLASSES.find((wowClass) => wowClass.maxLeft > leftNumber).name;

		const index = (i + 1).toString().padStart(3, '0');

		const imgSrc = img.querySelector('.waffle-borderless-embedded-object-container img').src;

		setTimeout(async () => {
			const res = await fetch(imgSrc);
			const blob = await res.blob();

			const anchorTag = document.createElement('a');
			const imgUrl = URL.createObjectURL(blob);
			anchorTag.href = imgUrl;
			anchorTag.download = `${className}-${index}.png`;
			anchorTag.click();

			anchorTag.remove();
			URL.revokeObjectURL(imgUrl);
		}, i * 200);
	});
