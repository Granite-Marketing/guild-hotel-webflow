// Which staging page or CMS item each content doc writes to. Config, not logic: a new doc needs a line here.
const MEETING_CARDS = [{ collection: 'meeting-venues', field: 'card---intro' }]
const DINING_TEMPLATE = '/dining/dining-zuma'
const diningVenue = (itemName) => ({ type: 'cms-plan', plan: 'dining-venue', collection: 'dining', itemName, templatePage: DINING_TEMPLATE })

export const REGISTRY = {
  'Guild-Homepage': { type: 'page', path: '/', cards: [{ collection: 'dining', field: 'home-card-tagline' }] },
  'Guild-Arts': { type: 'page', path: '/arts' },
  'Guild-BlogCollection': { type: 'page', path: '/blog' },
  'Guild-Dining-Collection': { type: 'page', path: '/dining' },
  'Guild-Gallery': { type: 'page', path: '/gallery' },
  'Guild-HappeningsCollection': { type: 'page', path: '/happenings' },
  'Guild-History': { type: 'page', path: '/history', foldRepeatedBlocks: true },
  'Guild-Neighborhood': { type: 'page', path: '/neighborhood', cards: [{ collection: 'beyond-downtown-places', field: 'pop-up---text' }] },
  'Guild-Press': { type: 'page', path: '/press' },
  'Guild-Rooms-Collection': { type: 'page', path: '/rooms' },
  'Guild-Wellness-Collection': { type: 'page', path: '/wellness' },
  'Guild-Meeting-Collection': { type: 'page', path: '/meetings', cards: MEETING_CARDS },
  'Guild-Meetings-Modals': {
    type: 'cms-plan', plan: 'meeting-modals', collection: 'meeting-venues', page: '/meetings',
    venues: ['Council Boardroom', 'Lobby Bar', 'Garden Terrace', '1 America Plaza', 'Small Conference Center', 'Large Conference Center'],
  },
  'Guild-Dining-Zuma': diningVenue('Zuma San Diego'),
  'Guild-Dining-LobbyBar': diningVenue('Lobby Bar'),
  'Guild-Dining-PoolLounge': diningVenue('Pool Lounge'),
  'Guild-Dining-GardenTerrace': diningVenue('Garden Terrace'),
  'Guild-Rooms-SubPages': { type: 'rooms', collection: 'rooms', templatePage: '/rooms/cozy-queen' },
  'Guild-Corporate': { type: 'cms-plan', plan: 'legal-corporate', collection: 'legal-corporate', itemName: 'Corporate', templatePage: '/legal-corporate/corporate', cards: MEETING_CARDS },
  'Guild-Legal': { type: 'cms-plan', plan: 'legal-corporate', collection: 'legal-corporate', itemName: 'Legal', templatePage: '/legal-corporate/corporate', cards: MEETING_CARDS },
}
