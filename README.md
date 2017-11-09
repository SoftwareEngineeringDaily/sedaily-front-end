# software-engineering-daily-website

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report


# run selenium tests (working)
npm run selenium-test

```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# Changing from prod to localhost:

Change this file:

https://github.com/SoftwareEngineeringDaily/sedaily-front-end/blob/develop/src/store/actions/config.js



# Install selenium web driver:

Download & Install Selenium Standalone Server (v3.6.0)
http://www.seleniumhq.org/projects/webdriver/
http://www.seleniumhq.org/download/



# Branches / git flow

master = production / live
develop -> gets pushed to staging

## Flow
flow status

# Pushing to Prod
Remember to npm run build and then ** commit all new files** and then npm run deploy2
