# PTE Practice App

A lightweight PTE Academic practice app for speaking, writing, reading, and listening, now with backend-managed AI scoring and audio transcription for speaking tasks.

## Features

- Speaking practice:
  - Read Aloud
  - Repeat Sentence
  - Describe Image
  - Re-tell Lecture
  - Answer Short Question
- Writing practice:
  - Summarize Written Text
  - Write Essay
- Reading practice:
  - Reading & Writing Fill in the Blanks
  - Multiple Choice, Single Answer
  - Multiple Choice, Multiple Answers
  - Re-order Paragraphs
  - Reading Fill in the Blanks
- Listening practice:
  - Summarize Spoken Text
  - Multiple Choice tasks
  - Fill in the Blanks
  - Highlight Correct Summary
  - Select Missing Word
  - Highlight Incorrect Words
  - Write From Dictation

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- FastAPI
- Google Cloud Speech-to-Text
- Browser Speech Recognition API
- Browser MediaRecorder API

## Local Run

### Frontend

From the project folder:

```bash
./serve.sh
```

Or:

```bash
python3 server.py
```

Then open:

```text
http://localhost:3000
```

### Backend

From [/Users/florah/Desktop/pte/backend](/Users/florah/Desktop/pte/backend):

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Set `GEMINI_API_KEY` in your backend `.env`. The example variables are listed in [backend/.env.example](/Users/florah/Desktop/pte/backend/.env.example).

For `/api/score-audio`, also configure Google Cloud Speech-to-Text credentials:

```text
GOOGLE_CLOUD_PROJECT=your_gcp_project_id
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json
GOOGLE_STT_LANGUAGE_CODE=en-US
GOOGLE_STT_SAMPLE_RATE_HERTZ=48000
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
SUPABASE_BUCKET_NAME=speaking-recordings
SUPABASE_JWT_SECRET=YOUR_SUPABASE_JWT_SECRET
```

The audio scoring flow is:

```text
Frontend recording
-> POST /api/score-audio
-> Google STT transcription
-> Gemini scoring
-> Supabase Storage upload
-> Supabase speaking_attempts insert
-> JSON response
```

### Frontend API Base URL

The static frontend reads the backend base URL from [js/config/app-config.js](/Users/florah/Desktop/pte/js/config/app-config.js). The default is:

```text
http://localhost:8000
```

To point the frontend at another backend, define `window.__PTE_ENV__.PTE_API_BASE_URL` before the app scripts load.

## Notes

- Chrome is recommended for microphone and speech recognition features.
- On first use, allow microphone access for `localhost:3000`.
- AI scoring now requires sign-in and sends requests to your FastAPI backend instead of calling Gemini directly from the browser.
- Speaking recordings are uploaded to `/api/score-audio`, transcribed on the backend with Google STT, then scored by Gemini.
- After a successful speaking score, the backend stores the original audio in the `speaking-recordings` bucket and writes a durable row to `speaking_attempts`.
- Gemini credentials must stay in backend environment variables only.

## Project Structure

```text
.
├── app.js
├── index.html
├── styles.css
├── data/
│   └── questions.js
├── js/
│   ├── utils.js
│   ├── scorer.js
│   ├── ai-scorer.js
│   ├── config/
│   └── pages/
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── .env.example
├── serve.sh
└── server.py
```

## Status

This is a personal practice project and is designed for study and training use.
