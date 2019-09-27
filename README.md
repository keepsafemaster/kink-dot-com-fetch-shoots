# Kink.com Shoots Automatic Downloader

## Prerequisits
- Node.js
- Node Package Manager (NPM)

## Usage

Install node modules:
```sh
$ npm install
```

To use, first add your login info:
```sh
$ echo {my-email} >> login.info
$ echo {my-password} >> login.info
```

Add links to 'links.csv' (https://kink.com/shoot/{shoot-id}):
```sh
$ echo {link} >> shoot.list
```

Run the start command:
```sh
$ npm start
```

This will likly take a while as it has to download the HD videos. After it is done the files should appear in './downloads/'