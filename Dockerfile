FROM node:16
LABEL maintainer="wangjunhong <wangjunhong@email.ncu.edu.cn>"
COPY . /xss-front/
WORKDIR /xss-front
RUN ["npm","install"]
CMD ["npm","run", "dev"]