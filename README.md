- Download or clone the repository
- Run `npm install` inside
- Run `npm start`
- Open up http://localhost:5000 in your browser
- Open up another window and play!

Controls are W or UP to move towards mouse and click to shoot.
Score is like Health, start from "const LIFE = 100;" and reduced after each hit.
Sound is added for shooting.
Game over condition added.
Healthbars are added.

How to setup ES Lint
ESLint has been enforced following Air BnB guidlines. 
To initialize go to the project root folder in terminal and type:
`npm install`
Then:
`./node_modules/.bin/eslint --init`

**How to automatially fix typo, spacing, indents, and semicolons in terminal**
Go to project root folder:
`npx eslint --fix {Route of file}`
For example:
`npx eslint --fix public/js/game.js`

**To Disable ES Lint on a specific file**
Add below comment to the top of your file:
`/* eslint-disable */`

**EsLint Visual Studio Code extension is recommended**

Screenshot
![alt text](misc/screen-snapshot-multi.png 'screenshot')
