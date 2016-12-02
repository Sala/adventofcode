<?php

$codes  = array();
$matrix = array(
	array( 0, 0, 1, 0, 0 ),
	array( 0, 2, 3, 4, 0 ),
	array( 5, 6, 7, 8, 9 ),
	array( 0, 'A', 'B', 'C', 0 ),
	array( 0, 0, 'D', 0, 0 ),
);
/* initial position 5 */
$i = 2;
$j = 0;

$file = fopen( "input.txt", "r" );

if ( $file ) {
	while ( ( $line = fgets( $file ) ) !== false ) {
		$codes[] = trim( $line );
	}

	fclose( $file );
}
$result = '';
foreach ( $codes as $code ) {
	for ( $k = 0; $k < strlen( $code ); $k ++ ) {
		move( $i, $j, $code[ $k ] );
	}
	$result .= $matrix[ $i ][ $j ];
}

echo $result;

/**
 * Move in matrix
 *
 * @param $i
 * @param $j
 * @param $dir
 */
function move( &$i, &$j, $dir ) {
	global $matrix;
	switch ( $dir ) {
		case 'U':
			$i = empty( $matrix[ $i - 1 ][ $j ] ) ? $i : $i - 1;
			break;
		case 'R':
			$j = empty( $matrix[ $i ][ $j + 1 ] ) ? $j : $j + 1;
			break;
		case 'D':
			$i = empty( $matrix[ $i + 1 ][ $j ] ) ? $i : $i + 1;
			break;
		case 'L':
			$j = empty( $matrix[ $i ][ $j - 1 ] ) ? $j : $j - 1;
			break;
	}
}