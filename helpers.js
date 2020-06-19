module.exports = {
	/**
	 * Does what it says.
	 * @param fileName
	 * @return {Promise<unknown>}
	 */
	readFile: ( fileName = '' ) => {
		return new Promise( ( resolve, reject ) => {
			require( 'fs' ).readFile( fileName, 'utf8', ( error, contents ) => {
				error ? reject( error ) : resolve( contents );
			} );
		} )
	}
}
