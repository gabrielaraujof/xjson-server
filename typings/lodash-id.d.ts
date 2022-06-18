declare module "lodash-id" {
  import { Dictionary } from "lodash";
  const lodashId: Dictionary<(...args: any[]) => any>;
  export = lodashId;
}
