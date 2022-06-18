import bodyParser from "body-parser";

/**
 * Body parser default middleware
 */
export default [
  bodyParser.json({ limit: "10mb" }),
  bodyParser.urlencoded({ extended: false }),
];
