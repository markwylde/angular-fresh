exports.config = {

    capabilities: {
        'browserName': 'chrome'
    },

    specs: [
        './e2e/**/*.spec.js'
    ],

    baseUrl: 'http://localhost:801/camp/backend/src/',

    // ----- Options to be passed to minijasminenode.
    jasmineNodeOpts: {
        onComplete: null,
        isVerbose: false,
        showColors: true,
        includeStackTrace: true
    }
}