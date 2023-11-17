module.exports = {
    entry: "./index.js",
    plugins: [new DotenvPlugin({ systemvars: true })],
};