// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyARDjderLTh9C3fub3TRD8bXIZUqL2wvvE",
    authDomain: "nikat-fiteness-tracker.firebaseapp.com",
    databaseURL: "https://nikat-fiteness-tracker.firebaseio.com",
    projectId: "nikat-fiteness-tracker",
    storageBucket: "nikat-fiteness-tracker.appspot.com",
    messagingSenderId: "196043335725"
  }
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
