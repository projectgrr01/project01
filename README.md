# GifKaro.com

This project is build with [Angular CLI](https://github.com/angular/angular-cli) version 6.1.4.

## Setup on local

Navigate to checked out directory
1. Install *Node* (From nodejs site directly or by some package manager)
2. Install *Angular/cli* (Run command `npm install -g @angular/cli`)
3. Install *dependencies* (Run command `npm install`)

## Run Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## To deploy on Servers
1. Install *Node* (From nodejs site directly or by some package manager)
2. Install *Angular/cli* (Run command `npm install -g @angular/cli`)
3. Install *dependencies* (Run command `npm install`)
4. if not already installed, run npm install --unsafe-perm node-sass
5. npm install -g pm2		//This we are using to run and monitor the node server process
6. npm run buid:prod		//Build for SEO and Bot compatible angular site
7. pm2 start local.js		//This is equivalent to "npm run server" with added advantages

## To update build on server
1. Git pull
2. npm run buid:prod
3. pm2 restart local

