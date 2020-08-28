# Get Started

The XRP Ledger is always online and entirely public. You can access it directly from your browser with [RippleAPI for JavaScript (ripple-lib)](rippleapi-reference.html). Try experimenting with some of the following examples:

<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.js"></script>
<script type="application/javascript" src="assets/js/ripple-lib-1.8.0-min.js"></script>
<link rel="stylesheet" type="text/css" href="assets/vendor/codemirror.css"/>
<script type="text/javascript" src="assets/vendor/codemirror-js-json-lint.min.js"></script>

<pre><code id="step2code">
const mainnet = new ripple.RippleAPI({
  server: 'wss://s1.ripple.com' // Ripple's public cluster
  // server: 'wss://s2.ripple.com' // Ripple's full history cluster
  // server: 'wss://xrpl.ws' // XRPL Labs full history cluster
  // server: 'wss://s.altnet.rippletest.net/' // Testnet
  // server: 'wss://s.devnet.rippletest.net/' // Devnet
});

(async function(api) {
  await api.connect();
  let ledger = await api.getLedger();
  console.log(ledger);
})(mainnet);
</code></pre>
<button type="button" id="step2button" class="btn btn-primary">Run</button>
<h3>Output</h3>
<div id="step2resp"></div>

<script type="application/javascript">
const code_ex = $("#step2code");
const code_text = code_ex.text().trim();
code_ex.text("");
const cm = CodeMirror(code_ex.get(0), {
  mode: 'javascript',
  json: false,
  smartIndent: false,
});
cm.setValue(code_text);
const cm_resp = CodeMirror($("#step2resp").get(0), {
  mode: 'javascript',
  json: false,
  readOnly: true
});

let ret;
$("#step2button").click((evt) => {
  const oldconsole = console;
  console = {
    log: (...args) => {
      oldconsole.log(...args);
      args.forEach(arg => cm_resp.setValue(JSON.stringify(arg, null, 2)))
    }
  }
  Function(cm.getValue())();
});
</script>
