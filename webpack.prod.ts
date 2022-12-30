import Common from "./webpack.common";
import Path from "node:path";
import * as Webpack from "webpack";

const config: Webpack.Configuration = {
    ...Common,
    mode: "production",
};

export default config;
