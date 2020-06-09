# Servicemap UI

## Requirements 
Using following:
* Node LTS (v10.15.3)
* npm (v6.4.1)

For development:
* Eslint extended from `airbnb` configuration.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Start dev server and runs the app in the development mode.<br>

### `npm run build`

Builds the app for production to the `dist` folder.<br>

### `npm run testBuild`

Builds the app in development mode to the `dist` folder. Used mainly by Travis to run testcafe tests.<br>

### `npm start`

Runs the app by starting node server using build files.

### `npm test`

Launches Jest test runner.<br>

### `npm run browserTest`

Launches TestCafe test runner and performs browser tests on headless chrome.<br>

### `npm run browserTestCLI`
Launches the application using `node dist` command and then launches TestCafe test runner in headless mode. Mainly used by Travis CI.

## How to use
For development first install packages using `npm install` in project root and then you can start development server using `npm run dev`
