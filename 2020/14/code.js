import {readFile, bin2dec, dec2bin, sum} from '../../helpers.js';

readFile( 'input.txt', true ).then( lines => {
	const instructions = lines.map( line => {
		const maskRegex = /mask = ([01X]*)/gm;
		const instructionRegex = /\[(\d*)\] = (\d*)/gm;
		let match, instruction = {}

		if ( line.includes( 'mask' ) ) {
			match = maskRegex.exec( line )
			if ( match ) {
				instruction.mask = match[ 1 ];
			}
		} else {
			match = instructionRegex.exec( line )
			if ( match ) {
				instruction.index = match[ 1 ];
				instruction.value = match[ 2 ];
			}
		}

		return instruction
	} )

	console.log( solve1( instructions ) );
	console.log( solve2( instructions ) );
} )

function solve1( instructions ) {
	let mask, memory = {};

	instructions.forEach( instruction => {
		if ( instruction.mask ) {
			mask = instruction.mask
		} else {
			memory[ instruction.index ] = maskNumber( mask, instruction.value )
		}
	} )

	return sum( Object.values( memory ) )
}

function solve2( instructions ) {
	let mask, memory = {};

	instructions.forEach( instruction => {
		if ( instruction.mask ) {
			mask = instruction.mask
		} else {
			const addresses = generateAddresses( mask, instruction.index )
			addresses.forEach( address => {
				memory[ address ] = parseInt( instruction.value )
			} )

		}
	} )

	return sum( Object.values( memory ) )
}

function maskNumber( mask, number ) {
	let binNumber = dec2bin( number ).split( '' ).reverse();

	mask.split( '' ).reverse().forEach( ( maskBit, index ) => {
		if ( maskBit === 'X' ) {
			if ( typeof binNumber[ index ] === 'undefined' ) {
				binNumber[ index ] = 0
			}
		} else {
			binNumber[ index ] = maskBit
		}
	} )

	return bin2dec( binNumber.reverse().join( '' ) )
}

function generateAddresses( mask, address ) {
	let binNumber = dec2bin( address ).split( '' ).reverse();

	mask.split( '' ).reverse().forEach( ( maskBit, index ) => {
		if ( maskBit === '0' ) {
			if ( typeof binNumber[ index ] === 'undefined' ) {
				binNumber[ index ] = 0
			}
		} else {
			binNumber[ index ] = maskBit
		}
	} )

	return [ ...new Set( generateCombinations( binNumber.reverse() ) ) ].map( c => bin2dec( c.join( '' ) ) )
}

function generateCombinations( floatingAddress ) {
	let combinations = [ floatingAddress ];

	while ( combinations.some( c => c.includes( 'X' ) ) ) {
		const address = combinations.shift();
		const xIndex = address.findIndex( bit => bit === 'X' )

		if ( xIndex === - 1 ) {
			combinations.push( address )
		} else {
			let newAddress = [ ...address ]
			newAddress[ xIndex ] = '1'
			combinations.push( [ ...newAddress ] )
			newAddress[ xIndex ] = '0'
			combinations.push( [ ...newAddress ] )
		}
	}

	return combinations;
}
