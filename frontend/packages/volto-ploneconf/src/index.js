// Blocks
import SponsorsEdit from './components/Blocks/Sponsors/Edit';
import SponsorsView from './components/Blocks/Sponsors/View';
import SponsorLevelEdit from './components/Blocks/SponsorLevel/Edit';
import SponsorLevelView from './components/Blocks/SponsorLevel/View';
import { sponsorLevelRestrict } from './components/Blocks/SponsorLevel/utils';
/// Listing block variations
import ProfilesTemplate from './components/Blocks/Listing/ProfilesGridTemplate';

// Teaser
import TeaserDefaultTemplate from '@plone/volto/components/manage/Blocks/Teaser/DefaultBody';
import TeaserFeatured from './components/Blocks/Teaser/TeaserFeatured';
import TeaserColoredCTA from './components/Blocks/Teaser/TeaserColoredCTA';
import { ColoredCTAEnhancer } from './components/Blocks/Teaser/coloredCTAschema';

// Slider
import SliderBody from '@kitconcept/volto-light-theme/components/Blocks/Slider/DefaultBody.jsx';
import SliderBodyFull from './components/Blocks/Slider/SliderFull';

// Views
import PersonView from './components/View/Person';
import SponsorView from './components/View/Sponsor';

// Icons
import listBulletSVG from '@plone/volto/icons/list-bullet.svg';

// Reducers
import reducers from './reducers';

const BG_COLORS = [
  { name: 'transparent', label: 'Transparent' },
  { name: 'grey', label: 'Grey' },
  { name: 'mainColor', label: 'Main Theme Color' },
];

const applyConfig = (config) => {
  config.settings = {
    ...config.settings,
    isMultilingual: true,
    supportedLanguages: ['en', 'pt-br'],
    defaultLanguage: 'en',
    navDepth: 3,
    image_crop_aspect_ratios: [
      {
        label: '16:9',
        ratio: 16 / 9,
      },
      {
        label: '4:3',
        ratio: 4 / 3,
      },
      {
        label: '1:1',
        ratio: 1,
      },
    ],
    pictureOptions: {
      grid: [
        { media: '(min-width: 768px)', image: 'teaser' },
        { media: '(max-width: 767px)', image: 'large' },
      ],
      mainimage: [
        { media: '(min-width: 768px)', image: 'huge' },
        { media: '(max-width: 767px)', image: 'large' },
      ],
      teaser2columns: [
        { media: '(min-width: 768px)', image: 'larger' },
        { media: '(max-width: 767px)', image: 'large' },
      ],
      newsitem: [
        { media: '(min-width: 1200px)', image: 'larger' },
        { media: '(min-width: 992px) and (max-width: 1199px)', image: 'large' },
        { media: '(max-width: 991px)', image: 'teaser' },
      ],
    },
  };
  config.addonReducers = { ...config.addonReducers, ...reducers };
  config.views.contentTypesViews = {
    ...config.views.contentTypesViews,
    Person: PersonView,
    Sponsor: SponsorView,
  };

  // Teaser Variations
  const teaserVariations = [
    {
      id: 'default',
      isDefault: true,
      title: 'Default',
      template: TeaserDefaultTemplate,
    },
    {
      id: 'featured',
      isDefault: false,
      title: 'Featured',
      template: TeaserFeatured,
    },
    {
      id: 'coloredCTA',
      isDefault: false,
      title: 'Colored CTA',
      template: TeaserColoredCTA,
      schemaEnhancer: ColoredCTAEnhancer,
    },
  ];
  config.blocks.blocksConfig.teaser = {
    ...config.blocks.blocksConfig.teaser,
    variations: teaserVariations,
  };
  config.blocks.blocksConfig.slider = {
    ...config.blocks.blocksConfig.slider,
    variations: [
      {
        id: 'default',
        isDefault: true,
        title: 'Default',
        view: SliderBody,
      },
      {
        id: 'full-width',
        isDefault: false,
        title: 'Full',
        view: SliderBodyFull,
      },
    ],
    enableAutoPlay: true,
  };

  // Listing Variations
  config.blocks.blocksConfig.listing.variations = [
    ...config.blocks.blocksConfig.listing.variations,
    {
      id: 'profiles',
      title: 'Person Profiles',
      template: ProfilesTemplate,
    },
  ];

  const blocksWithBgColor = ['accordion', 'slateTable', 'listing', 'gridBlock'];
  blocksWithBgColor.forEach((blockId) => {
    const hasColor = config.blocks.blocksConfig?.[blockId]?.colors;
    if (hasColor !== undefined) {
      config.blocks.blocksConfig[blockId].colors = BG_COLORS;
    }
  });

  config.blocks.blocksConfig.sponsorsList = {
    id: 'sponsorsList',
    title: 'Sponsors',
    icon: listBulletSVG,
    group: 'common',
    view: SponsorsEdit,
    edit: SponsorsView,
    restricted: false,
    mostUsed: false,
    sidebarTab: 0,
    security: {
      addPermission: [],
      view: [],
    },
  };
  config.blocks.blocksConfig.sponsorLevel = {
    id: 'sponsorLevel',
    title: 'Sponsor Level',
    icon: listBulletSVG,
    group: 'common',
    view: SponsorLevelView,
    edit: SponsorLevelEdit,
    restricted: sponsorLevelRestrict,
    mostUsed: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };
  config.blocks.blocksConfig.accordion = {
    ...config.blocks.blocksConfig.accordion,
    blocksConfig: {
      ...config.blocks.blocksConfig,
    },
    allowedBlocks: [
      ...config.blocks.blocksConfig.accordion.allowedBlocks,
      '__button',
      'sponsorLevel',
    ],
  };
  config.blocks.blocksConfig.gridBlock = {
    ...config.blocks.blocksConfig.gridBlock,
    blocksConfig: {
      ...config.blocks.blocksConfig,
    },
    allowedBlocks: [
      ...config.blocks.blocksConfig.gridBlock.allowedBlocks,
      '__button',
    ],
  };
  return config;
};

export default applyConfig;
