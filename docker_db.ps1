docker run -d `
    --name postgres-db `
    -e POSTGRES_PASSWORD=secretpasswd `
    -e POSTGRES_DB=postgres `
    -p 5432:5432 `
    postgres
