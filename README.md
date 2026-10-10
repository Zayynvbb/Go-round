# Go-round

Basically Airbnb, if Airbnb was built by one student with Express, MongoDB and a lot of Stack Overflow tabs.

**Live:** [https://go-round.onrender.com]

Heads up: it runs on Render's free plan, so if nobody has visited in a while, the first load takes around 50 seconds. It's not broken, it's just waking up. Give it a minute.

## What you can do on it

Sign up, log in, post a place with photos, see where it is on a map, edit it or delete it, and leave reviews. If you type something wrong in a form, you get a proper error message instead of a crash.

## How it's built

Express 5 on Node 22 runs the server, Mongoose talks to MongoDB, and the pages are rendered with EJS (ejs-mate for the layouts).

Logins use Passport with passport-local-mongoose, so passwords are hashed and salted and never stored as plain text. Sessions live in MongoDB through connect-mongo, so a server restart doesn't log everyone out. Photos go through Multer to Cloudinary, locations come from Mapbox, and Joi checks every form before it gets anywhere near the database.

The code is split MVC style: `routes` pass requests to `controllers`, which use `models` and render `views`. `middleware.js` has the "are you logged in?" and "is this actually yours?" checks, and `schema.js` has the Joi rules.

## Run it yourself

You need Node 22, a MongoDB connection string (Atlas is fine) and free Cloudinary and Mapbox accounts.

```bash
git clone https://github.com/Zayynvbb/Airbnb-.git
cd Airbnb-
npm install
```

Make a `.env` file in the root:

```env
ATLASDB_URL=your_mongodb_connection_string
SECRET=any_long_random_string
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
MAP_TOKEN=your_mapbox_token
```

Optional, to fill the site with sample listings:

```bash
node init/index.js
```

Then start it:

```bash
node app.js
```

and open http://localhost:8080

## Not done yet

Bookings and payments, search and filters, and a proper set of tests (my `package.json` still says "no test specified").

Built by ZAINAB. More of my stuff is at [github.com/Zayynvbb](https://github.com/Zayynvbb).
