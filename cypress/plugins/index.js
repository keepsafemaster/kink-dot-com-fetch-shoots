const fetch = require('node-fetch');
const fs = require('fs');
const request = require('request');

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

let complete;

function wait(resolve) {
  setTimeout(() => {
    if (complete) {
      complete = false;
      resolve(true);
    } else {
      wait(resolve);
    }
  }, 5000);
}

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('task', {
    getVideo ({url, name}) {
      console.log('\nDownloading file from: '.concat(url));
      if (!fs.existsSync('./downloads')) {
        fs.mkdirSync('./downloads');
      }

      const path = './downloads/'.concat(name);
      fs.writeFileSync(path, 'Still downloading...');

      const response = request(url);
      response.pipe(fs.createWriteStream(path));
      response.on('end', () => {
        console.log('\t||');
        console.log('\t||');
        console.log('\t||');
        console.log('\t||=====> Done: '.concat(name));
        console.log('');
        complete = true;
      });
      return new Promise((resolve) => {
        wait(resolve);
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
