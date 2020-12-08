const diskSize = 272,
	secondDiskSize = 35651584,
	initialState = '10011111011011001';

function generateDiskData( state, size ) {
	if ( state.length >= size ) {
		return state.slice( 0, size )
	} else {
		const newState = state.split( '' ).reverse().map( x => parseInt( x ) ? '0' : '1' ).join( '' )

		return generateDiskData( `${state}0${newState}`, size )
	}
}

function generateChecksum( data ) {
	let checksum = ''
	for ( let i = 0; i < data.length - 1; i += 2 ) {
		checksum += ( data[ i ] === data[ i + 1 ] ? '1' : '0' )
	}

	return checksum.length % 2 === 0 ? generateChecksum( checksum ) : checksum
}

console.log( generateChecksum( generateDiskData( initialState, diskSize ) ) );
console.log( generateChecksum( generateDiskData( initialState, secondDiskSize ) ) );



