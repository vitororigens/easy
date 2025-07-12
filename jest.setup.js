import '@testing-library/jest-native/extend-expect';

// Mock do AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock do Firebase
jest.mock('@react-native-firebase/app', () => ({
  app: jest.fn(),
  initializeApp: jest.fn(),
}));

jest.mock('@react-native-firebase/auth', () => ({
  auth: jest.fn(() => ({
    currentUser: {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
    },
    onAuthStateChanged: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
  })),
}));

jest.mock('@react-native-firebase/firestore', () => ({
  firestore: jest.fn(() => ({
    collection: jest.fn(),
    doc: jest.fn(),
    addDoc: jest.fn(),
    updateDoc: jest.fn(),
    deleteDoc: jest.fn(),
    getDoc: jest.fn(),
    getDocs: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    onSnapshot: jest.fn(),
    Timestamp: {
      now: jest.fn(() => ({ seconds: 1234567890, nanoseconds: 0 })),
      fromDate: jest.fn(),
    },
  })),
}));

// Mock do OneSignal
jest.mock('react-native-onesignal', () => ({
  OneSignal: {
    initialize: jest.fn(),
    Notifications: {
      requestPermission: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    User: {
      pushSubscription: {
        getIdAsync: jest.fn(),
      },
      getOnesignalId: jest.fn(),
    },
    Debug: {
      setLogLevel: jest.fn(),
    },
  },
}));

// Mock do React Navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

// Mock do Styled Components
jest.mock('styled-components/native', () => {
  const styled = require('styled-components/native');
  return styled;
});

// Mock do Toast
jest.mock('react-native-toast-notifications', () => ({
  Toast: {
    show: jest.fn(),
  },
}));

// Mock do MMKV
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    delete: jest.fn(),
  })),
}));

// Mock do Google Mobile Ads
jest.mock('react-native-google-mobile-ads', () => ({
  default: jest.fn(() => Promise.resolve()),
  BannerAd: 'BannerAd',
  BannerAdSize: {
    BANNER: 'BANNER',
  },
  TestIds: {
    BANNER: 'ca-app-pub-3940256099942544/6300978111',
  },
}));

// Mock do Image Picker
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));

// Mock do Linear Gradient
jest.mock('expo-linear-gradient', () => 'LinearGradient');

// Mock do Status Bar
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

// Mock do System UI
jest.mock('expo-system-ui', () => ({
  setBackgroundColorAsync: jest.fn(),
}));

// Mock do Updates
jest.mock('expo-updates', () => ({
  checkForUpdateAsync: jest.fn(),
  fetchUpdateAsync: jest.fn(),
  reloadAsync: jest.fn(),
}));

// Mock do Constants
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      extra: {
        eas: {
          projectId: 'test-project-id',
        },
      },
    },
  },
}));

// Mock do Linking
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(),
}));

// Mock do Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Mock do Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn((obj) => obj.ios),
}));

// Mock do Dimensions
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn(() => ({
    width: 375,
    height: 812,
  })),
}));

// Mock do Keyboard
jest.mock('react-native/Libraries/Components/Keyboard/Keyboard', () => ({
  dismiss: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
}));

// Mock do Animated
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock do PanGestureHandler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    PanGestureHandler: View,
    State: {},
    Directions: {},
  };
});

// Mock do Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Configuração global para testes
global.console = {
  ...console,
  // Uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  error: jest.fn(),
};

// Mock do fetch
global.fetch = jest.fn();

// Mock do XMLHttpRequest
global.XMLHttpRequest = jest.fn(() => ({
  open: jest.fn(),
  send: jest.fn(),
  setRequestHeader: jest.fn(),
  readyState: 4,
  status: 200,
  responseText: '{}',
}));

// Mock do FormData
global.FormData = jest.fn(() => ({
  append: jest.fn(),
}));

// Mock do FileReader
global.FileReader = jest.fn(() => ({
  readAsDataURL: jest.fn(),
  onload: null,
  result: 'data:image/jpeg;base64,test',
}));

// Mock do URL
global.URL = {
  createObjectURL: jest.fn(() => 'blob:test'),
  revokeObjectURL: jest.fn(),
};

// Mock do Blob
global.Blob = jest.fn(() => ({
  size: 0,
  type: 'image/jpeg',
}));

// Mock do File
global.File = jest.fn(() => ({
  name: 'test.jpg',
  size: 0,
  type: 'image/jpeg',
}));

// Mock do Image
global.Image = jest.fn(() => ({
  src: '',
  onload: null,
  onerror: null,
}));

// Mock do Canvas
global.Canvas = jest.fn(() => ({
  getContext: jest.fn(() => ({
    drawImage: jest.fn(),
    toDataURL: jest.fn(() => 'data:image/jpeg;base64,test'),
  })),
}));

// Mock do WebGL
global.WebGLRenderingContext = jest.fn();

// Mock do requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 0));

// Mock do cancelAnimationFrame
global.cancelAnimationFrame = jest.fn();

// Mock do performance
global.performance = {
  now: jest.fn(() => Date.now()),
};

// Mock do crypto
global.crypto = {
  getRandomValues: jest.fn((array) => {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  }),
};

// Mock do TextEncoder
global.TextEncoder = jest.fn(() => ({
  encode: jest.fn(() => new Uint8Array()),
}));

// Mock do TextDecoder
global.TextDecoder = jest.fn(() => ({
  decode: jest.fn(() => ''),
}));

// Mock do AbortController
global.AbortController = jest.fn(() => ({
  signal: {},
  abort: jest.fn(),
}));

// Mock do AbortSignal
global.AbortSignal = jest.fn(() => ({
  aborted: false,
}));

// Mock do ResizeObserver
global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock do IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock do MutationObserver
global.MutationObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock do PerformanceObserver
global.PerformanceObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock do ReportingObserver
global.ReportingObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock do queueMicrotask
global.queueMicrotask = jest.fn((callback) => {
  Promise.resolve().then(callback);
});

// Mock do structuredClone
global.structuredClone = jest.fn((obj) => JSON.parse(JSON.stringify(obj)));

// Mock do queueMicrotask
global.queueMicrotask = jest.fn((callback) => {
  Promise.resolve().then(callback);
});

// Mock do clearImmediate
global.clearImmediate = jest.fn();

// Mock do setImmediate
global.setImmediate = jest.fn((callback) => setTimeout(callback, 0));

// Mock do clearTimeout
global.clearTimeout = jest.fn();

// Mock do setTimeout
global.setTimeout = jest.fn((callback, delay) => {
  const id = Math.random();
  setTimeout(() => callback(), delay || 0);
  return id;
});

// Mock do clearInterval
global.clearInterval = jest.fn();

// Mock do setInterval
global.setInterval = jest.fn((callback, delay) => {
  const id = Math.random();
  setInterval(() => callback(), delay || 0);
  return id;
});

// Mock do Date
const OriginalDate = global.Date;
global.Date = class extends OriginalDate {
  constructor(...args) {
    if (args.length === 0) {
      return new OriginalDate('2024-01-01T00:00:00.000Z');
    }
    return new OriginalDate(...args);
  }
  
  static now() {
    return new OriginalDate('2024-01-01T00:00:00.000Z').getTime();
  }
};

// Mock do Math.random para testes determinísticos
const originalRandom = Math.random;
Math.random = jest.fn(() => 0.5);

// Restaurar Math.random após cada teste
afterEach(() => {
  Math.random = originalRandom;
});

// Configuração para limpar mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
});

// Configuração para limpar todos os mocks após todos os testes
afterAll(() => {
  jest.restoreAllMocks();
}); 