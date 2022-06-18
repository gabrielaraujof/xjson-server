import express, { Router } from "express";
import rewrite from "express-urlrewrite";

interface Routes {
  [key: string]: string;
}

export default (routes: Routes): Router => {
  const router = express.Router();

  router.get("/__rules", (req, res) => {
    res.json(routes);
  });

  Object.entries(routes).forEach(([from, to]) => {
    router.use(rewrite(from, to));
  });

  return router;
};
