export enum ArgFormat {
  UNQUOTED_STRING = 'UNQUOTED_STRING',
  DOUBLE_QUOTED_STRING = 'DOUBLE_QUOTED_STRING',
  SINGLE_QUOTED_STRING = 'SINGLE_QUOTED_STRING',
  INLINE_CODE = 'INLINE_CODE',
  CODE_BLOCK = 'CODE_BLOCK',
}

/**
 * Parsed command arguments
 */
export class Args {
  public args: Arg<string | number | boolean, ArgFormat>[] = [];
  private index = 0;

  constructor(public raw: string) {
    this.parse(raw);
  }

  /**
   * Split args into an array of Arg
   *
   * Heavily inspired by https://github.com/campbellbrendene/discord-command-parser
   *
   * @param argv Unparsed arguments
   * @returns Parsed arguments
   */
  parse(argv: string): Arg<string | number | boolean, ArgFormat>[] {
    let s = argv.trim();
    const args = this.args;

    while (s.length) {
      let a = 0;

      if (s.startsWith('"') && (a = s.indexOf('"', 1)) > 0) {
        const sub = s.slice(1, a);
        s = s.slice(a + 1);

        args.push(new Arg(sub, ArgFormat.DOUBLE_QUOTED_STRING));
      } else if (s.startsWith("'") && (a = s.indexOf("'", 1)) > 0) {
        const sub = s.slice(1, a);
        s = s.slice(a + 1);

        args.push(new Arg(sub, ArgFormat.SINGLE_QUOTED_STRING));
      } else if (s.startsWith('```') && (a = s.indexOf('```', 3)) > 0) {
        const sub = s.slice(3, a);
        s = s.slice(a + 3);

        const matchedLang = /^(([a-z]+)?$\n)/m.exec(sub);

        if (matchedLang) {
          const len = matchedLang[1].length;
          const lang = matchedLang[2];
          const code = sub.slice(len).trim();

          args.push(new Arg(code, ArgFormat.CODE_BLOCK, lang));
        } else {
          args.push(new Arg(sub.trim(), ArgFormat.CODE_BLOCK));
        }
      } else if (
        s.startsWith('`') &&
        !s.startsWith('``') &&
        (a = s.indexOf('`', 1)) > 0
      ) {
        const sub = s.slice(1, a);
        s = s.slice(a + 1);

        args.push(new Arg(sub, ArgFormat.INLINE_CODE));
      } else {
        const sub = s.split(/\s/)[0].trim();
        s = s.slice(sub.length);

        args.push(new Arg(sub, ArgFormat.UNQUOTED_STRING));
      }

      s = s.trim();
    }

    return args;
  }

  /**
   * Return the nth argument
   *
   * @param n The zero-indexed argument number
   * @returns The argument (if one exists)
   */
  nth(n: number) {
    return this.args[n];
  }

  /**
   * Returns the next argment and increments the counter
   *
   * @returns The next argument
   */
  next() {
    const next = this.args[this.index];
    if (next) {
      this.index++;
      return next;
    }

    return null;
  }

  /**
   * Returns the previous argument
   *
   * @returns The previous argument
   */
  prev() {
    return this.args[this.index - 1];
  }

  /**
   * Returns the next argument without incrementing
   * the counter
   *
   * @returns The next argument
   */
  peek() {
    return this.args[this.index];
  }

  /**
   * Modify the index counter
   */
  setIndex(n: number) {
    this.index = n;
    return this;
  }

  /**
   * The total number of arguments after parsing
   */
  get size() {
    return this.args.length;
  }

  /**
   * Return the raw, unparsed args
   */
  toString(): string {
    return this.raw;
  }
}

export class Arg<T extends string | number | boolean, KIND extends ArgFormat> {
  lang?: KIND extends ArgFormat.CODE_BLOCK ? string : never;

  constructor(public val: T, public format: KIND, lang?: Arg<T, KIND>['lang']) {
    if (lang) {
      this.lang = lang;
    }
  }
}
