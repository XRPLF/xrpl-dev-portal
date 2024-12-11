const fs = require('fs');
const path = require('path');
const moment = require('moment');
const contentful = require('contentful');
require('dotenv').config();
const eventTypeLookup = {
    hackathon: 'hackathon',
    meetup: 'meetup',
    ama: 'ama',
    conference: 'conference',
    'community-call': 'cc',
    'xrpl-zone': 'zone',
    'info-session': 'info',
}
const imageFallbackLookup = {
    hackathon: 'Hackathons.png',
    meetup: '', // should not be blank from contentful
    ama: 'AMAs.png',
    conference: 'Conference.png',
    'community-call': 'CommunityCalls.png',
    'xrpl-zone': 'XRPLZone.png',
    'info-session': 'InfoSessions.png',
}
const space = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

const client = contentful.createClient({
  space,
  accessToken,
});

async function fetchData() {
  try {
    const entries = await client.getEntries();
    const data = entries.items.map((item) => {
        // Edit: Format the dates to match events.json format
        const startDate = moment(item.fields.startDate);
        const endDate = moment(item.fields.endDate);
        const startDateFormatted = startDate.format('MMMM D, YYYY');
        const endDateFormatted = endDate.format('MMMM D, YYYY');
        const sameDay = startDate.isSame(endDate, 'day');
        const sameMonth = startDate.isSame(endDate, 'month');
        const sameYear = startDate.isSame(endDate, 'year');
        let dateString;

        if (sameDay) {
            dateString = startDateFormatted;
        } else if (sameYear && sameMonth) {
            dateString = `${startDate.format('MMMM D')} - ${endDate.format('D, YYYY')}`;
        } else if (sameYear) {
            dateString = `${startDate.format('MMMM D')} - ${endDateFormatted}`;
        } else {
            dateString = `${startDateFormatted} - ${endDateFormatted}`;
        }

        const eventType = (item.fields.category[0]).toLocaleLowerCase();
        return {
          name: item.fields.name, 
          description: item.fields.description, 
          type: eventTypeLookup[eventType], 
          link: item.fields.link, 
          location: item.fields.location, 
          date: dateString,
          image: item?.fields?.image?.fields?.file?.url ? `https:${item.fields.image.fields.file.url}` : imageFallbackLookup[eventType], 
          end_date: endDateFormatted,
          start_date: startDateFormatted,
          community: item.fields.community,
          contentful: true, // flag to show its coming from contentful
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
