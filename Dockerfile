# Dockerfile

FROM node:14.4.0
RUN mkdir -p /opt/app
WORKDIR /opt/app
RUN adduser --disabled-password app
COPY contract-balanceof/ .
RUN chown -R app:app /opt/app
USER app
RUN  npm install --no-optional --no-shrinkwrap --no-package-lock
RUN npm install pm2 
EXPOSE 3000
CMD [ "npm", "run", "pm2" ]
