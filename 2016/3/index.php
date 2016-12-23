<?php

$triangles = array();

$file = fopen( "input.txt", "r" );

if ( $file ) {
	while ( ( $line = fgets( $file ) ) !== false ) {

		preg_match( "/\s* (\d*) \s* (\d*) \s* (\d*)/", $line, $numbers );

		array_shift( $numbers );

		$triangles[] = $numbers;
	}

	fclose( $file );
}

$count = 0;

foreach ( $triangles as $triangle ) {
	$count += is_triangle( $triangle ) ? 1 : 0;
}
var_dump( 'Result 1: ', $count );;

$count = 0;
for ( $i = 0; $i < count( $triangles ) - 2; $i += 3 ) {
	$count += is_triangle( array( $triangles[ $i ][0], $triangles[ $i + 1 ][0], $triangles[ $i + 2 ][0] ) ) ? 1 : 0;
	$count += is_triangle( array( $triangles[ $i ][1], $triangles[ $i + 1 ][1], $triangles[ $i + 2 ][1] ) ) ? 1 : 0;
	$count += is_triangle( array( $triangles[ $i ][2], $triangles[ $i + 1 ][2], $triangles[ $i + 2 ][2] ) ) ? 1 : 0;
}

var_dump( 'Result 2: ', $count );;


/**
 * Check if the triangle is correct
 *
 * @param $triangle
 *
 * @return bool
 */
function is_triangle( $triangle ) {
	return $triangle[0] + $triangle[1] > $triangle[2] &&
	       $triangle[1] + $triangle[2] > $triangle[0] &&
	       $triangle[2] + $triangle[0] > $triangle[1];
}