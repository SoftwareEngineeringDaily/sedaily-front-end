[![logo](https://i.imgur.com/3OtP3p8.png)](https://softwareengineeringdaily.com/)

# SEDaily Website

> Web front end for the [Software Engineering Daily](https://www.softwaredaily.com) application, a Vue.js project

## Getting Started
See the companion project [API](https://github.com/SoftwareEngineeringDaily/software-engineering-daily-api) required to run the web front end locally.

``` bash
# cloning the project
git clone https://github.com/SoftwareEngineeringDaily/sedaily-front-end.git
cd sedaily-front-end/

# install dependencies
npm install

# serve with hot reload at localhost:8080, using API and event service API running locally
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run selenium tests (working)
npm run selenium-test
```
# npm start
Note this is differnt than the stuff ran on heroku which is inside dist/package.json


For detailed explanation on Vue.js webpack configuration, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Available API environments
In order to speed up configuration, you can use the API and event stream API's in other environments:
```
# serve with hot reload at localhost:8080, using API running on staging
npm run dev:api-staging

# serve with hot reload at localhost:8080, using API running on production
npm run dev:api-prod
```

## Install selenium web driver:

Download & Install Selenium Standalone Server (v3.6.0)
http://www.seleniumhq.org/projects/webdriver/
http://www.seleniumhq.org/download/

## Contributing
`master` branch is deployed to production
`develop` branch gets pushed to staging

We have an active Slack community that you can reach out to for more information or just to chat with anyone. Check out the [<img src="https://upload.wikimedia.org/wikipedia/commons/7/76/Slack_Icon.png" alt="Slack Channel" width="20px"/> SED app development](https://softwaredaily.slack.com/app_redirect?channel=sed_app_development) slack channel. Also see the [Open Source Guide](https://softwareengineeringdaily.github.io/).

## Pushing to Production
Remember to `npm run build` and then ** commit all new files** and then `npm run deploy2`
Works if done from master branch.
To delete commit:

git fetch origin
git reset --hard origin/master
