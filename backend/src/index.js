import http from 'http';
import redis from 'redis';

const hostname = '0.0.0.0';
const port = 80;


process.on('SIGINT', function() {
  process.exit();
});

const server = http.createServer((req, res) => {
  if(req.url !== '/') {
    res.statusCode = 404;
    res.end();
    return;
  }

  const client = redis.createClient('redis://redis');

  client.multi()
    .setnx('counter', '0')
    .incr('counter')
    .exec((redisError, redisResponse) => {
      res.setHeader('Content-Type', 'text/plain');
      if(redisError) {
        res.statusCode = 500;
        return;
      }
      res.statusCode = 200;
      res.end('Hello World visitor number: ' + redisResponse[1] + '\n');
    });
});

server.listen(port, hostname, () => {
  console.log(`Server running...`);
});