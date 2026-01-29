TAMU - Weekly Meal Planner

A simple and interactive web app for planning meals and generating shopping lists. Built with Vue 3 on the frontend and Node.js on the backend. Recipes are loaded from a YAML file, and users can quickly plan a week of meals with a single click.

Features

Recipe Overview: Browse all available recipes with images and names.

Weekly Planner: Randomly generate a weekly plan of 7 dishes.

Shopping List: Automatically generate a shopping list from the planned recipes.

Responsive UI: Works on desktop and mobile devices.

Reusable Components: Buttons and cards are reusable throughout the app for consistency.

Project Structure
client/                # Vue 3 frontend
 ├─ src/
 │   ├─ components/    # Reusable components (BaseButton, ShoppingList)
 │   ├─ views/         # Pages (Overview.vue, PlanWeek.vue)
 │   ├─ assets/        # Images, logo
 │   └─ router/        # Vue Router setup
server/                # Node.js backend
 ├─ api/               # API routes for recipes
 └─ recipes.yaml       # Recipe data

Installation
Backend
cd server
npm install
npm run dev   # Starts the Node.js server

Frontend
cd client
npm install
npm run dev   # Starts the Vue development server

Usage

Open the app in your browser (default: http://localhost:5173/).

View all recipes on the Overview page.

Click Plan Week to generate a weekly plan.

Click Make Shopping List to create a list of ingredients for the week.

Technologies

Frontend: Vue 3, TypeScript, SCSS

Backend: Node.js, Express (or any Node API setup)

Data: YAML file for recipes

Routing: Vue Router

Contributing

Fork the repository.

Create a new branch: git checkout -b feature-name

Make your changes and commit: git commit -m "Add feature"

Push to the branch: git push origin feature-name

Submit a pull request.

License

MIT License © 2026
