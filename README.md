# GradQuest

A web and mobile platform that helps students discover, shortlist, and manage master's program applications. The app matches students to best-fit programs based on their preferences and constraints (funding, location, deadlines), and automates busywork like requirement tracking and deadline reminders.

This repository contains the front-end for the application where the students sign in, complete their profile intake, get program recommendations, save target programs, and receive reminders.

---

## Key features

- OAuth2 login (Discord / GitHub) for secure sign-in
- Student user profiles with preference intake (target countries, budget, funding needs, deadlines, etc.)
- Generates a top-5 program match list based on user preferences (drawn from 60+ universities in the database)
- Saved Applications page to keep track of the schools you plan to apply to
- Reminders page to view and receive notifications for important application deadlines and requirements
- Responsive UI optimized for web and mobile devices
- Role model: students (current release focuses on student role)

---

## How it works 

1. User signs in via OAuth2 (Discord/GitHub).
2. On first login the user completes the profile intake — selects target countries, budget, program preferences and constraints.
3. The matching engine (backend) scores available programs (60+ universities) and returns the top 5 best-fit programs for the student's profile.
4. Students can save programs as "Saved Applications" and track document requirements for each application.
5. The system schedules and delivers reminders for upcoming deadlines and outstanding requirements (reminders are sent in advance and can be configured by the user).

Note: This repository contains the front-end only. The matching logic, reminders scheduling, and persistent data storage live on the backend API. The front-end calls that API to authenticate users, fetch program data, and manage reminders/saved applications.

---

## Tech / tools (front-end)

- Framework: React Native with Expo
- Language: TypeScript + JavaScript 
- State Management: React Context API (AuthContext, SavedAppsContext)
- HTTP Client: Axios + native fetch

---

## Getting started (developer setup)

Prerequisites:
- Node.js (>= 16 recommended)
- npm or yarn
- OAuth client credentials for GitHub and Discord (client IDs / secrets)
- The backend API URL (for auth and data)

Quick start (example commands — adapt to your stack):

1. Clone the repo
   - git clone https://github.com/LestDomzEDU/Project-3-Front-End.git

2. Install dependencies
   - npm install
   
3. Start the dev server
   - npm start

3. Open the app in your browser (usually http://localhost:3000)
