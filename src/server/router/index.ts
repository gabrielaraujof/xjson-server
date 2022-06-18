import express, { Router, Request, Response, NextFunction } from "express";
import methodOverride from "method-override";
import _ from "lodash";
import lodashId from "lodash-id";
import low, { LowdbSync } from "lowdb";
import Memory from "lowdb/adapters/Memory";
import FileSync from "lowdb/adapters/FileSync";
import bodyParser from "../body-parser";
import validateData from "./validate-data";
import plural from "./plural";
import nested from "./nested";
import singular from "./singular";
import mixins from "../mixins";

export interface JsonServerRouter<T> extends Router {
  db: LowdbSync<T>;
  render: (req: Request, res: Response) => void;
}

function isLowdb<T extends object>(
  source: T | LowdbSync<T>
): source is LowdbSync<T> {
  return (
    source.hasOwnProperty("__chain__") && source.hasOwnProperty("__wrapped__")
  );
}

function wrapper<T extends object>(source: LowdbSync<T> | T | string) {
  if (typeof source === "string") {
    return low(new FileSync<T>(source));
  } else if (isLowdb(source)) {
    return source;
  }
  return low(new Memory<T>("")).setState(source);
}

export default function router<T extends object>(
  userDb: LowdbSync<T> | T | string,
  options?: { foreignKeySuffix: string }
): JsonServerRouter<T> {
  const opts = Object.assign(
    { foreignKeySuffix: "Id", _isFake: false },
    options
  );

  const db = wrapper(userDb);

  // Create router
  const router = express.Router() as JsonServerRouter<T>;

  // Add middlewares
  router.use(methodOverride());
  router.use(bodyParser);

  validateData(db.getState());

  // Add lodash-id methods to db
  db._.mixin(lodashId);

  // Add specific mixins
  db._.mixin(mixins);

  // Expose database
  router.db = db;

  // Expose render
  router.render = (req, res) => {
    res.jsonp(res.locals.data);
  };

  // GET /db
  router.get("/db", (req, res) => {
    res.jsonp(db.getState());
  });

  // Handle /:parent/:parentId/:resource
  router.use(nested(opts));

  // Create routes
  db.forEach((value, key) => {
    if (_.isPlainObject(value)) {
      router.use(`/${key}`, singular(db, key, opts));
      return;
    }

    if (_.isArray(value)) {
      router.use(`/${key}`, plural(db, key, opts));
      return;
    }

    const sourceMessage = "";
    // if (!_.isObject(source)) {
    //   sourceMessage = `in ${source}`
    // }

    const msg =
      `Type of "${key}" (${typeof value}) ${sourceMessage} is not supported. ` +
      `Use objects or arrays of objects.`;

    throw new Error(msg);
  }).value();

  router.use((req, res) => {
    if (!res.locals.data) {
      res.status(404);
      res.locals.data = {};
    }

    router.render(req, res);
  });

  router.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send(err.stack);
  });

  return router;
}
