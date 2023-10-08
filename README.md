# ProductiMate
<div>
<a style="margin-inline:auto" alt="ProductiMate logo" href="https://t.me/Productimatebot" target="_blank" rel="noreferrer"><img src="./apps/producti-mate/public/1.png" width="90"></a>
</div>
[ProductiMate](https://t.me/Productimatebot)


ProductiMate is a productivity app that helps you manage your time and tasks. It is built using **Nx**, **React**,  **ExpressJs**, **GrammyJs** and **Prisma**.

This is the MVP version and it has 4 core features:

- **Pomodoro Timer** - A timer that helps you focus on your tasks by using the Pomodoro Technique.
- **To-Do List** - A list of tasks that you can add, edit and delete.
- **Reminders** - Add reminders get right on telegram.
- **Goals** - Goals are tasks that you want to achieve in a certain time period (In MVP daily). You can add, edit and delete goals. and also share them with your friends and compete with eachother.

## React App docs
[Read the React app docs](./apps/producti-mate/README.md)

## Express App docs
[Read the ExpressJs app docs](./apps/productimate-api/README.md)


## Structure
We used *Nx* as our monorepo manager because we are mostlikely going to have a Telegram Bot and we do. It helps us to manage our codebase and also to scale it in the future. We have 3 main projects in our monorepo:

- **Producti-Mate** - The main project that contains the frontend code in React.
- **ProductiMate-api** - The backend server that is built using Expressjs.
- **ProductiMate-telegram-bot** - The telegram bot that is built using Grammyjs.

We also have *Prisma* as our ORM since it's an MVP we just SQLite as our database.


## Start the app

### 1. Install dependencies
`npm install`

### 2. Prisma scheme sync with database
`npx prisma db push`

### 3. Environment variables
Copy the `.env.example` file and rename it to `.env` and fill the variables.

### 4. Start the app in development
Before starting checkout the `package.json` for the scripts.

- **dev** - npm run dev -- starts all three projects altogether
- **dev:web** - npm run dev:web -- starts the frontend project
- **dev:api** - npm run dev:api -- starts the backend project
- **dev:bot** - npm run dev:bot -- starts the telegram bot project
- **build** - npm run build -- builds all three projects

Run `npm run dev` to start the app in development mode. 
- front starts at `http://localhost:4200`
- api starts at `http://localhost:3000/api`
- bot starts working

### 5. Lookout for CORS error
Open telegram on the web and install the CORS extention and do the development there.

### 6. Open the Bot 
Open telegram and search for `@ProductiMateBot` and start using it.


## Start Production

### 1. Do all the steps in the previous section until step 4.

### 2. Build the app
`npm run build`

This command will build all three projects and put the build files in the `dist` folder.

### 3. Install pm2 and serve
`npm install pm2 -g` and `npm install serve -g`

### 4. Env variables
We have to set environment variables for all three of them. so copy the .env file into their location.

- `cp .env dist/apps/productimate-api/.env`
- `cp .env dist/apps/bot/.env`
- `cp .env dist/apps/producti-mate/.env`

### 5. Start the app
Open 3 terminals and run the following commands in each one of them.

- `pm2 start dist/apps/productimate-api/main.js`
- `pm2 start serve dist/apps/producti-mate/ -l <PORT>` Set a port other than 3000
- `pm2 start dist/apps/bot/main.js`

### 6. Configure nginx
Set up nginx in a way that it will redirect on location `/` to `localhost:<PORT>` of where TWA is running and also on location `/api` it should redirect to `localhost:3000`.

You can use Nginx, Apache or etc. as long as it does what mentioned above.
