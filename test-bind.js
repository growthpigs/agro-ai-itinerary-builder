import net from 'net';

// Test different binding addresses
const addresses = ['127.0.0.1', 'localhost', '0.0.0.0', '::1'];

addresses.forEach(addr => {
  const server = net.createServer();
  const port = 9000 + addresses.indexOf(addr);
  
  server.listen(port, addr, () => {
    console.log(`✓ Successfully bound to ${addr}:${port}`);
    server.close();
  });
  
  server.on('error', (err) => {
    console.log(`✗ Failed to bind to ${addr}:${port} - ${err.message}`);
  });
});