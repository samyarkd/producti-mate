# React Guide

## Core Tech: 
- **Vite** for development
- **TailwindCss** for styling
- **@Tanstack/React-Query** for data fetching
- **@Tanstack/Router** for routing (early in development but good enough)
- **ShadCn** for ready to use components
- **Jotai** for global state management

## Foulder Structure

- **src**
  - **components** - All the components - each page has it's own folder of components in there
    - **ui** ShadCn components
  - **hooks** - All the custom hooks
    - **queries** - Data fetching hooks
  - **app** - All the pages (I have tried to look like nextjs)
  - **lib** - All the utility functions
    - **services** - All the services (api calls)
    - **atoms.ts** - All the atoms (Jotai - global state)
  - **main.tsx** - The entry point of the app and providers 


## Api Calls

Overall we use apis for **Reminders** and **Goals**, because we want to send reminders to the user and also we want to have a database for the goals so that we can share them with friends and compete with eachother.

## Todo List

Todo list uses local storage and it's not synced with the database. each 24h we will erase the previous day todo list and start a new one.


