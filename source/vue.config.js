module.exports = {
    lintOnSave: false,
    chainWebpack: config => {
        // GraphQL Loader
        config.module
            .rule('md')
            .test(/\.md$/)
            .use('mdloader')
            .loader(require.resolve('./mdloader'))
    }
}