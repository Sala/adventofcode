<?php

$messages = array();

$file = fopen( "input.txt", "r" );

if ( $file ) {
	while ( ( $line = fgets( $file ) ) !== false ) {

		$messages[] = trim( $line );
	}

	fclose( $file );
}

$decode = array();

foreach ( $messages as $message ) {
	for ( $i = 0; $i < strlen( $message ); $i ++ ) {
		if ( empty( $decode[ $i ] ) ) {
			$decode[ $i ] = array();
		}

		if ( empty( $decode[ $i ][ $message[ $i ] ] ) ) {
			$decode[ $i ][ $message[ $i ] ] = 0;
		}

		$decode[ $i ][ $message[ $i ] ] ++;
	}
}

$first = '';
foreach ( $decode as $k => $v ) {
	//arsort( $decode[ $k ] );
	asort( $decode[ $k ] );
	reset( $decode[ $k ] );
	$first .= key( $decode[ $k ] );
}

echo $first;