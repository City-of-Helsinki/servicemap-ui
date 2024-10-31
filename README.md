# Servicemap UI

## Requirements 
Using following:
* Node LTS (v22)
* npm (v10)
If you are using NVM you can also use `nvm use` to get correct version.

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
For development: 
- Make sure npm packages are installed by running `npm install`in project root.
- Make sure you have environment variables set. `.env.example` should have all required values so you can copy it to `.env`.
- Then you can start development server using `npm run dev`. Which watches files and updates on code changes.

To run in production mode:
- Make sure npm packages are installed by running `npm install`in project root.
- Make sure you have environment variables set. `.env.example` should have all required values so you can copy it to `.env`.
- Build files by running `npm run build`
- Then you can just run the app with `npm start`

## Environment variables
This is a documentation (some day hopefully exhaustive) of environment variables and how to use them.

### What to do when adding variables
These work in reverse when you want to delete a variable (duh).
- Add a description of the variable at the end of this doc section.
- Add variable to `.env.example` to act as an example.
- Add variable to your local `.env` for your local environment at `localhost:2048`.
- Add variable to `.github/workflows/ci.yml` so it will be used during PR build.
- Add variable to `server/server.js` for it to be picked up by the application code.
- Add variable to `config/default.js` for it to be part of `config` object during runtime. 
- Add variable value to `testing-ui`, `staging-ui` and `production-ui` variable groups WHEN IT IS APPROPRIATE.
  - https://dev.azure.com/City-of-Helsinki/palvelukartta/_library?itemType=VariableGroups 
- Add variable mapping so that they are injected from test-ui variable set to test-ui build/deploy during pipeline run. 
  - https://dev.azure.com/City-of-Helsinki/palvelukartta/_git/palvelukartta-pipelines?path=/devops/palvelukartta-ui-config-map.yml

### List of variables

|Variable|description|format|default|
|-|-|-|-|
|ADDITIONAL_FEEDBACK_URLS_ESPOO|Links to feedback service (in three languages)|Comma separated triple (fi,sv,en) of urls|"https://easiointi.espoo.fi/eFeedback/fi,https://easiointi.espoo.fi/eFeedback/sv,https://easiointi.espoo.fi/eFeedback/en"|
|ADDITIONAL_FEEDBACK_URLS_KAUNIAINEN|Links to feedback service (in three languages)|Comma separated triple (fi,sv,en) of urls|"https://www.kauniainen.fi/kaupunki-ja-paatoksenteko/osallistu-ja-vaikuta/,https://www.kauniainen.fi/sv/staden-och-beslutsfattande/delta-och-paverka/,https://www.kauniainen.fi/kaupunki-ja-paatoksenteko/osallistu-ja-vaikuta/"|
|ADDITIONAL_FEEDBACK_URLS_KIRKKONUMMI|Links to feedback service (in three languages)|Comma separated triple (fi,sv,en) of urls|"https://kirkkonummi.fi/anna-palautetta-ja-vaikuta/,https://kyrkslatt.fi/ge-respons-och-paverka/,https://kirkkonummi.fi/anna-palautetta-ja-vaikuta/"|
|ADDITIONAL_FEEDBACK_URLS_VANTAA|Links to feedback service (in three languages)|Comma separated triple (fi,sv,en) of urls|"https://www.vantaa.fi/fi/palaute,https://www.vantaa.fi/sv/feedback,https://www.vantaa.fi/en/feedback"|
|CITIES|Cities/Municipalities that can be used to filter data|Comma separated string of cities|"helsinki,espoo,vantaa,kauniainen,kirkkonummi"|
|FEATURE_SERVICEMAP_PAGE_TRACKING|Is tracking cookie enabled|"true"/"false"|"false"|
|ORGANIZATIONS|Organizations that can be used to filter data|Json array of organization objects|"[{ "id": "83e74666-0836-4c1d-948a-4b34a8b90301", "name": { "fi": "Helsingin kaupunki", "sv": "Helsingfors stad", "en": "City of Helsinki" } },{ "id": "520a4492-cb78-498b-9c82-86504de88dce", "name": { "fi": "Espoon kaupunki", "sv": "Esbo stad", "en": "City of Espoo" } },{ "id": "6d78f89c-9fd7-41d9-84e0-4b78c0fa25ce", "name": { "fi": "Vantaan kaupunki", "sv": "Vanda stad", "en": "City of Vantaa" } },{ "id": "6f0458d4-42a3-434a-b9be-20c19fcfa5c3", "name": { "fi": "Kauniaisten kaupunki", "sv": "Grankulla stad", "en": "Town of Kauniainen" } },{ "id": "015fd5cd-b280-4d24-a5b4-0ba6ecb4c8a4", "name": { "fi": "Kirkkonummi", "sv": "Kyrkslätt", "en": "Kirkkonummi" } },{ "id": "0c8e4f99-3d52-47b9-84df-395716bd8b11", "name": { "fi": "Länsi-Uudenmaan hyvinvointialue", "sv": "Västra Nylands välfärdsområde", "en": "Western Uusimaa Wellbeing Services County" } },{ "id": "5de91045-92ab-484b-9f96-7010ff7fb35e", "name": { "fi": "Vantaan ja Keravan hyvinvointialue", "sv": "Vanda och Kervo välfärdsområde", "en": "Wellbeing services county of Vantaa and Kerava" } }]"|
|READ_FEEDBACK_URLS_HELSINKI|Url template (in three languages) for reading feedback|Comma separated triple (fi,sv,en) of urls. Search string will be appended to the end of url.|"https://palautteet.hel.fi/fi/hae-palautteita#/app/search?r=12&text=,https://palautteet.hel.fi/sv/hae-palautteita#/app/search?r=12&text=,https://palautteet.hel.fi/en/hae-palautteita#/app/search?r=12&text="|
|SLOW_FETCH_MESSAGE_TIMEOUT|How slow should the fetch be so that slow fetch message is displayed (in ms)|number|3000|
