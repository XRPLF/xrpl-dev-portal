const fs = require('fs');
const path = require('path');
const contentful = require('contentful');
require('dotenv').config();

const space = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

const client = contentful.createClient({
  space,
  accessToken,
});

async function fetchData() {
  try {
    const entries = await client.getEntries();
    // Transform the entries into the required JSON format
    const data = entries.items.map((item) => {
      return {
        id: item.sys.id,
        ...item.fields,
        image: item?.fields.image?.fields?.file?.url || '',
      };
    });
    // Write data to JSON file
    const filePath = path.join(__dirname, '../static/JSON/contentful-events.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log('Data fetched and written to contentful-events.json');
  } catch (error) {
    console.error('Error fetching data from Contentful:', error);
    process.exit(1);
  }
}

fetchData();
