FROM golang:latest

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY *.go ./
COPY . ./

RUN CGO_ENABLED=0 GOOS=linux go build -o /jmap-api

#ENV

EXPOSE 1323

CMD ["/jmap-api"]