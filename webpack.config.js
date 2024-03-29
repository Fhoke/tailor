const TerserPlugin = require('terser-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const TailorClass = require('./src/Tailor');

module.exports = (env, options) => {
    const isProduction = options.mode == 'production';
    const Tailor = new TailorClass(isProduction);

    return {
        stats: Tailor.webpackSettings.stats,

        performance: Tailor.webpackSettings.performance,

        entry: Tailor.webpackSettings.entry,

        output: Tailor.webpackSettings.output,

        resolve: Tailor.webpackSettings.resolve,

        optimization: {
            minimizer: [
                new TerserPlugin({
                    extractComments: false,
                    terserOptions: {
                        compress: {
                            pure_funcs: [
                                'console.log',
                            ],
                        },
                        format: {
                            comments: false,
                        },
                    },
                }),

                new ImageMinimizerPlugin({
                    severityError: 'warning',
                    minimizer: {
                        implementation: ImageMinimizerPlugin.imageminMinify,
                        options: {
                            plugins: Tailor.imageOptimisationSettings(isProduction),
                        },
                    },
                }),
            ],
        },

        module: {
            rules: Tailor.webpackSettings.module.rules,
        },

        plugins: Tailor.webpackSettings.plugins
    }
};
