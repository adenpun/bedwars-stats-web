import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import * as Path from "node:path";
import * as Webpack from "webpack";
import "webpack-dev-server";

const config: Webpack.Configuration = {
    entry: Path.join(__dirname, "./src/index.ts"),
    module: {
        rules: [
            {
                test: /\.ts$/i,
                use: [{ loader: "ts-loader" }],
            },
            {
                test: /\.s*css$/i,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    { loader: "css-loader" },
                    { loader: "sass-loader" },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({ template: Path.join(__dirname, "./src/index.html") }),
        new MiniCssExtractPlugin(),
    ],
    output: {
        filename: "[name].bundle.js",
        path: Path.join(__dirname, "./build"),
    },
};

export default config;
