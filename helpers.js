module.exports = {
	/**
	 * Does what it says.
	 * @param {string} fileName
	 * @param {boolean} splitLines
	 * @return {Promise<unknown>}
	 */
	readFile: ( fileName = '', splitLines = false ) => {
		return new Promise( ( resolve, reject ) => {
			require( 'fs' ).readFile( fileName, 'utf8', ( error, contents ) => {
				if ( error ) {
					reject( error );
				} else {
					if ( splitLines ) {
						contents = contents.split( '\r\n' ).filter( line => line.trim().length );
					}

					resolve( contents );
				}
			} );
		} )
	}
}
