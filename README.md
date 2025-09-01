# dotenv-local-first
> Dotenv local first cli.

## Installation

```sh
npm install -g dotenv-local-first
# or
pnpm install -g dotenv-local-first
```

## Usage

This CLI tool loads environment variables from `.env*` files with the following priority (later files override earlier ones):

1. `.env`
2. `.env.${NODE_ENV}` (e.g., `.env.development`, `.env.production`)
3. `.env.local`
4. `.env.${NODE_ENV}.local` (e.g., `.env.development.local`)

### Basic usage

```sh
# Just load and display environment variables
dotenv-local-first

# Run a script with loaded environment variables
dotenv-local-first your-script.js

# Run with verbose logging
dotenv-local-first -v your-script.js
```

### Example

Create your environment files:

```bash
# .env (base configuration)
DATABASE_NAME=myapp_db
DATABASE_USER=root
DATABASE_PORT=3306
DATABASE_PASS=secret123

# .env.development (development overrides)
DATABASE_NAME=myapp_dev_db
DATABASE_PORT=3307
DATABASE_PASS=dev_secret

# .env.local (local overrides - should not be committed)
DATABASE_PASS=local_override_password
DATABASE_USER=local_user
```

Then run:

```sh
NODE_ENV=development dotenv-local-first
```

This will load variables with the priority: `.env` → `.env.development` → `.env.local` → `.env.development.local`

## Development

```sh
bun create cli/dotenv-local-first --no-git --no-install
```
