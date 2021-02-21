# [Zero Width Shortener (ZWS)](https://zws.im)

Shorten URLs with invisible spaces.

Or, [configure your own instance](#Self-hosting) to use any other kinds of characters.

## Contributors

### Code Contributors

This project exists thanks to all the people who contribute.
<a href="https://github.com/zws-im/zws/graphs/contributors"><img src="https://opencollective.com/zws/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute][open-collective]]

#### Individuals

<a href="https://opencollective.com/zws"><img src="https://opencollective.com/zws/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute][open-collective]]

<a href="https://opencollective.com/zws/organization/0/website"><img src="https://opencollective.com/zws/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/zws/organization/1/website"><img src="https://opencollective.com/zws/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/zws/organization/2/website"><img src="https://opencollective.com/zws/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/zws/organization/3/website"><img src="https://opencollective.com/zws/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/zws/organization/4/website"><img src="https://opencollective.com/zws/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/zws/organization/5/website"><img src="https://opencollective.com/zws/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/zws/organization/6/website"><img src="https://opencollective.com/zws/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/zws/organization/7/website"><img src="https://opencollective.com/zws/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/zws/organization/8/website"><img src="https://opencollective.com/zws/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/zws/organization/9/website"><img src="https://opencollective.com/zws/organization/9/avatar.svg"></a>

## Self-hosting

### Heroku

[![Deploy to Heroku][deploy-to-heroku-image]][deploy-to-heroku]

Running an instance of ZWS on Heroku is the easiest way to self-host.
You can also stay totally within the free limits of both the [`web` process](https://devcenter.heroku.com/articles/procfile) and the [Heroku Postgres][heroku-postgres] database.
Note that the Hobby Dev (free) plan of [Heroku Postgres][heroku-postgres] has a row limit of 10,000, which might not be enough for your use case.

After you create an app using the above button you'll need to run the database migrations before shortening any URLs.
Read [the migrations section](#Database%20migrations) below.

1. Get the [Heroku Postgres][heroku-postgres] connection URI from
   - [the web interface](https://data.heroku.com/) (select your datastore, "Settings", "Database Credentials", "URI")
   - [the Heroku CLI](https://devcenter.heroku.com/articles/heroku-postgresql#external-connections-ingress)
2. Create a `.env` file and enter in the connection URI

Example:

```env
DATABASE_URL=postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public
```

### [Docker Compose][docker-compose]

1. [Clone the repository](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository)
2. Copy `db.example.env` to `db.env` and fill in the values
3. Copy `example.env` to `.env` and update the `DATABASE_URL` environment variable to match the values in `db.env`
4. Run [`docker volume create --name=zws-postgres-storage`](https://docs.docker.com/engine/reference/commandline/volume_create/)
5. Run [`docker-compose up -d`](https://docs.docker.com/compose/reference/up/) (this will automatically apply database migrations)

### Database migrations

After you create an app using the above button you'll need to run the database migrations before shortening any URLs.
**These are done automatically if you are self-hosting your instance using [Docker Compose][docker-compose]**.

This can be done easily through [Docker Compose][docker-compose] by running the following commands:

```sh
docker volume create --name=zws-postgres-storage
docker-compose up migration
docker-compose down
```

Even if your database isn't being run through [Docker Compose][docker-compose] you'll still need to create the volume and start the `db` service.
You can delete the volume right after.
If you know a better way to do this, please open a pull request!

[deploy-to-heroku]: https://dashboard.heroku.com/new?template=https://github.com/zws-im/zws/tree/v2
[deploy-to-heroku-image]: https://www.herokucdn.com/deploy/button.svg
[heroku-postgres]: https://www.heroku.com/postgres
[docker-compose]: https://docs.docker.com/compose/
[open-collective]: https://opencollective.com/zws/contribute
