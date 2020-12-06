class Container {
	constructor( index ) {
		this._items = {}
		this.index = index
	}

	get items() {
		return Object.keys( this._items )
	}

	add( item ) {
		this._items[ item ] = true;
	}

	addMicroChip( microChip ) {
		this._items[ `M-${microChip}` ] = true;
	}

	addGenerator( generator ) {
		this._items[ `G-${generator}` ] = true;
	}

	remove( item ) {
		delete this._items[ item ];
	}

	removeGenerator( generator ) {
		delete this._items[ `G-${generator}` ]
	}

	removeMicroChip( microChip ) {
		delete this._items[ `M-${microChip}` ]
	}

	has( item ) {
		return !! this._items[ item ]
	}

	hasGenerator( element ) {
		return !! this._items[ `G-${element}` ];
	}

	hasMicroChip( element ) {
		return !! this._items[ `M-${element}` ];
	}

	get generators() {
		return this.items.filter( item => item[ 0 ] === 'G' ).map( item => item.slice( - 2 ) )
	}

	get microChips() {
		return this.items.filter( item => item[ 0 ] === 'M' ).map( item => item.slice( - 2 ) )
	}

	get length() {
		return this.items.length
	}
}

export default Container
