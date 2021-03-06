// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // site: 'http://library.gifkaro.com/gift/v1/',
  apiUrl: 'https://api.gifkaro.com/gift/v2/',
  siteRootUrl: 'http://gifkaro.com/',
  defaultLanguage: 'english',
  defaultCategory: 'trends',
  sizeOfChunk: 20,
  pathNames : {
    embedImg: 'embed/img/',
    embedMp4: 'embed/mp4/',
    embedWebm: 'embed/webm/'
  },
  supportedLanguages: ['english', 'telugu', 'tamil', 'punjabi', 'marathi', 'malayalam',
                      'kannada', 'gujarati', 'bengali', 'hindi']
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
