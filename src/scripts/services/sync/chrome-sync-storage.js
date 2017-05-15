export function ChromeSyncStorage($q, $translate) {
  'ngInject';

  return {
    get: function() {
      return new $q((resolve, reject) => {
        chrome.storage.sync.get(null, function(data) {
          if (chrome.runtime.lastError) {
            const message = chrome.runtime.lastError.message;
            reject(new Error(message));
          } else {
            resolve(data);
          }
        });
      });
    },

    set: function(value) {
      // TODO: move key-splitting in here?
      return new $q((resolve, reject) => {
        chrome.storage.sync.set(value, () => {
          if (chrome.runtime.lastError) {
            const message = chrome.runtime.lastError.message;
            if (message.indexOf('QUOTA_BYTES_PER_ITEM') > -1) {
              reject(new Error($translate.instant('SyncService.OneItemTooLarge')));
            } else if (message.indexOf('QUOTA_BYTES') > -1) {
              reject(new Error($translate.instant('SyncService.SaveTooLarge')));
            } else {
              reject(new Error(message));
            }
          } else {
            resolve();
          }
        });
      });
    },

    remove: function(key) {
      return $q((resolve, reject) => {
        chrome.storage.sync.remove(key, () => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError));
          } else {
            resolve();
          }
        });
      });
    },

    enabled: (window.chrome && chrome.storage && chrome.storage.sync),
    name: 'ChromeSyncStorage'
  };
}
