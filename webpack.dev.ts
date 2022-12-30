import Common from "./webpack.common";
import * as Path from "node:path";
import * as Webpack from "webpack";
import "webpack-dev-server";

const config: Webpack.Configuration = {
    ...Common,
    mode: "development",
    devtool: "source-map",
    devServer: { port: 8080, static: { directory: Path.join(__dirname, "./build") } },
};

export default config;
