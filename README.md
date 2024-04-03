# SMS-API

### Requirement
**Node Version >= 16**

### Set Up

```
yarn install
```
 
### Run Local Development

```
yarn dev
```

### Sync Database (Migrate + Generate + Push)

```
yarn db:sync
```

### Seed Database

```
yarn db:seed
```

### Open Prisma Studio

```
yarn db:studio
```


### Setup Database Local **DOCKER** (In case want to test own data)

```
docker compose up
``` 

Set env (**DATABASE_URL**) -> postgres://postgres:postgres@localhost:5432/postgres?schema=sms_dev#   N o d e J s - S M S - A P I  
 