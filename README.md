# Live website at Remoi.re

# Hacklab-sem-1 - Remoire

----
# Setting up the project
Instructions on *running* the project are further down, in the "Building and running the project" section

*disclaimer* This code is being hosted, so to run locally, some minor changes need to be made to the code (one line needs to be commented out), I will go over it in the following section)
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

## Step 1 - setting up to run locally

in the Remoire/app folder, in init_db.py and run.py uncomment the line os.env line to set your environment to development, then run the init_db.py file to innitialise a db locally 


## Step 2 - locating the directory
Assuming you're in the `Hacklab-sem-1` directory, run
```
cd Remoire/frontend
```
to enter the `frontend` directory.

## Step 3 - build static React files
From inside the `/frontend` directory, run
```
npm run build
```
to build the static files from the React code.

## Step 4 - copy static files 
Run the following command
```
cp build/index.html ../app/templates/ && rm -rf ../app/static/* && cp -r build/static/* ../app/static/
```
to copy `build/index.html` to `/app/templates`, and replacing the contents of the `/app/static` directory with the `/frontend/build/static` directory. If prompted to confirm, type `y`.

## Step 5 - running the full web app
In a new terminal, enter `cd Remoire` and run
```
python run.py
```
Click the resulting link to open the web app.
You will have to signup, the password needs to consist of at least 8 charachters, one upper case letter and one number one special charachter

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


