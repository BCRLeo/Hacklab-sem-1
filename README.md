# Hacklab-sem-1 - Remoire

----
# Setting up the project
Instructions on *running* the project are further down, in the "Building and running the project" section

Ensure that Python 3.12 is installed, as well as pip to allow you to execute "Step 0 - install python libraries".
Then, install Node.js and React. 


---
# Building and running the project
## Step 0 - install python libraries
Assuming you're in the `Hacklab-sem-1` directory, run
```
cd Remoire
```
Once you're in the Remoire directory, run
```
pip install -r requirements.txt
```
and now you should have all the python libraries needed to run this project!

## Step 1 - locating the directory
Assuming you're in the `Hacklab-sem-1` directory, run
```
cd Remoire/frontend
```
to enter the `frontend` directory.

## Step 2 - build static React files
From inside the `/frontend` directory, run
```
npm run build
```
to build the static files from the React code.

## Step 3 - copy static files 
Run the following command
```
cp build/index.html ../app/templates/ && rm -rf ../app/static/* && cp -r build/static/* ../app/static/
```
to copy `build/index.html` to `/app/templates`, and replacing the contents of the `/app/static` directory with the `/frontend/build/static` directory. If prompted to confirm, type `y`.

## Step 4 - running the full web app
In a new terminal, enter `cd Remoire` and run
```
python run.py
```
Click the resulting link to open the web app.

---
# Note
Make sure the `package.json` file has `"proxy": "http://localhost:5000"` (or whatever port the Python runs from)
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

# Go to *Dev branch* for running the project locally, and read the "README.md" in that branch

### If on VS code, run these commands
```
# Fetch all branches from the remote repository
git fetch origin

# Switch to the dev branch
git checkout dev
```
This is the demo branch who's app will be displayed in the *pitch meeting*, as it is the one being *hosted* on Digital Ocean and with out very own domain. The code will (mostly) remain the same, bar some changes that will need to occur during merging of the two branches. You cana give a look at this one if you want to see the configs and everything for webhosting, noting that if you want to run this version locally, it's a massive headache (you can't use vs code, it has to be done from the command line as vs code doesn't like env variables)
