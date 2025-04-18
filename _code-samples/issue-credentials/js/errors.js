export class ValueError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValueError";
    this.status = 400;
    this.type = "badRequest";
  }
}

export class XRPLTxError extends Error {
  constructor(xrplResponse, status = 400) {
    super("XRPL transaction failed");
    this.name = "XRPLTxError";
    this.status = status;
    this.body = xrplResponse.result;
  }
}
