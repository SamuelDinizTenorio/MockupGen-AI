# Estágio 1: Build da aplicação
FROM node:18-alpine AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de definição de pacotes e instala as dependências
COPY package*.json ./
RUN npm install

# Copia o restante do código-fonte
COPY . .

# Define o argumento para a chave da API
ARG GEMINI_API_KEY
# Define a variável de ambiente para ser usada no build
ENV VITE_GEMINI_API_KEY=$GEMINI_API_KEY

# Executa o build da aplicação
RUN npm run build

# Estágio 2: Servidor de produção
FROM nginx:stable-alpine

# Copia os arquivos gerados no build para o diretório do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia o arquivo de configuração do Nginx
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
