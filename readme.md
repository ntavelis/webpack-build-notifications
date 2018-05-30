# webpack-build-notifications

This is a webpack plugin that will notify you for your build process. It is highly customizable and you are free to pass any valid `note-notifier` configuration.

## Installation

  1. `npm install webpack-build-notifications --save-dev` or `yarn add webpack-build-notifications --dev`
  2. Add it to the plugins in the webpack.config.js file.
  
  ```javascript
     var WebpackBuildNotifications = require('webpack-build-notifications');
      
     var config = module.exports = {
       // ...
      
       plugins: [
         new WebpackBuildNotifications(),
       ]
     }
  ```
  
## Override the default config
  TODO
 
 ## Contributing
 
 Thank you for considering contributing to the webpack-build-notifications.
 
 ## License
 
 webpack-build-notifications is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).