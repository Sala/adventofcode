class Output {
	constructor( ID ) {
		this.ID = ID;
		this.chips = [];
	}

	getID() {
		return this.ID;
	}

	addChip( chipValue ) {
		this.chips.push( chipValue );
	}

	getChips() {
		return this.chips;
	}
}

module.exports = Output;
