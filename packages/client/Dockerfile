FROM node:16.15.0-alpine3.15
# create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# imstalling dependancy
# COPY package*.json .
# COPY yarn.lock .
# RUN npm install 
#copying source code
 COPY ./ ./
 # Buildng app
 RUN npm install
 RUN npm run build
#  RUN yarn build 
 EXPOSE 3000
 # Running the app
 CMD ["npm", "run", "start" ]