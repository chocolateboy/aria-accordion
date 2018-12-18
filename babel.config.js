module.exports = {
    presets: [
        ['@babel/preset-env', {
            // only include polyfills if they're used
            useBuiltIns: 'usage',

            // set this to true to see the applied transforms and bundled polyfills
            debug: true,
        }],
    ],

    plugins: [
        // XXX rollup-plugin-babel doesn't like this
        // '@babel/plugin-transform-runtime'
    ],
}
