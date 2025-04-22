/**
 * Cordova hook script to copy the contents of `www/dynatraceConfig` 
 * into the platform-specific project roots for iOS and Android during build.
 * - Android: copies to `platforms/android/app/`
 * - iOS: copies to `platforms/ios/`
 * This ensures Dynatrace config files are available in the native projects.
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
    var wwwPath = path.join(projectRoot, "www");
    //var configPath = path.join(wwwPath, "dynatraceConfig");

    const platforms = context.opts.platforms || [];

    if (!fs.existsSync(wwwPath)) {
        console.log("Config path not found: " + wwwPath);
        deferral.resolve();
        return deferral.promise;
    }

    const files = fs.readdirSync(wwwPath);
    if (files.length === 0) {
        console.log("dynatraceConfig folder is empty.");
        deferral.resolve();
        return deferral.promise;
    }

    platforms.forEach((platform) => {
        let platformResourcesRoot;
        if (platform === "android") {
            platformResourcesRoot = path.join(projectRoot, "platforms", "android");
        } else if (platform === "ios") {
            platformResourcesRoot = path.join(projectRoot, "platforms", "ios", "Resources");
        } else {
            return; // unsupported platform
        }

        console.log("Copying config to: " + platformResourcesRoot);
        copyFolderRecursiveSync(wwwPath, platformRoot);
    });

    deferral.resolve();

    function copyFileSync(source, target) {
        var targetFile = target;
        if (fs.existsSync(target)) {
            if (fs.lstatSync(target).isDirectory()) {
                targetFile = path.join(target, path.basename(source));
            }
        }
        fs.writeFileSync(targetFile, fs.readFileSync(source));
    }

    function copyFolderRecursiveSync(source, target) {
        var files = [];
        if (!fs.existsSync(target)) {
            fs.mkdirSync(target, { recursive: true });
        }

        if (fs.lstatSync(source).isDirectory()) {
            files = fs.readdirSync(source);
            files.forEach((file) => {
                var curSource = path.join(source, file);
                if (fs.lstatSync(curSource).isDirectory()) {
                    copyFolderRecursiveSync(curSource, path.join(target, file));
                } else {
                    copyFileSync(curSource, target);
                }
            });
        }
    }

    return deferral.promise;
};