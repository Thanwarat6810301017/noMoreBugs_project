import localtunnel from 'localtunnel';

// Unique permanent subdomain name to prevent 502 collisions
const SUBDOMAIN_NAME = 'luxe-dining-app-2026';

async function startTunnel() {
  console.log(`⏳ Connecting to Public Tunnel (${SUBDOMAIN_NAME})...`);
  try {
    const tunnel = await localtunnel({ 
      port: 5000,
      subdomain: SUBDOMAIN_NAME
    });

    console.log('====================================================');
    console.log('✅ PUBLIC TUNNEL IS NOW LIVE AND STABLE 24/7!');
    console.log('👉 URL:', tunnel.url);
    console.log('====================================================');

    tunnel.on('close', () => {
      console.log('⚠️ Tunnel connection closed. Auto-reconnecting in 2 seconds...');
      setTimeout(startTunnel, 2000);
    });

    tunnel.on('error', (err) => {
      console.error('⚠️ Tunnel error encountered:', err.message);
    });
  } catch (err) {
    console.error('⚠️ Failed to initiate tunnel:', err.message);
    console.log('Retrying connection in 3 seconds...');
    setTimeout(startTunnel, 3000);
  }
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
});

startTunnel();
