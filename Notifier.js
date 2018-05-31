let path = require('path');
let process = require('process');
let os = require('os');
let notifier = require('node-notifier');
let stripAnsi = require('strip-ansi');
let exec = require('child_process').exec;

let appName;

/**
 * Activates the terminal,
 * For now, it does not work in windows platform
 */
let activateTerminalWindow = function() {
    if (os.platform() === 'darwin') {
        exec('TERM="$TERM_PROGRAM"; ' +
            '[[ "$TERM" == "Apple_Terminal" ]] && TERM="Terminal"; ' +
            '[[ "$TERM" == "vscode" ]] && TERM="Visual Studio Code"; ' +
            'osascript -e "tell application \\"$TERM\\" to activate"');
    }
};

let NtavelisWebpackNotifier = function(cfg) {
    let defaultIconPath = path.resolve(__dirname, 'icons');
    let defaultSound = 'Submarine';

    /**
     * How we will format the message by default, unless the user overrides this function.
     * @param error
     * @param filepath
     * @returns {string}
     */
    let defaultMessageFormatter = function(error, filepath) {
        return filepath + os.EOL + (error.message ? error.message.replace(error.module ? error.module.resource : '', '') : '');
    };

    // The default configuration
    let defaultConfig = {
        appName: appName,
        title: "Webpack build result",
        contentImage: Mix.paths.root('node_modules/pretty-mix-notifications/icons/success.png'),

        successIcon: path.join(defaultIconPath, 'success.png'),
        warningIcon: path.join(defaultIconPath, 'warning.png'),
        failureIcon: path.join(defaultIconPath, 'failure.png'),
        compileIcon: path.join(defaultIconPath, 'compile.png'),

        sound: defaultSound,
        successSound: defaultSound,
        warningSound: defaultSound,
        failureSound: defaultSound,

        suppressSuccess: false,
        suppressWarning: false,
        suppressCompileStart: true,
        activateTerminalOnError: false,
        wait: true,
        messageFormatter: defaultMessageFormatter,
        onClick: function(notifierObject, options) { activateTerminalWindow(); },
        onTimeout: function(notifierObject, options) { }
    };

    // Mix the user's configuration with the default.
    // If a property exists on both objects, the users takes precedence
    Object.assign(this, defaultConfig, cfg);

    /**
     * @cfg {Function} messageFormatter
     * A function which returns a formatted notification message. The function is passed two parameters:
     *  1) {Object} error/warning - The raw error or warning object.
     *  2) {String} filepath - The path to the file containing the error/warning (if available).
     * This function must return a String.
     * The default messageFormatter will display the filename which contains the error/warning followed by the
     * error/warning message.
     * Note that the message will always be limited to 256 characters.
     */
    this.formatMessage = function(error, filepath) {
        let message = this.messageFormatter(error, filepath);
        if (typeof message === "string") {
            return message.substr(0, 256); // limit message length to 256 characters
        } else {
            throw "Invalid message type '" + typeof message + "'; messageFormatter must return a String.";
        }
    };

    /**
     * Make a notification
     * @param options
     */
    this.notify = function (options) {
        let finalOptions = Object.assign(this, options);
        notifier.notify(finalOptions);
    };

    // add notification click handler that by default activates the terminal window
    notifier.on('click', this.onClick.bind(this));
    // add timeout handler
    notifier.on('timeout', this.onTimeout.bind(this));
};

let buildSuccessful = false;
let hasRun = false;

NtavelisWebpackNotifier.prototype.onCompilationWatchRun = function(compilation, callback) {
    this.notify({
        message: 'Compilation started...',
        icon: this.compileIcon
    });
    callback();
};

NtavelisWebpackNotifier.prototype.onCompilationDone = function(results) {

    let notify,
        msg = 'Build successful!',
        icon = this.successIcon,
        sound = this.successSound;

    if (results.hasErrors()) {
        let error = results.compilation.errors[0];
        notify = true;
        msg = this.formatMessage(error, error.module && error.module.rawRequest ? error.module.rawRequest : '');
        icon = this.failureIcon;
        sound = this.failureSound;
        buildSuccessful = false;
    } else if (!this.suppressWarning && results.hasWarnings()) {
        let warning = results.compilation.warnings[0];
        notify = true;
        msg = this.formatMessage(warning, warning.module && warning.module.rawRequest ? warning.module.rawRequest : '');
        icon = this.warningIcon;
        sound = this.warningSound;
        buildSuccessful = false;
    } else {
        if (this.suppressSuccess === "always" || (this.suppressSuccess === "initial" && !hasRun)) {
            notify = false;
        } else if (this.suppressSuccess === false || !buildSuccessful) {
            notify = true; // previous build failed, let's show a notification even if success notifications are suppressed
        }
        buildSuccessful = true;
    }

    if (notify) {
        this.notify({
            message: stripAnsi(msg),
            sound: sound,
            icon: icon,
        });
    }

    if (this.activateTerminalOnError && !buildSuccessful) {
        activateTerminalWindow();
    }

    hasRun = true;
};

NtavelisWebpackNotifier.prototype.apply = function(compiler) {
    if (compiler.hooks && compiler.hooks.watchRun && compiler.hooks.done) {
        // for webpack >= 4
        if (!this.suppressCompileStart) {
            compiler.hooks.watchRun.tapAsync('webpack-build-notifier', this.onCompilationWatchRun.bind(this));
        }
        compiler.hooks.done.tap('webpack-build-notifier', this.onCompilationDone.bind(this));
    } else {
        // for webpack < 4
        if (!this.suppressCompileStart) {
            compiler.plugin('watch-run', this.onCompilationWatchRun.bind(this));
        }
        compiler.plugin('done', this.onCompilationDone.bind(this));
    }
};

module.exports = NtavelisWebpackNotifier;