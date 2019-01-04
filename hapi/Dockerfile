FROM nodesource/trusty:6.2.0

RUN npm install -g nodemon

# cache package.json, npm-shrinkwrap.json and modules to speed up builds
ADD package.json package.json
# ADD npm-shrinkwrap.json npm-shrinkwrap.json
# RUN echo "==> NODE_ENV="$NODE_ENV

# disable progress bar to speed up installation https://github.com/npm/npm/issues/11283
RUN npm set progress=false

# force dev packages installation
RUN npm install --only=dev
RUN npm install

# Add your source files
ADD . .

EXPOSE 8000
CMD ["npm","start"]
