# Cloud Run Deployment

This backend is ready to deploy to Google Cloud Run as a containerized FastAPI service.

## What Cloud Run should run

Cloud Run will build from the `Dockerfile` in this folder and start:

`uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## Before you deploy

You need:

- A Google Cloud project with billing enabled
- Cloud Run API enabled
- Speech-to-Text API enabled
- A Gemini API key
- Your Supabase project values

## Recommended environment variables

Set these in Cloud Run:

- `GEMINI_API_KEY`
- `GEMINI_MODEL=gemini-2.5-flash`
- `GEMINI_TEMPERATURE=0.2`
- `GOOGLE_CLOUD_PROJECT=YOUR_GCP_PROJECT_ID`
- `GOOGLE_STT_LANGUAGE_CODE=en-US`
- `GOOGLE_STT_SAMPLE_RATE_HERTZ=48000`
- `SUPABASE_URL=https://YOUR_PROJECT.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_BUCKET_NAME=speaking-recordings`
- `SUPABASE_JWT_SECRET=YOUR_SUPABASE_JWT_SECRET`
- `FRONTEND_ORIGINS=https://YOUR_GITHUB_PAGES_DOMAIN`
- `ALLOW_MOCK_AUTH=false`
- `DAILY_SCORING_LIMIT=20`
- `MAX_AUDIO_DURATION_SECONDS=60`
- `MAX_AUDIO_FILE_BYTES=10485760`

## Important note about Google credentials

Do **not** set `GOOGLE_APPLICATION_CREDENTIALS` on Cloud Run unless you are deliberately mounting a credentials file.

For Cloud Run, the better approach is:

1. Attach a Google Cloud service account to the Cloud Run service.
2. Grant it access to Speech-to-Text.
3. Let the Google client library use Application Default Credentials automatically.

## Example deploy command

From `/Users/florah/Desktop/pte/backend`:

```bash
gcloud run deploy pte-score-api \
  --source . \
  --region australia-southeast1 \
  --allow-unauthenticated
```

After the first deploy, add your environment variables either in the Cloud Run UI or with `gcloud run services update`.

## Frontend wiring

After Cloud Run gives you a service URL, point your frontend at it by setting:

`window.__PTE_ENV__.PTE_API_BASE_URL`

or by updating:

`/Users/florah/Desktop/pte/js/config/app-config.js`

to use your Cloud Run URL instead of `http://localhost:8000`.

## Suggested service account permissions

Give the Cloud Run runtime service account permission for:

- Speech-to-Text usage
- Any other Google APIs you actually call

You do not need to upload a JSON key file if you use the runtime service account.
