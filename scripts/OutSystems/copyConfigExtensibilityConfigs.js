/**
 * Cordova hook script to copy the contents of `www/dynatraceConfig`
 * into the platform-specific project root during build.
 * - Android: copies to `platforms/android/app/`
 * - iOS: copies to `platforms/ios/`
 * Assumes only one platform is being built at a time.
 */

module.exports = function (context) {
    var deferral;
    var fs;
    var path;

    function isCordovaAbove(context, version) {
        var cordovaVersion = context.opts.cordova.version;
        var sp = cordovaVersion.split('.');
        return parseInt(sp[0]) >= version;
    }

    if (isCordovaAbove(context, 8)) {
        deferral = require("q").defer();
        fs = require("fs");
        path = require("path");
    } else {
        deferral = context.requireCordovaModule("q").defer();
        fs = context.requireCordovaModule("fs");
        path = context.requireCordovaModule("path");
    }

    var projectRoot = context.opts.projectRoot;

    const platform = context.opts.platforms[0]; // Assume only one platform
    let platformRoot;
    let configPath;
    
    if (platform === "android") {
        platformRoot = path.join(projectRoot, "platforms", "android");
        configPath = path.join(platformRoot, "dynatraceConfig");
    } else if (platform === "ios") {
        platformRoot = path.join(projectRoot, "platforms", "ios");
        configPath = path.join(platformRoot, "Resources", "dynatraceConfig");
    } else {
        console.log("Unsupported platform: " + platform);
        deferral.resolve();
        return deferral.promise;
    }

    if (!fs.existsSync(configPath)) {
        console.log("Config path not found: " + configPath);
        deferral.resolve();
        return deferral.promise;
    }

    const files = fs.readdirSync(configPath);
    if (files.length === 0) {
        console.log("dynatraceConfig folder is empty.");
        deferral.resolve();
        return deferral.promise;
    }

    console.log("Copying dynatraceConfig to: " + platformRoot);
    copyFolderRecursiveSync(configPath, platformRoot);

    deferral.resolve();

    function copyFileSync(source, target) {
        var targetFile = target;
        if (fs.existsSync(target) && fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source));
        }
        fs.writeFileSync(targetFile, fs.readFileSync(source));
    }

    function copyFolderRecursiveSync(source, target) {
        if (!fs.existsSync(target)) {
            fs.mkdirSync(target, { recursive: true });
        }

        fs.readdirSync(source).forEach((file) => {
            const curSource = path.join(source, file);
            const targetPath = path.join(target, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetPath);
            } else {
                copyFileSync(curSource, target);
            }
        });
    }

    return deferral.promise;
};
