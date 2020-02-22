# Node Project Template

## Includes
- SMS Auth
  - Fake phone numbers require code "123123" in dev only
    - +447123123123
    - +447321321321
- Email Configured
- Heroku-Ready
- TypeORM
  - User Profile Model
- Test harness (blue-tape)
  - Code coverage reporting

## Setup
- Setup scripts tied to `npm i`
- `cp .env.example .env` and edit values
- `npm run mockdata` will clear db and pre-populate with users

## Running
- `npm run db` will prep databases
- `npm run start:dev` to run with auto-restarting
- `npm run start:dev-fresh` combines `db` and `start:dev`

## Development
- When changing models, run `run migrations:generate && npm run migrations:run`

## Testing
- `npm t` will generate code coverage report

## Production
- `npm run build`
- `npm run start`

# License
[./LICENSE](./LICENSE) - MIT