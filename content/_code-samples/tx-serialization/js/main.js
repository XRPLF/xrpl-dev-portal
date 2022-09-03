const fs = require('fs');
const { Client } = require("xrpl");
const ripple_binary_codec = require('ripple-binary-codec');

const payload = require("./json_input.json");
let outputs = require("./binary_outputs.json");

// if output JSON is invalid set the default value to empty array
outputs = Array.isArray(outputs) ? outputs : [];

const main = async () => {
    try {
        console.log("Converting your transaction...");

        // connect to a public server
        const client = new Client("wss://xrplcluster.com/");
        await client.connect();

        // autofill all the missing fields
        const complete_payload = await client.autofill(payload);

        // convert the JSON tx to serialized using ripple-binary-codec (https://github.com/XRPLF/xrpl.js/tree/main/packages/ripple-binary-codec)
        const decoded_payload = ripple_binary_codec.encode(complete_payload);

        // push decoded tx into output array
        outputs.push(decoded_payload);

        // write the output into output.json file.
        fs.writeFileSync("./binary_outputs.json", JSON.stringify(outputs, null, "\t"));

        // disconnect from public server
        await client.disconnect();
        console.log("Success! Check binary_outputs.json file");

        // exit process
        process.exit(0);

    } catch (error) {
        // log if error occurs & exit process
        console.log("Some error occured");
        console.error(error);
        process.exit(1);
    }
};

main();
