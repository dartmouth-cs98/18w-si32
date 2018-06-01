# Monad Web API

The web API component of Monad.

## Building and Running

1. Copy `.env.example` to `.env` and update variables as desired. See below for S3 related setup.
2. Within the `api/` directory, run `npm run build` (which runs `docker-compose build`)
3. Run `npm run up` (or `docker-compose up`), which will launch all needed containers (mongo, redis, and node)
4. The API should then be running at localhost:3000

## S3 Configuration

You'll need two separate S3 buckets: one to store bot code, and another to store match results. The example `.env` file
names those buckets "s3-bots" and "s3-matches" respectively, but you can choose whatever you like as long as it 
matches what is in `.env`. 

The matches bucket needs to have CORS enabled. The default configuration, also provided below, will suffice.
```
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <MaxAgeSeconds>3000</MaxAgeSeconds>
    <AllowedHeader>Authorization</AllowedHeader>
</CORSRule>
</CORSConfiguration>
```

Once the buckets are created and configured, set the corresponding keys in `.env` as well.  

## Deployment

You'll need a Mongo server and a Redis server. 
Be sure to set the .env variables to point at those servers.

To push the API code to a Heroku instance: from within this directory, run `heroku container:push web -a APPNAME`,
followed by `heroku container:release web -a APPNAME` to deploy to the application at APPNAME.  

At present, the live Heroku app is `lit-mountain-10578` and the dev one is `si32-dev`. 


