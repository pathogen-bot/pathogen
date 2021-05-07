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

/* istanbul ignore next */
/**
 * Attempt to convert types into a boolean
 *
 * @returns The converted boolean
 * @throws {TypeError} Thrown if the type cannot be parsed
 */
export function parseBoolean(
  v: string | number | boolean | null | undefined
): boolean {
  const yesVals = ['y', 'yes', 't', 'true'];
  const noVals = ['n', 'no', 'f', 'false'];

  switch (typeof v) {
    case 'string': {
      const s = v.toLowerCase().trim();

      if (yesVals.includes(s)) {
        return true;
      }

      if (noVals.includes(s)) {
        return false;
      }

      break;
    }

    case 'boolean': {
      return v;
    }

    case 'number': {
      if (v === 1) {
        return true;
      }

      if (v === 0) {
        return false;
      }

      break;
    }

    case 'undefined': {
      return false;
    }
  }

  if (v === null) {
    return false;
  }

  throw new TypeError(`Type ${v} cannot be converted to a boolean`);
}
