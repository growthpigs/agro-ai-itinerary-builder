import http from 'http';
import net from 'net';

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('OK');
});

server.listen(9999, '127.0.0.1', () => {
  console.log('Server listening on 127.0.0.1:9999');
  
  // Try to connect
  const client = net.connect(9999, '127.0.0.1', () => {
    console.log('✓ TCP connection successful');
    client.end();
    
    // Try HTTP request
    http.get('http://127.0.0.1:9999/', (res) => {
      console.log('✓ HTTP request successful');
      server.close();
      process.exit(0);
    }).on('error', (err) => {
      console.log('✗ HTTP request failed:', err.message);
      server.close();
      process.exit(1);
    });
  });
  
  client.on('error', (err) => {
    console.log('✗ TCP connection failed:', err.message);
    server.close();
    process.exit(1);
  });
});