export interface FluentMessages {
  en: {
    test: never;
    /**
     *
     * **arg**: name
     */
    thanks: {name: string};
    beep: never;
    greeting: {name: string};
  };
  other: {
    test: never;
    /**
     *
     * **arg**: name
     */
    thanks: {name: string};
  };
  'not-en': {
    test: never;
    greeting: {name: string};
  };
}
