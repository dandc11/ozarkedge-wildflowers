// Relocated from tests/utils/sanity-mocks.js
// Provides mock Sanity data & helper to mock sanityFetch for test scenarios.

// Mock data that matches your actual Sanity schema
const mockNativePlantData = {
  _createdAt: '2024-07-30T17:53:16Z',
  _id: 'c20ec0e4-9fc8-4e69-b628-6ebd3d9e6fe4',
  _originalId: 'c20ec0e4-9fc8-4e69-b628-6ebd3d9e6fe4',
  _rev: '15P9CW5wFj6EjTbHmbh942',
  _type: 'nativePlant',
  _updatedAt: '2025-02-02T18:10:25Z',
  bannerImage: {
    _type: 'mainImage',
    alt: 'Blue flowers of Salvia azurea with American Bumble Bee',
    asset: {
      _ref: 'image-03ce97c456ce90f428a2cdb4ea8f00057dd614a7-5184x2592-jpg',
      _type: 'reference',
    },
  },
  bloomText: [
    {
      _key: '8933c8b97d2b',
      _type: 'block',
      children: [
        {
          _key: '9deac4825201',
          _type: 'span',
          marks: [],
          text: 'Bloom text test. ',
        },
      ],
      markDefs: [],
      style: 'normal',
    },
    {
      _key: 'd2bc3630ce22',
      _type: 'imageCollection',
      imageCollection: [
        {
          _key: '914dffa04cd4',
          _type: 'figure',
          alt: 'Blue flowers',
          asset: {
            _ref: 'image-2f964b7cb35bf509dec76ee5b861080729488c64-1024x768-jpg',
            _type: 'reference',
          },
          caption: 'Blue flowers',
          captionPosition: 'below',
          showCaption: true,
        },
        {
          _key: '1433c45b62e5',
          _type: 'figure',
          alt: 'White flowers',
          asset: {
            _ref: 'image-1e0f76b99d2a36af57d2d32a9160aebaa653aa00-1024x768-jpg',
            _type: 'reference',
          },
          caption: 'White flowers',
          captionPosition: 'below',
          showCaption: true,
        },
      ],
    },
    {
      _key: '5f58750f14a8',
      _type: 'block',
      children: [
        {
          _key: '437936d78b60',
          _type: 'span',
          marks: [],
          text: 'Flowers occur in whorls (actually verticillasters) along the stem with each whorl containing many buds. The whorls may not be obvious at first glance because only 1-3 of the many buds are usually blooming at once. Salvia azurea has a long flowering period which may extend from late July through September and into October. ',
        },
      ],
      markDefs: [],
      style: 'normal',
    },
  ],
  conservationRanking: 'apparentlySecure',
  conservationStatus: [
    {
      _key: 'f0b703d7725e',
      _type: 'block',
      children: [
        {
          _key: '1857c1c4ea93',
          _type: 'span',
          marks: ['em'],
          text: 'Conservation',
        },
        {
          _key: '895a80a28815',
          _type: 'span',
          marks: [],
          text: ' test text',
        },
      ],
      markDefs: [],
      style: 'normal',
    },
  ],
  description: [
    {
      _key: '429de8dd4cbf',
      _type: 'block',
      children: [
        {
          _key: '2a2137f7740c',
          _type: 'span',
          marks: [],
          text: 'Description test text.',
        },
      ],
      markDefs: [],
      style: 'normal',
    },
  ],
  flowerColor: ['blue'],
  floweringMonths: [7, 8, 9, 10],
  floweringSeason: 'summer',
  growingNearbyPlantList: [
    {
      _key: '9ec120c14d4f',
      _type: 'figure',
      alt: 'Glandularia canadensis',
      asset: {
        _ref: 'image-8384022e58e5a109f33501f701b7c05bf94501d1-3264x2448-jpg',
        _type: 'reference',
      },
      caption: 'Glandularia canadensis',
      captionPosition: 'below',
      link: {
        _type: 'link',
        internalLink: {
          _ref: '8792d931-910c-4424-b1f5-9bc65c30b048',
          _type: 'reference',
        },
      },
      showCaption: true,
    },
    {
      _key: '68d7f7768a94',
      _type: 'figure',
      alt: 'Echinacea simulata',
      asset: {
        _ref: 'image-ef7472fb28ed310b182f63d954b315871d3ea4ed-3413x2560-jpg',
        _type: 'reference',
      },
      caption: 'Echinacea simulata',
      captionPosition: 'below',
      showCaption: true,
    },
  ],
  growingNearbyText: [
    {
      _key: '8ee6ff031f86',
      _type: 'block',
      children: [
        {
          _key: 'c724fc09515f',
          _type: 'span',
          marks: [],
          text: 'Growing nearby test text',
        },
      ],
      markDefs: [],
      style: 'normal',
    },
    {
      _key: 'd86e8e6c3949',
      _type: 'imageCollection',
      imageCollection: [
        {
          _key: '2155c280a448',
          _type: 'figure',
          alt: 'Liatris, Goldenrod, Salvia',
          asset: {
            _ref: 'image-f71324321fd3bec95aee16ceb9ba372015e5fbb7-1024x768-jpg',
            _type: 'reference',
          },
          caption: 'Liatris, Goldenrod, Salvia',
          captionPosition: 'below',
          showCaption: true,
        },
        {
          _key: '974e2695cb21',
          _type: 'figure',
          alt: 'Rudbeckia, Palafoxia, Salvia',
          asset: {
            _ref: 'image-93695d9aaf340825e64118440e62173b47b4f73b-1024x768-jpg',
            _type: 'reference',
          },
          caption: 'Rudbeckia, Palafoxia, Salvia',
          captionPosition: 'below',
          showCaption: true,
        },
      ],
    },
  ],
  habitat: [
    {
      _key: 'd082fb9e9a25',
      _type: 'block',
      children: [
        {
          _key: 'b4f322eb2770',
          _type: 'span',
          marks: [],
          text: 'Habitat test text',
        },
      ],
      markDefs: [],
      style: 'normal',
    },
  ],
  habitatType: ['Glade', 'Grassland/Prairie', 'Savannah'],
  lede: [
    {
      _key: 'c2b16ced631a',
      _type: 'block',
      children: [
        {
          _key: '6a519d361fe3',
          _type: 'span',
          marks: [],
          text: 'Lede test text',
        },
      ],
      markDefs: [],
      style: 'normal',
    },
  ],
  menuButtonColor: 'dark',
  metaDescription: 'metaDescription test text',
  plantIdentificationTags: [
    'Blue flowers',
    'Bee plant',
    'Sky Blue flowers',
    'Native wildflower',
    'Attracts Bumble bees',
    'Blue Wildflower',
  ],
  plantName: {
    _type: 'plantName',
    botanicalName: 'Salvia azurea var. grandiflora',
    commonName: 'Blue sage',
    nameInformation: [
      {
        _key: 'f4df990c3386',
        _type: 'block',
        children: [
          {
            _key: 'd0bf4822ac0d',
            _type: 'span',
            marks: [],
            text: 'Plant name test text',
          },
        ],
        markDefs: [],
        style: 'normal',
      },
    ],
  },
  pollinators: [
    {
      _key: '7473fd626b66',
      _type: 'block',
      children: [
        {
          _key: 'c5bb96681c7e',
          _type: 'span',
          marks: [],
          text: 'Pollinators test text',
        },
      ],
      markDefs: [],
      style: 'normal',
    },
    {
      _key: 'bd450ef82020',
      _type: 'imageCollection',
      imageCollection: [
        {
          _key: 'd9e71d732761',
          _type: 'figure',
          alt: 'Female American Bumblebee ',
          asset: {
            _ref: 'image-38fd188aea5476e60e28f4d44b108ae5bd80d3e5-1024x768-jpg',
            _type: 'reference',
          },
          caption: 'Female American Bumblebee',
          captionPosition: 'below',
          showCaption: true,
        },
        {
          _key: '1004d5e5ac68',
          _type: 'figure',
          alt: 'Male American Bumble Bee',
          asset: {
            _ref: 'image-4460432c83cba3edbeb050722eba5c6bf397b407-1024x768-jpg',
            _type: 'reference',
          },
          caption: 'Male American Bumble Bee',
          captionPosition: 'below',
          showCaption: true,
        },
      ],
    },
  ],
  previewImage: {
    _type: 'mainImage',
    alt: 'Blue flowers of Salvia azurea',
    asset: {
      _ref: 'image-d6ddac7f6346bf3ff51d5e03090c8089dce2e77b-1498x1998-jpg',
      _type: 'reference',
    },
  },
  slug: {
    _type: 'slug',
    current: 'blue-sage-salvia-azurea',
  },
  tidbits: [
    {
      _key: 'c5b88038bc54',
      _type: 'block',
      children: [
        {
          _key: '2ed2e7af5ab8',
          _type: 'span',
          marks: [],
          text: 'Tidbits test text.',
        },
      ],
      markDefs: [],
      style: 'normal',
    },
  ],
}

const mockSeasonData = {
  _createdAt: '2022-12-26T18:39:46Z',
  _id: '42135e73-e02b-4296-8eea-3695cd2d5dfa',
  _originalId: 'drafts.42135e73-e02b-4296-8eea-3695cd2d5dfa',
  _rev: '0d29e14b-0ee9-4129-ab1e-72f7bf12b8d4',
  _type: 'season',
  _updatedAt: '2025-05-25T21:34:09Z',
  description: [
    {
      _key: '4b81d1687e16',
      _type: 'block',
      children: [
        {
          _key: '4f351a958cba0',
          _type: 'span',
          marks: [],
          text: 'Testing description text.',
        },
      ],
      markDefs: [],
      style: 'normal',
    },
    {
      _key: '450c43c736f4',
      _type: 'imageCollection',
      imageCollection: [
        {
          _key: 'a1e1c05ab2ca',
          _type: 'figure',
          alt: 'Bloodroot (Sanguinaria canadensis) ',
          asset: {
            _ref: 'image-c181c14b93e82ba60332519467bb078061e5953f-1024x768-jpg',
            _type: 'reference',
          },
          caption: 'Bloodroot (Sanguinaria canadensis) ',
          captionPosition: 'below',
          link: {
            _type: 'link',
            internalLink: {
              _ref: '0b9b7181-02e0-47fe-be20-1d0b75f5ff7d',
              _type: 'reference',
            },
          },
          showCaption: true,
        },
        {
          _key: 'fdeefd58395a',
          _type: 'figure',
          alt: 'Trout lily  (Erythronium albidum)',
          asset: {
            _ref: 'image-248472f9d8011454502d45fe0536551294274f3c-1024x768-jpg',
            _type: 'reference',
          },
          caption: 'Trout lily (Erythronium albidum)',
          captionPosition: 'below',
          link: {
            _type: 'link',
            internalLink: {
              _ref: '2c9890d9-849e-4cc8-b7f5-d5d989322718',
              _type: 'reference',
            },
          },
          showCaption: true,
        },
        {
          _key: '2fc103b0db9b',
          _type: 'figure',
          alt: "Dutchman's breeches (Dicentra cucullaria)",
          asset: {
            _ref: 'image-a13dc91152a7021990e2098562f8904d2afef19d-1024x768-jpg',
            _type: 'reference',
          },
          caption: "Dutchman's breeches (Dicentra cucullaria)",
          captionPosition: 'below',
          link: {
            _type: 'link',
            internalLink: {
              _ref: '895c4c4c-4932-48d5-ad6f-544f99e09982',
              _type: 'reference',
            },
          },
          showCaption: true,
        },
      ],
    },
  ],
  feature: {
    _type: 'feature',
    bodyText: [
      {
        _key: '650474be2324',
        _type: 'block',
        children: [
          {
            _key: 'b733d7290506',
            _type: 'span',
            marks: [],
            text: 'Testing feature text.',
          },
        ],
        markDefs: [],
        style: 'normal',
      },
    ],
    buttonText: 'Feature button text.',
    featureTheme: 'spring',
    image: {
      _type: 'image',
      asset: {
        _ref: 'image-569a13db22749d58b4a09c378b9171a3f9f11556-2238x1399-jpg',
        _type: 'reference',
      },
    },
    link: {
      _ref: '456433a0-7450-45d5-898c-4dcc93b7b937',
      _type: 'reference',
    },
    pullImageFromLink: false,
    pullTextFromLink: false,
    titleText: 'Feature title text',
  },
  mainImage: {
    _type: 'figure',
    alt: 'Spring at Ozarkedge, Harbinger of Spring wildflower blooming',
    asset: {
      _ref: 'image-dad1a66744c6b00947dec87021b460f153902e41-4381x2465-jpg',
      _type: 'reference',
    },
    caption: 'Spring at Ozarkedge',
  },
  metaDescription: 'Season metaDescription text',
  monthNumbers: [3, 4, 5],
  seasonName: 'spring',
  slug: {
    _type: 'slug',
    current: 'spring',
  },
}

const mockLandingPageData = {
  _id: 'mock-landing',
  _type: 'landingPage',
  titleText: 'Ozarkedge Wildflowers',
  subtitleText: 'Discover native plants of the Missouri Ozarks',
  slug: { current: 'home' },
  menuButtonColor: 'light',
  mainImage: {
    _type: 'image',
    asset: { _ref: 'image-789', _type: 'reference' },
    alt: 'Ozarkedge property view',
    lqip: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
    palette: { dominant: { background: '#6B8E23', foreground: '#fff' } },
  },
  buttonOne: {
    buttonLabel: 'Explore Plants',
    slug: 'native-plants',
    docType: 'plantListPage',
  },
  buttonTwo: {
    buttonLabel: 'About Us',
    slug: 'about',
    docType: 'aboutPage',
  },
}

const mockAboutPageData = {
  _id: 'mock-about',
  _type: 'aboutPage',
  title: 'About Ozarkedge',
  slug: { current: 'about' },
  menuButtonColor: 'dark',
  mainImage: {
    _type: 'image',
    asset: { _ref: 'image-101', _type: 'reference' },
    alt: 'About Ozarkedge',
    lqip: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
    palette: { dominant: { background: '#8B4513', foreground: '#fff' } },
  },
  body: [
    {
      _type: 'block',
      children: [{ _type: 'span', text: 'Learn about our conservation efforts.' }],
    },
  ],
}

// Mock responses for different scenarios
const mockResponses = {
  plants: {
    data: [
      mockNativePlantData,
      {
        ...mockNativePlantData,
        _id: 'mock-plant-2',
        plantName: { commonName: 'Purple Coneflower', botanicalName: 'Echinacea purpurea' },
      },
    ],
  },
  'single-plant': { data: [mockNativePlantData] },
  seasons: { data: [mockSeasonData] },
  landing: { data: [mockLandingPageData] },
  about: { data: [mockAboutPageData] },
  empty: { data: [] },
  loading: null,
  error: new Error('Mock Sanity error'),
}

// Mock the sanityFetch function
export const mockSanityFetch = jest.fn()

// Setup function to configure default mocks
export function setupSanityMocks(scenario = 'plants') {
  // Reset all mocks
  jest.clearAllMocks()

  // Mock the sanityFetch function from your sanity.live.js
  jest.doMock('../../sanity/lib/sanity.live', () => ({
    sanityFetch: mockSanityFetch,
    SanityLive: () => null,
  }))

  // Set default response based on scenario
  if (scenario === 'error') {
    mockSanityFetch.mockRejectedValue(mockResponses.error)
  } else if (scenario === 'loading') {
    mockSanityFetch.mockResolvedValue(mockResponses.loading)
  } else {
    mockSanityFetch.mockResolvedValue(mockResponses[scenario] || mockResponses.plants)
  }
}

// Export mock data for direct use in tests
export {
  mockNativePlantData,
  mockSeasonData,
  mockLandingPageData,
  mockAboutPageData,
  mockResponses,
}
