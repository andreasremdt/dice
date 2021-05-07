import { babel } from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

const COMPONENTS = ["dialog", "dropdown", "select", "tabs", "textarea", "tooltip"];

export default [
  ...COMPONENTS.map((component) => ({
    input: `src/${component}/${component}.js`,
    output: {
      dir: "lib",
      sourcemap: true,
    },
    plugins: [babel({ babelHelpers: "inline" }), terser()],
  })),
  {
    input: "src/index.js",
    output: {
      dir: "lib",
      sourcemap: true,
    },
    plugins: [babel({ babelHelpers: "inline" }), terser()],
  },
];
