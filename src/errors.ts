class InvalidFormatError extends Error {
	constructor(message: string, stack: any) {
		super(message);
		this.name = "InvalidFormatError";
		this.stack = stack;
	}
}

export default InvalidFormatError;
