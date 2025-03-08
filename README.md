# Vega

This exercise showcases a modular frontend with a reactive core that separates logic from rendering. It is an example of the humble object pattern separating complex logic from hard-to-test components (Markup / React).

A custom router was built instead of relying on a framework. Authentication has been implemented via JWT tokens, including refresh tokens as httpOnly secure cookies. Additionally, the Charts were implemented with D3js and Framer Motion. 

Within this architecture, cross-cutting concerns are found in the /core folder
- gateways
- authentication
- router

and the main logic can be found in the /modules folder.
- portfolio

The modules are black boxes and can be tested separately from the markup / rendering of the application. They have the following structure:

Gateway || Store (holds state and main Logic) >> Presenter ( presentation logic) || Markup (React)

Whereby the module comprises the Store and Presenter, whereas Gateways and Markup are on the outside of the blackbox itself. In order to test, it is simple to mock the inputs by stubbing the return of Gateway methods, and check the outputs of the Presenter (additionally one may trigger methods of the presenter to emulate the actions of a user).

The layout and CSS has been left out due to time constraints. In case it is useful, I already have [other projects](https://fernandopayala.com) showcasing layout and visual design. In the same vein white labeling and theming has been left out of the exercise.

## Demo
You may check this project live [here](https://vega-qq8m.onrender.com). 

It might take a up to a minute for the server to spin up if it had been shut down due to inactivity (Render is a free service). On subsequent loads it shouldn't be an issue.

## Local Installation

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


## Project Folders
This project has two folders:
- backend
- frontend
Backend holds a test server meant for this exercise, a minimal expressjs app for Authorization and some mock endpoints.
The frontend folder contains the main part of this exercise, a React SPA with a scalable, modular architecture.


## Source Code Stucture
The source code contains the following main parts:
- core (infrastructure and services): 
    - Router, Authenticaton, and Gateways
- modules (business & presentation logic): 
    - Stores and Presenters for each module of the application
- components (markup / view layer): 
    - Markup of the application

## Testing
Using a reactive state manager allowed for separating Business and Presentation Logic from the Markup Rendering. This enables easier testing of functionality. 

Test were created for core components
- router
- authentication
and modules
- portfolio module

## Lack of Eslint, husky, prettier
These aspects where intentionally ignored in this exercise, if you need to check an example of this you may do so at [this other test](https://github.com/ferpar/inditext-tst) 

## In Retrospect
This tech proof could've been yet another example of a Nextjs or Tanstack Router / Query frontend with tailwind styles and hooks. I decided to take a different approach and create an architecture based on observables instead. I have found this to be a far more scalable and maintainable variant, it also happens to be very performant by rerendering only the necessary components.

But it also comes at a higher initial cost so I would only use it on applications with enough responsibility to justify it. Specially those which also need to work offline and sync when possible.

## Pending Improvements
- improve css and add white labeling
- add datapoints to history graph, select different dates for the portfolio via the datapoints on the history graph
- ... there can always be more ^^'...