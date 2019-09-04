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
          console.log('Downloading file from: '.concat(url));

          if (!fs.existsSync('./downloads')) {
            fs.mkdirSync('./downloads');
          }

          const path = './downloads/'.concat(name);
          fs.writeFileSync(path, 'Still downloading...');
          return res.stream().pipe(fs.createWriteStream(path));
        });
    },

    verify () {
        if (!fs.existsSync('./login.info')) {
          throw new Error('No "login.info" file found');
        }

        const file = fs.readFileSync('./login.info', 'utf8');
        const values = file.split('\n')
          .filter(value => value)
          .filter(value => value.trim().length > 0);

        if (values.length < 1) {
          throw new Error('A username is missing from the "login.info" file');
        } 
        if (values.length < 2) {
          throw new Error('A password is missing from the "login.info" file');
        } 

        if (!fs.existsSync('./shoot.list')) {
          throw new Error('No "shoot.list" file found');
        }

        const links = fs.readFileSync('./shoot.list', 'utf8').split('\n');
        if (links.length < 1) {
          throw new Error('Zero shoot links were given in the "shoot.list" file');
        }

        return null;
    }
  });
}
