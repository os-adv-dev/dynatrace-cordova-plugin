module.exports = {
    cordova : {
        debug : false,
        autoUpdate : true,
        cspURL: "https://xgl76747.live.dynatrace.com/bf"
    },

    js : {
        url : "https://xgl76747.live.dynatrace.com?Api-Token=",
    },

    android : {
        // Those configs are copied 1:1
        config : `
        dynatrace {
            configurations {
                defaultConfig {
                    autoStart {
                        applicationId '2a1ef700-ac4e-4478-8206-bc8293d0a366'
                        beaconUrl 'https://bf14292qza.bf.dynatrace.com/mbeacon'
                    }
                    hybridWebView {
                        enabled true
                    }
                    agentBehavior.startupLoadBalancing true
                }
            }
        }
        `
    },

    ios : {
        // Those configs are copied 1:1
        config : `
        <key>DTXApplicationID</key>
        <string>2a1ef700-ac4e-4478-8206-bc8293d0a366</string>
        <key>DTXBeaconURL</key>
        <string>https://bf14292qza.bf.dynatrace.com/mbeacon</string>
        <key>DTXHybridApplication</key>
        <string>true</string>
        <key>DTXStartupLoadBalancing</key>
        <true/>
        `
    }
}
