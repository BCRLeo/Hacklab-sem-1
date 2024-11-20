# Setting up the project
Ensure that Python 3.12 is installed. Additionally, make sure that Flask (and some additional modules that will become clear when attempting to run) are installed. Then, install Node.js and React.

---
# Project info
## Front-end
All front-end development takes place in `Remoire/frontend/src`. `App.js` is the main component that is mounted on the DOM when running the web app. Component files follow PascalCase naming conventions and should be named `ComponentName.js` inside a folder `ComponentName` within the `components` directory. Any styling should be done in a corresponding CSS file `ComponentName.css` stored in the same `ComponentName` folder. Additionally, page component files are named `NamePage.js` in a folder `Page`. For example,
```
/src
  /components
    /Carousel
      -Carousel.css
      -Carousel.js
    /Button
      -Button.css
      -Button.js
  /pages
    /Home
      -HomePage.css
      -HomePage.js
```
## Integration
To access back-end features, you have to create an API call with an address `/api/function-name`.

---
# Version control
Every individual change or feature (i.e. adding a button to the wardrobe page, styling the nav bar) should be be a separate Git commit to ensure safety of code and ease of integration.

---
# Building and running the project
## Step 0 - locating the directory
Assuming you're in the `Hacklab-sem-1` directory, run
```
cd Remoire/frontend
```
to enter the `frontend` directory.

## Step 1 - build static React files
From inside the `/frontend` directory, run
```
npm run build
```
to build the static files from the React code.

## Step 2 - copy static files 
Run the following command
```
cp build/index.html ../app/templates/ && cp -r build/static/* ../app/static/
```
to copy `build/index.html` to `/app/templates` and the contents inside the `/frontend/build/static` folder to the `/app/static` directory.

## Step 3 - running the full web app
To run the web app locally, while still in `/frontend`, run
```
npm start
```

Then, in a new terminal, enter `cd Remoire` and run
```
python run.py
```
Click the resulting link to open the web app.

---
# Note
Make sure the `package.json` file has `"proxy": "http://localhost:5000"` (or whatever port the Python runs from)


for db migrations these are the commands you need to run:
for mac/linux (non of use linux but whatever):
```
export FLASK_APP=run.py
```
for windows :
```
set FLASK_APP=run.py
```
once that's done, run these two commands:
```
flask db migrate -m "Initial migration."
flask db upgrade
```
NOTE: make sure to add unique constraint names if your new attributes have constraints or alembic will pull a hissy fit (there's a comment in models reminding you to do that as well)

