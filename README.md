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

## Contact API Example

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Kirthi", "email":"laharika285@gmail.com", "message":"Hi!"}'
```
