const fetch = require('node-fetch');
const fs = require('fs');

// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('task', {
    getVideo ({url, name}) {
      return fetch(url, {
          method: 'get',
          headers: {
              'Content-type': 'application/octet-stream',
          }
      }).then(res => res.blob())
        .then(function(res) {
          return res.stream().pipe(fs.createWriteStream('./downloads/'.concat(name)));
        });
    }
  });
}
