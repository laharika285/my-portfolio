# Portfolio Backend

This project adds a simple Express backend for the portfolio site. The backend serves the static site and provides REST endpoints for contact submissions and portfolio data.

## Available Scripts

- `npm install` — install dependencies
- `npm start` — start the production server
- `npm run dev` — start the server with `nodemon` for development

## API Endpoints

- `GET /api/health` — health check
- `GET /api/skills` — list of skills
- `GET /api/projects` — list of projects
- `GET /api/contact-info` — contact details
- `POST /api/contact` — submit a contact form payload

## Notes

- This folder was not a git repository in the current environment, so git commit/push could not be performed here.
- To publish this project, run:
  1. `git init`
  2. `git add .`
  3. `git commit -m "Add Express backend and contact API"`
  4. `git branch -M main`
  5. `git remote add origin https://github.com/<your-username>/<repository>.git`
  6. `git push -u origin main`

## Supabase Integration (optional)

This project can store contact submissions in Supabase instead of the local JSON file. The server will use Supabase when `SUPABASE_URL` and `SUPABASE_KEY` are set in the environment.

1. Create a new Supabase project at https://app.supabase.com/
2. In your project SQL editor, create a simple `contacts` table:

```sql
create table contacts (
  id bigserial primary key,
  name text not null,
  email text not null,
  message text not null,
  submitted_at timestamptz
);
```

3. If you want to allow public inserts from the frontend using the anon key, enable Row Level Security (RLS) and add a policy that allows inserts:

```sql
alter table contacts enable row level security;
create policy "Allow public insert" on contacts for insert using (true);
```

4. Copy the project `SUPABASE_URL` and `SUPABASE_KEY` into a local `.env` file (do not commit it). See `.env.example`.

5. Install dependencies and run the server:

```bash
npm install
npm start
```

The server will insert contact submissions into Supabase when configured; otherwise it falls back to the local `data/contacts.json` file.

## Contact API Example

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Kirthi", "email":"laharika285@gmail.com", "message":"Hi!"}'
```
