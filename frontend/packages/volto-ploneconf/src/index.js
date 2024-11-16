// Blocks
import SponsorsEdit from './components/Blocks/Sponsors/Edit';
import SponsorsView from './components/Blocks/Sponsors/View';
import SponsorLevelEdit from './components/Blocks/SponsorLevel/Edit';
import SponsorLevelView from './components/Blocks/SponsorLevel/View';
import { sponsorLevelRestrict } from './components/Blocks/SponsorLevel/utils';

// Schedule
import ScheduleEdit from './components/Blocks/Schedule/Edit';
import ScheduleView from './components/Blocks/Schedule/View';

/// Listing block variations
import ProfilesTemplate from './components/Blocks/Listing/ProfilesGridTemplate';
import SimpleGridTemplate from './components/Blocks/Listing/SimpleGridTemplate';

/// GridItemTemplate
import AttendeeGridItemTemplate from './components/Blocks/Grid/AttendeeGridItemTemplate';
import SessionGridItemTemplate from './components/Blocks/Grid/SessionGridItemTemplate';

// Teaser
import TeaserDefaultTemplate from '@plone/volto/components/manage/Blocks/Teaser/DefaultBody';
import TeaserFeatured from './components/Blocks/Teaser/TeaserFeatured';
import TeaserColoredCTA from './components/Blocks/Teaser/TeaserColoredCTA';
import { ColoredCTAEnhancer } from './components/Blocks/Teaser/coloredCTAschema';

// Slider
import SliderBody from '@kitconcept/volto-light-theme/components/Blocks/Slider/DefaultBody.jsx';
import SliderBodyFull from './components/Blocks/Slider/SliderFull';

// Views
import AttendeeView from './components/View/Attendee';
import AttendeesView from './components/View/Attendees';
import PersonView from './components/View/Person';
import SponsorView from './components/View/Sponsor';
import SessionView from './components/View/SessionView';
import SlotView from './components/View/SlotView';
import TrainingView from './components/View/TrainingView';

import MySchedule from './components/View/MySchedule';

// Icons
import listBulletSVG from '@plone/volto/icons/list-bullet.svg';

// Reducers
import reducers from './reducers';

// Login
import Login from '@plone/volto/components/theme/Login/Login';
import AuthomaticLogin from '@plone-collective/volto-authomatic/components/Login/Login';

// Registrations
import RegistrationsManagement from './components/Registrations/RegistrationsManagement';

// Pluggables
import PlugAttendeesManagement from './components/Toolbar/PlugAttendeesManagement';
import PlugChangePassword from './components/Toolbar/PlugChangePassword';
import PlugMySchedule from './components/Toolbar/PlugMySchedule';
import PlugRegistrations from './components/Toolbar/PlugRegistrations';
import PlugRegistrationsManagement from './components/Toolbar/PlugRegistrationsManagement';

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
    nonContentRoutes: [
      ...config.settings.nonContentRoutes,
      '/registrations',
      '/mySchedule',
    ],
    appExtras: [
      ...config.settings.appExtras,
      {
        match: '/',
        component: PlugChangePassword,
      },
      {
        match: '/',
        component: PlugAttendeesManagement,
      },
      {
        match: '/',
        component: PlugRegistrationsManagement,
      },
      {
        match: '/',
        component: PlugRegistrations,
      },
      {
        match: '/',
        component: PlugMySchedule,
      },
    ],
    externalRoutes: [
      ...config.settings.nonContentRoutes,
      {
        match: {
          path: '**/@@ical_view',
          exact: false,
          strict: false,
        },
        url(payload) {
          return payload.location.pathname;
        },
      },
    ],
  };
  config.addonReducers = { ...config.addonReducers, ...reducers };
  config.views.contentTypesViews = {
    ...config.views.contentTypesViews,
    Attendee: AttendeeView,
    OnlineAttendee: AttendeeView,
    Attendees: AttendeesView,
    Break: SlotView,
    Keynote: SessionView,
    LightningTalks: SlotView,
    Meeting: SlotView,
    OpenSpace: SlotView,
    Person: PersonView,
    Sponsor: SponsorView,
    Talk: SessionView,
    Training: TrainingView,
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
      id: 'simple grid',
      title: 'Simple Grid',
      template: SimpleGridTemplate,
    },
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

  //GridItemTemplates
  config.registerComponent({
    name: 'GridListingItemTemplate',
    component: SessionGridItemTemplate,
    dependencies: 'Training',
  });
  config.registerComponent({
    name: 'GridListingItemTemplate',
    component: SessionGridItemTemplate,
    dependencies: 'Talk',
  });
  config.registerComponent({
    name: 'GridListingItemTemplate',
    component: SessionGridItemTemplate,
    dependencies: 'Keynote',
  });
  config.registerComponent({
    name: 'GridListingItemTemplate',
    component: AttendeeGridItemTemplate,
    dependencies: 'Attendee',
  });
  config.registerComponent({
    name: 'GridListingItemTemplate',
    component: AttendeeGridItemTemplate,
    dependencies: 'OnlineAttendee',
  });

  config.blocks.blocksConfig.scheduleBlock = {
    id: 'scheduleBlock',
    title: 'Schedule',
    icon: listBulletSVG,
    group: 'common',
    view: ScheduleView,
    edit: ScheduleEdit,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };

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

  const addonRoutes = config.addonRoutes.filter(
    (route) => route.path !== '/login' && route.path !== '/**/login',
  );
  addonRoutes.push(
    { path: '/**/login-admin', component: AuthomaticLogin },
    { path: '/login-admin', component: AuthomaticLogin },
    { path: '/login', component: Login },
    { path: '/myschedule', component: MySchedule },
    { path: '/en/myschedule', component: MySchedule },
    { path: '/pt-br/myschedule', component: MySchedule },
    { path: '/**/login', component: Login },
    { path: '/registrations', component: RegistrationsManagement },
    { path: '/**/registrations', component: RegistrationsManagement },
  );
  config.addonRoutes = addonRoutes;
  return config;
};

export default applyConfig;
