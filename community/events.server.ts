import type { PageRouteDetails } from '@redocly/realm/dist/server/plugins/types';

const cache = {
  response: null,
  expiresAt: 0,
};

async function fetchGql(query: string) {
  return fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.PUBLIC_CONTENTFUL_SPACE_ID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ query, variables: {}, operationName: 'GetEvents' }),
  }).then(res => res.json());
}

const GET_EVENTS = `
  query GetEvents {
    eventsCollection(order: startDate_ASC) {
      items {
        _id
        name
        description
        category
        link
        location
        startDate
        endDate
        community
        image {
          url
        }
      }
    }
  }
`;


export default async function getServerProps(route: PageRouteDetails, data: { props: any }) {
  try {
    if (cache.expiresAt <= Date.now()) {
      cache.response = await fetchGql(GET_EVENTS);
      cache.expiresAt = Date.now() + 1000 * 60 * 1; // 5 minutes naive cache
    }
  } catch (e) {
    console.error('Failed to fetch events', e);
  }

  return {
    ...data.props,
    contentfulEvents: cache.response,
  };
}
