-- migrate:up
CREATE TABLE guilds (
  id VARCHAR(20) PRIMARY KEY,
  blocked BOOLEAN NOT NULL DEFAULT FALSE,
  config JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- migrate:down
DROP TABLE guilds;
