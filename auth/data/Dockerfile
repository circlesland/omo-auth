FROM postgres

ENV POSTGRES_DB=omo-auth
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV PGPASSWORD=postgres

COPY src/migrations/20200910090423-1/create.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
