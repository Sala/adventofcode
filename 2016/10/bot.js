class Bot {

	constructor( ID ) {
		this.ID = ID;
		this.chips = [];
	}

	getID() {
		return this.ID;
	}

	/**
	 * @param {Bot|Output} receiver
	 */
	setLowReceiver( receiver ) {
		this.lowReceiver = receiver;
	}

	/**
	 * @param {Bot|Output} receiver
	 */
	setHighReceiver( receiver ) {
		this.highReceiver = receiver;
	}

	sendChips() {
		this.lowReceiver.addChip( this.lowChip );
		this.highReceiver.addChip( this.highChip );
		this.emptyChips();
	}

	canSend() {
		return this.chips.length === 2;
	}

	addChip( chipValue ) {
		this.chips.push( chipValue );
	}

	hasChip( chipValue ) {
		return this.chips.includes( chipValue );
	}

	get lowChip() {
		return Math.min( ...this.chips );
	}

	get highChip() {
		return Math.max( ...this.chips );
	}

	emptyChips() {
		this.chips = [];
	}
}

export default Bot;
