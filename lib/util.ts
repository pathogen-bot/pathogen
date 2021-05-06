/* istanbul ignore next */
/**
 * Create a class decorator that adds a `Set` property, `key`
 * to a class and appends he provided item
 */
export function createSetDecorator<T>(key: string) {
  return (prop: T): ClassDecorator => {
    return (f: Function) => {
      if (f.prototype[key]) {
        f.prototype[key].add(prop);
      } else {
        f.prototype[key] = new Set<T>().add(prop);
      }
    };
  };
}
