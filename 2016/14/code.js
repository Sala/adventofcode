import {md5} from "hash-wasm"

const SALT = 'qzyelonm';

console.log( await solve1() )

console.log( await solve2() );

async function solve1( padCount = 64 ) {
	const validHashes = [], possibleHashes = {}
	let keyIndex = - 1;

	console.time( 'md5' )
	while ( validHashes.length < padCount || Object.keys( possibleHashes ).length > 0 ) {
		const hash = await md5( `${SALT}${keyIndex}` )
		let matches = hash.match( /(.)\1{2,}/g )

		if ( matches ) {
			matches.forEach( ( match, i ) => {
				const repeatingLetter = match[ 0 ]

				if ( match.length >= 5 && typeof possibleHashes[ repeatingLetter ] !== 'undefined' ) {
					possibleHashes[ repeatingLetter ].filter( index => keyIndex !== index && keyIndex - index < 1000 ).forEach( index => {
						validHashes.push( index )
					} )

					delete possibleHashes[ repeatingLetter ]
				}

				if ( i === 0 && validHashes.length < padCount ) {
					/* read only the first encounter */
					if ( typeof possibleHashes[ repeatingLetter ] === 'undefined' ) {
						possibleHashes[ repeatingLetter ] = []
					}

					possibleHashes[ repeatingLetter ].push( keyIndex )
				}
			} )
		}

		keyIndex ++;
	}
	console.timeEnd( 'md5' )

	return validHashes.sort( ( a, b ) => a - b )[ padCount - 1 ]; //15168
}

async function solve2( padCount = 64 ) {
	let validHashes = [], possibleHashes = {}
	console.time( 'md5' );

	/* a big chunk so we have from where to choose */
	( await generateStretchedHashes( 30000 ) ).forEach( ( hash, hashIndex ) => {
		let matches = hash.match( /(.)\1{2,}/g )

		if ( matches ) {
			matches.forEach( ( match, i ) => {
				const repeatingLetter = match[ 0 ]

				if ( match.length >= 5 && typeof possibleHashes[ repeatingLetter ] !== 'undefined' ) {
					possibleHashes[ repeatingLetter ].filter( index => index !== hashIndex && hashIndex - index < 1000 ).forEach( index => {
						validHashes.push( index )
					} )

					delete possibleHashes[ repeatingLetter ]
				}

				if ( i === 0 ) {
					/* read only the first encounter */
					if ( typeof possibleHashes[ repeatingLetter ] === 'undefined' ) {
						possibleHashes[ repeatingLetter ] = []
					}

					possibleHashes[ repeatingLetter ].push( hashIndex )
				}
			} )
		}
	} )
	console.timeEnd( 'md5' )

	return validHashes.sort( ( a, b ) => a - b )[ padCount - 1 ];

}

async function stretchedHash( key ) {
	for ( let i = 1; i <= 2017; i ++ ) {
		key = await md5( key )
	}
	return key;
}

async function generateStretchedHashes( amount ) {
	let md5s = [], index = 0;

	while ( index <= amount ) {
		const hash = await stretchedHash( `${SALT}${index}` )
		md5s.push( hash )
		index ++
	}

	return md5s;
}
