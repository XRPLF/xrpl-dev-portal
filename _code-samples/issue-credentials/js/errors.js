// Error handling --------------------------------------------------------------

class ValueError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValueError";
    this.status = 400;
    this.type = "badRequest";
  }
}

class XRPLTxError extends Error {
  constructor(xrplResult, status = 400) {
    super("XRPL transaction failed");
    this.name = "XRPLTxError";
    this.status = status;
    this.body = xrplResult;
  }
}

class XRPLLookupError extends Error {
  constructor(xrplResult) {
    super("XRPL credential lookup failed");
    this.name = "XRPLLookupError";
    this.status = 400;
    this.body = xrplResult;
  }
}

module.exports = {
  ValueError,
  XRPLTxError,
  XRPLLookupError,
};
