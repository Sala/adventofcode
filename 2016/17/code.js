import {md5} from 'hash-wasm';

const EXAMPLE_CODE = 'kglvqrro'
const CODE = 'pgflpeqp';
const W = 4, H = 4;
const openDoorCharacters = [ 'b', 'c', 'd', 'e', 'f' ];
let paths = []

await solve();

async function findPath( x, y, code, path ) {
	if ( x === 4 && y === 4 ) {
		paths.push( path );
	} else {
		const accessCode = await md5( code )

		for ( let direction of getOpenDoors( accessCode, x, y ) ) {
			await findPath( direction.x, direction.y, `${code}${direction.label}`, [ ...path, direction.label ] )
		}
	}
}

function getOpenDoors( code, x, y ) {
	let availablePositions = [];

	/* MOVE UP */
	if ( openDoorCharacters.includes( code[ 0 ] ) && y > 1 ) {
		availablePositions.push( {
			label: 'U',
			y: y - 1,
			x
		} )
	}

	/* MOVE DOWN */
	if ( openDoorCharacters.includes( code[ 1 ] ) && y < H ) {
		availablePositions.push( {
			label: 'D',
			y: y + 1,
			x
		} )
	}

	/* MOVE LEFT */
	if ( openDoorCharacters.includes( code[ 2 ] ) && x > 1 ) {
		availablePositions.push( {
			label: 'L',
			x: x - 1,
			y
		} )
	}

	/* MOVE RIGHT */
	if ( openDoorCharacters.includes( code[ 3 ] ) && x < W ) {
		availablePositions.push( {
			label: 'R',
			x: x + 1,
			y
		} )
	}

	return availablePositions;
}

async function solve() {
	await findPath( 1, 1, CODE, [] )

	paths = paths.sort( ( path1, path2 ) => path1.length - path2.length )

	console.log( paths.shift().join( '' ) );
	console.log( paths.pop().length );
}
