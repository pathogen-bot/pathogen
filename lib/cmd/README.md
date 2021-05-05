Design ideas:

```ts
@Guard(ServerModerator)
class MyCommand extends Command {
  guards = [];

  async run(msg: Message) {
    // msg.args.nth(n) => nth arg
    // msg.args.raw => array of strings split by whitespace
  }
}
```
