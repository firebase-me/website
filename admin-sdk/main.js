import * as Analytics from './analytics.js';
import * as Auth from './auth.js';
import * as RemoteConfig from './config.js';
import * as CloudMessaging from './fcm.js';
import * as Firestore from './firestore.js';
import * as Functions from './functions.js';
import * as Hosting from './hosting.js';
import * as Monitoring from './monitoring.js';
import * as Realtime from './realtime.js';
import * as Storage from './storage.js';

const wrapWithIdToken = (idToken, module) => {
  return new Proxy(module, {
    get(target, prop) {
      if (typeof target[prop] === 'function') {
        return (...args) => {
          if (!idToken) {
            throw new Error("Missing ID token");
          }
          return target[prop](idToken, ...args);
        };
      }
      return target[prop];
    }
  });
};

async function initializeAdmin(serviceAccount) {
  let idToken = null;
  try {
    idToken = await Auth.signInWithCustomToken(serviceAccount.customToken);
    console.log('Service account initialized with ID token');
  } catch (error) {
    console.error('Failed to initialize service account:', error);
    throw error;
  }

  return {
    Auth: wrapWithIdToken(idToken, Auth),
    Firestore: wrapWithIdToken(idToken, Firestore),
    Realtime: wrapWithIdToken(idToken, Realtime),
    Storage: wrapWithIdToken(idToken, Storage),
    Hosting: wrapWithIdToken(idToken, Hosting),
    Functions: wrapWithIdToken(idToken, Functions),
    Analytics: wrapWithIdToken(idToken, Analytics),
    RemoteConfig: wrapWithIdToken(idToken, RemoteConfig),
    CloudMessaging: wrapWithIdToken(idToken, CloudMessaging),
    PerformanceMonitoring: wrapWithIdToken(idToken, Monitoring)
  };
}

export { initializeAdmin };
