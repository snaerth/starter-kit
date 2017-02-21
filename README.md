# React-Redux-Universal with Mongodb and express

## Install, Development, Production and Running
git clone https://github.com/snaerth/starter-kit my-project

1. cd my-project
2. npm install

### Development
1. npm run start-dev
2. Navigate to http://localhost:3000 in your browser of choice.

### Production
1. npm run build
2. npm run start-prod 

## Overview

### React by default
The project runs with React by default and hot replacement of changes to the modules. It also uses Redux for state management

### CSS Modules
CSS files loaded into components are locally scoped and you can point to class names with javascript. 
You can also compose classes together, also from other files. These are also hot loaded.
To turn off CSS Modules remove it from the `webpack.config.js` file.

### Babel and Linting
Both Node server and frontend code runs with Babel. And all of it is linted. With atom you install the `linter` package, then `linter-eslint` and `linter-jscs`. 
You are covered. Also run `npm run eslint` or `npm run jscs` to verify all files.
### Beautify
With a beautify package installed in your editor it will also do that

## Inspired by
https://github.com/ueno-llc/starter-kit
https://github.com/erikras/react-redux-universal-hot-example

 

