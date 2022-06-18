declare module "lodash" {
  interface LoDashExplicitWrapper<TValue> {
    assign(object: object, ...sources: object[]);

    // Mixins by lodash-id
    removeById(id: string): this;
  }

  interface LoDashStatic {
    getRemovable(value: number);
  }
}

export {};
