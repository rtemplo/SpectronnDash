require('dotenv').config();
const express = require("express");
const keys = require('./config/keys');
const { postgraphile } = require("postgraphile");

const PORT = process.env.PORT || 3001;
const app = express();
const env = process.env.NODE_ENV || 'development';

// This Postgres config must be preceeeded by the creation of a both a Heroku application and a Heroku Postgres database within that application 
// The Heroku application can be created by the heroku-cli. Note the application name.
// The Heroku Postgres database is best installed online in within the Heroku dashboard for the application you created.
// The .env file on the root contains the local values needed for development but is filtered by gitignore when deploying
// To supply values in production you will have to install Heroku Postgres on the Heroku application instance you created
//  From the Postgres installation in your application under Resources you can retrieve the values supplied in the dashboard
//  In the Heroku dashboard for the Heroku app you created go Settings tab and click Reveal Config Vars
//  Add the values the keys below and use the values supplied from the Heroku Postges installation
const postgresConfig = {
  user: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DATABASE
}

app.use(postgraphile(
  postgresConfig,
  "app_public",
  {
    graphiql:true, 
    enableCors: true,
    watchPg: true,
    jwtPgTypeIdentifier: "app_public.jwt_token",
    jwtSecret: process.env.JWT_SECRET,
    pgDefaultRole: process.env.POSTGRAPHILE_DEFAULT_ROLE
  }
));

if (env === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    console.log(req.url)
    // const path = require('path');
    // res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}

const server = app.listen(PORT, () => {
  console.log(`
  Environment: ${env}
  postgresConfig: ${postgresConfig}
  `);
});