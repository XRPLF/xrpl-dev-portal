const { Client, encode } = require("xrpl");

const payload = require("./json_input.json");

const main = async () => {
    try {
        console.log(`Converting your transaction...\n`);

        // connect to a public server
        const client = new Client("wss://xrplcluster.com/");
        await client.connect();

        // autofill all the missing fields
        const complete_payload = await client.autofill(payload);

        // convert the JSON tx to serialized using xrpl.js
        const decoded_payload = encode(complete_payload);

        // display output
        console.log(`Serialized value:\n${decoded_payload}`);

        // disconnect from public server
        await client.disconnect();

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
