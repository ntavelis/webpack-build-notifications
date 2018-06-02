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
  
 ## Config Options
  
  Here is the full list of the supported configuration. You can also pass any valid [node-notifier](https://github.com/mikaelbr/node-notifier) option, that may not be listed here. Just keep in mind, that not every option of node-notifier works in the **Windows platform**.
  
  #### title
  The notification title. Defaults to **_Webpack Build_**.
  
  #### logo
  The absolute path to the project logo to be displayed as a content image in the notification. Optional.
  
  #### successSound
  The sound to play for success notifications. Defaults to the value of the **submarine** for mac OS and **Notification.Default** for windows. Set to false to play no sound for success notifications.
  * In Mac OS successSound can be one of these: Basso, Blow, Bottle, Frog, Funk, Glass, Hero, Morse, Ping, Pop, Purr, Sosumi, Submarine, Tink. If sound is simply true, Bottle is used.
  * In Linux OS there are no sounds.
  * In windows you can choose any valid option described [here](http://msdn.microsoft.com/en-us/library/windows/apps/hh761492.aspx). e.g. `successSound: 'Notification.Mail'` 
  
  #### warningSound
  The sound to play for warning notifications. Defaults to the value of the **submarine** for mac OS and **Notification.Default** for windows. Set to false to play no sound for success notifications.
   * In Mac OS warningSound can be one of these: Basso, Blow, Bottle, Frog, Funk, Glass, Hero, Morse, Ping, Pop, Purr, Sosumi, Submarine, Tink. If sound is simply true, Bottle is used.
   * In Linux OS there are no sounds.
   * In windows you can choose any valid option described [here](http://msdn.microsoft.com/en-us/library/windows/apps/hh761492.aspx). e.g. `warningSound: 'Notification.Mail'`
  
  #### failureSound
  The sound to play for failure notifications. Defaults to the value of the **submarine** for mac OS and **Notification.Default** for windows. Set to false to play no sound for success notifications.
   * In Mac OS failureSound can be one of these: Basso, Blow, Bottle, Frog, Funk, Glass, Hero, Morse, Ping, Pop, Purr, Sosumi, Submarine, Tink. If sound is simply true, Bottle is used.
   * In Linux OS there are no sounds.
   * In windows you can choose any valid option described [here](http://msdn.microsoft.com/en-us/library/windows/apps/hh761492.aspx). e.g. `failureSound: 'Notification.Mail'`
  
  #### suppressSuccess
  Defines when success notifications are shown. Can be one of the following values:
  *  false     - Show success notification for each successful compilation (default).
  *  true      - Only show success notification for initial successful compilation and after failed compilations.
  *  "always"  - Never show the success notifications.
  *  "initial" - Same as true, but suppresses the initial success notification.
  
  #### suppressWarning
  True to suppress the warning notifications, otherwise false (default).
  
  #### suppressCompileStart
  True to suppress the compilation started notifications (default), otherwise false.
  
  #### activateTerminalOnError
  True to activate (focus) the terminal window when a compilation error occurs. Note that this only works on Mac OSX (for now). Defaults to **_false_**. Regardless of the value of this config option, the terminal window can always be brought to the front by clicking on the notification.
  
  #### successIcon
  The absolute path to the icon to be displayed for success notifications. Defaults to the included **_./icons/success.png_**.
  
  #### warningIcon
  The absolute path to the icon to be displayed for warning notifications. Defaults to the included **_./icons/warning.png_**.
  
  #### failureIcon
  The absolute path to the icon to be displayed for failure notifications. Defaults to the included **_./icons/failure.png_**.
  
  #### compileIcon
  The absolute path to the icon to be displayed for compilation started notifications. Defaults to the included **_./icons/compile.png_**.
  
  #### messageFormatter
  A function which returns a formatted notification message. The function is passed two parameters:
  * {Object} error/warning - The raw error or warning object.
  * {String} filepath - The path to the file containing the error/warning (if available).
  
  This function must return a String.
  The default messageFormatter will display the filename which contains the error/warning followed by the
  error/warning message.
  Note that the message will always be limited to 256 characters.
  
  #### onClick
  A function to be called when the notification is clicked. By default it activates the Terminal application. (Does not work on windows)
  
  The function's signature
  ```javascript
 {
     // other options
     onClick: function(notifierObject, options){}
 }
 ```
  #### onTimeout
  A function to be called when the notification closes. By default it does not do anything.
  
   The function's signature
   ```javascript
  //Configuration options
  {
      // other options
      onTimeout: function(notifierObject, options){}
  }
  ```
 
 ## Credits
 
 This package uses the [node-notifier](https://github.com/mikaelbr/node-notifier) package to display the notifications.
 
 Also this package is heavily inspired from [webpack-build-notifier](https://github.com/RoccoC/webpack-build-notifier) 
 
 ## Contributing
 
 Thank you for considering contributing to the webpack-build-notifications.
 
 ## License
 
 webpack-build-notifications is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).