import {readFile} from '../../helpers.js'
const fields = [
	'byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid',
	//'cid'
]

readFile( 'input.txt' ).then( lines => {

	const passports = [];

	lines.split( '\r\n\r\n' ).forEach( passPort => {
		passports.push( passPort.split( '\r\n' ).join( ' ' ) + ' ' )
	} )

	console.log( solve1( passports ) );
	console.log( solve2( passports ) );
} )

function solve1( passports ) {
	let validPassports = 0

	passports.forEach( passport => {
		let isValid = true;
		fields.forEach( field => {
			isValid = isValid && new RegExp( `${field}:\S*` ).test( passport )
		} )
		validPassports += isValid ? 1 : 0
	} )

	return validPassports
}

function solve2( passports ) {
	let validPassports = 0
	passports.forEach( passport => {
		validPassports += isPassportValid( passport ) ? 1 : 0
	} )

	return validPassports
}

function isPassportValid( passport ) {
	let isValid = true;
	let match;
	fields.forEach( field => {
		switch ( field ) {
			case 'byr':
				match = /byr:\s*(\d{4})\D/g.exec( passport )
				isValid = isValid && match && parseInt( match[ 1 ] ) <= 2002 && parseInt( match[ 1 ] ) >= 1920
				break;

			case 'iyr':
				match = /iyr:\s*(\d{4})\D/g.exec( passport )
				isValid = isValid && match && parseInt( match[ 1 ] ) <= 2020 && parseInt( match[ 1 ] ) >= 2010
				break;

			case 'eyr':
				match = /eyr:\s*(\d{4})\D/g.exec( passport )
				isValid = isValid && match && parseInt( match[ 1 ] ) <= 2030 && parseInt( match[ 1 ] ) >= 2020
				break;

			case 'hgt':
				match = /hgt:\s*(\d*)(cm|in)\s/g.exec( passport )
				if ( match ) {
					const um = match[ 2 ], h = parseInt( match[ 1 ] )
					isValid = isValid && ( ( um === 'cm' && h >= 150 && h <= 193 ) || ( um === 'in' && h >= 59 && h <= 76 ) )
				} else {
					isValid = false
				}
				break;
			case 'hcl':
				isValid = isValid && /hcl:\s*#[0-9a-f]{6}\s/g.test( passport )
				break;
			case 'ecl':
				isValid = isValid && /ecl:\s*(amb|blu|brn|gry|grn|hzl|oth)\s/g.test( passport )
				break;
			case 'pid':
				isValid = isValid && /pid:\s*\d{9}\D/g.test( passport )
				break;
		}
	} )
	return isValid
}
