# Vega

This exercise showcases a modular frontend with a reactive core, custom router and authentication. It also includes custom charts made with D3js and React. 

The focus was put on these areas instead of the css and visual aspect, given more time more polish would be put on the aesthetics and design but it was decided to focus on the architecture. In case it is useful, I already have other [demos](https://fernandopayala.com) showcasing layout and visual design. In the same vein white labeling and theming has been left out of the exercise.

## Project Folders
This project has two folders:
- backend
- frontend
Backend holds a test server meant for this exercise, a minimal expressjs app for Authorization and some mock endpoints.
The frontend folder contains the main part of this exercise, a React SPA with a scalable, modular architecture.

## Installation

### Env variables
#### Step 1: Rename .env.example to .env
Firstly, rename the .env.example files found at both backend and frontend folders to .env . This deals with the necessary environment variables.

#### Step 2: Backend - install deps & run

```bash
    cd backend; npm i ; node server.js
```
#### Step 3: Frontend - install deps & run
```bash
    cd frontend; npm i; npm run start
```

#### Step 4: demo username and password
You can always change them at the backend/server.js file but these are the initial defaults:

```js
{
    username: 'test'
    password: 'password'
}
```

## Source Code Stucture
The source code contains the following main parts:
- core (infrastructure and services): 
    - Router, Authenticaton, and Gateways
- modules (business & presentation logic): 
    - Stores and Presenters for each module of the application
- components (markup / view layer): 
    - Markup of the application

## Testing
A minimal test was created, on the fontend/tests folder, though the main point of the architecture used in this exercise is to facilitate testing. In this instance they have been left out in order to speed up the exercise, ideally we would be starting with tests even before implementation.

Pending to complete are tests for:
- router
- authentication
- portfolio module

## Lack of Eslint, husky, prettier
This aspects where intentionally ignored in this exercise, if you need to check an example of this you may do so at [this other test](https://github.com/ferpar/inditext-tst) 

## In Retrospect
This tech proof could've been yet another example of a Nextjs or Tanstack Router / Query frontend with tailwind styles and hooks. I decided to take a different approach and create an architecture based on observables instead. I have found this to be a far more scalable and maintainable variant, it also happens to be very performant.

But it also comes at a higher initial cost so I would only use it on applications with enough responsibility to justify it. Specially those which also need to work offline and sync when possible.

## Pending Improvements
- listen to changes on currentRoute from the portfolioStore, cleaning up the router so that it has only one responsibilty: routing. This can be done via the .onChange listener provided by legend-state.
- improve css and add white labeling
- add datapoints to history graph, select different dates for the portfolio via the datapoints on the history graph
- ... there can always be more ^^'...