FROM node:18-alpine

WORKDIR /app

# Install packages first (better caching)
COPY package*.json ./

RUN npm install

# Copy source code
COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]

hiiii

updated
