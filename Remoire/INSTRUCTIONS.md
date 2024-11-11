in `/frontend`, run
```
npm run build
```
to build static files for Flask.

Copy the `build/index.html` file to the `/app/templates` directory. Copy everything inside the `/frontend/build/static` folder to the `/app/static` directory.
```
cp build/index.html ../app/templates/ && cp -r build/static/* ../app/static/
```

To run locally, in `/frontend`, run
```
npm start
```

In `/Remoire`, Run
```
python run.py
```

Make sure the `package.json` file has `"proxy": "http://localhost:5000"` (or whatever port the Python runs from)