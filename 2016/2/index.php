<?php

$codes  = array();
$matrix = array(
	array( 1, 2, 3 ),
	array( 4, 5, 6 ),
	array( 7, 8, 9 )
);
/* initial position 5 */
$i = $j = 1;

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
	switch ( $dir ) {
		case 'U':
			$i = $i == 0 ? 0 : $i - 1;
			break;
		case 'R':
			$j = $j == 2 ? 2 : $j + 1;
			break;
		case 'D':
			$i = $i == 2 ? 2 : $i + 1;
			break;
		case 'L':
			$j = $j == 0 ? 0 : $j - 1;
			break;
	}
}