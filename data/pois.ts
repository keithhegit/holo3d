import { POI } from '../types';

/**
 * Points of Interest data
 * Updated with 20 Event locations and specific URLs
 */
export const POIS: POI[] = [
    // Provided Links (15 links)
    {
        id: 'event-1',
        label: 'Event 01',
        lat: 39.9042, // Beijing
        lon: 116.4074,
        url: 'https://marble.worldlabs.ai/world/f2dac2f8-aef5-4211-be73-364ebf648a1e',
        description: 'Marble World 01'
    },
    {
        id: 'event-2',
        label: 'Event 02',
        lat: 40.7128, // New York
        lon: -74.0060,
        url: 'https://marble.worldlabs.ai/world/be08c79c-bf7e-4abc-a0d7-7c225090a023',
        description: 'Marble World 02'
    },
    {
        id: 'event-3',
        label: 'Event 03',
        lat: 51.5074, // London
        lon: -0.1278,
        url: 'https://marble.worldlabs.ai/world/d344be6f-5038-419d-90ae-740424ce1638',
        description: 'Marble World 03'
    },
    {
        id: 'event-4',
        label: 'Event 04',
        lat: 35.6762, // Tokyo
        lon: 139.6503,
        url: 'https://marble.worldlabs.ai/world/f22e5c35-1cc3-49fc-a468-607e36e0d552',
        description: 'Marble World 04'
    },
    {
        id: 'event-5',
        label: 'Event 05',
        lat: 48.8566, // Paris
        lon: 2.3522,
        url: 'https://marble.worldlabs.ai/world/747043e0-06fd-4a67-852a-28e07109e45a',
        description: 'Marble World 05'
    },
    {
        id: 'event-6',
        label: 'Event 06',
        lat: -33.8688, // Sydney
        lon: 151.2093,
        url: 'https://marble.worldlabs.ai/world/e595ce32-4cb1-4f72-b633-ebfe0241f938',
        description: 'Marble World 06'
    },
    {
        id: 'event-7',
        label: 'Event 07',
        lat: -22.9068, // Rio
        lon: -43.1729,
        url: 'https://marble.worldlabs.ai/world/8465ca18-7ff4-428c-abfa-f2b92bb3cfe1',
        description: 'Marble World 07'
    },
    {
        id: 'event-8',
        label: 'Event 08',
        lat: 30.0444, // Cairo
        lon: 31.2357,
        url: 'https://marble.worldlabs.ai/world/37580ce7-4612-4332-9d05-26cc93c0249d',
        description: 'Marble World 08'
    },
    {
        id: 'event-9',
        label: 'Event 09',
        lat: 19.0760, // Mumbai
        lon: 72.8777,
        url: 'https://marble.worldlabs.ai/world/0d3946ee-9013-46c1-a8d9-2939c0449f1d',
        description: 'Marble World 09'
    },
    {
        id: 'event-10',
        label: 'Event 10',
        lat: 55.7558, // Moscow
        lon: 37.6173,
        url: 'https://marble.worldlabs.ai/world/d1fd21d9-e477-43ab-8d43-fc09af728c42',
        description: 'Marble World 10'
    },
    {
        id: 'event-11',
        label: 'Event 11',
        lat: 37.7749, // San Francisco
        lon: -122.4194,
        url: 'https://marble.worldlabs.ai/world/eb847b35-9ea1-4740-8fcd-63dc62ef9e6a',
        description: 'Marble World 11'
    },
    {
        id: 'event-12',
        label: 'Event 12',
        lat: 1.3521, // Singapore
        lon: 103.8198,
        url: 'https://dontstarve.keithhe.com/',
        description: 'Dont Starve'
    },
    {
        id: 'event-13',
        label: 'Event 13',
        lat: 25.2048, // Dubai
        lon: 55.2708,
        url: 'https://biubiu.keithhe.com/',
        description: 'Biubiu'
    },
    {
        id: 'event-14',
        label: 'Event 14',
        lat: 52.5200, // Berlin
        lon: 13.4050,
        url: 'https://comicbook.keithhe.com/',
        description: 'Comic Book'
    },
    {
        id: 'event-15',
        label: 'Event 15',
        lat: -34.6037, // Buenos Aires
        lon: -58.3816,
        url: 'https://07f8e1fc.og-valley.pages.dev/',
        description: 'OG Valley'
    },

    // Placeholder Links (Wikipedia) to reach 20
    {
        id: 'event-16',
        label: 'Event 16',
        lat: 64.1466, // Reykjavik
        lon: -21.9426,
        url: 'https://en.wikipedia.org/wiki/Reykjavik',
        description: 'Iceland Capital'
    },
    {
        id: 'event-17',
        label: 'Event 17',
        lat: -1.2921, // Nairobi
        lon: 36.8219,
        url: 'https://en.wikipedia.org/wiki/Nairobi',
        description: 'Kenya Capital'
    },
    {
        id: 'event-18',
        label: 'Event 18',
        lat: 41.0082, // Istanbul
        lon: 28.9784,
        url: 'https://en.wikipedia.org/wiki/Istanbul',
        description: 'Historic City'
    },
    {
        id: 'event-19',
        label: 'Event 19',
        lat: 19.4326, // Mexico City
        lon: -99.1332,
        url: 'https://en.wikipedia.org/wiki/Mexico_City',
        description: 'Mexico Capital'
    },
    {
        id: 'event-20',
        label: 'Event 20',
        lat: -41.2865, // Wellington
        lon: 174.7762,
        url: 'https://en.wikipedia.org/wiki/Wellington',
        description: 'New Zealand Capital'
    }
];
