const express = require('express');
const os = require('os');
const app = express();
const PORT = process.env.PORT || 3000;

const startTime = Date.now();

function getInfo() {
  return {
    message: 'Hello from Rish Jenkins CI/CD Pipeline!',
    version: process.env.APP_VERSION || 'dev',
    hostname: os.hostname(), // shows the pod name — great for seeing load-balancing across replicas
    uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString()
  };
}

app.get('/', (req, res) => {
  const info = getInfo();
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sample Node App</title>
  <style>
    :root {
      color-scheme: dark;
    }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0f1115;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #e6e6e6;
    }
    .card {
      background: #1a1d24;
      border: 1px solid #2a2e37;
      border-radius: 16px;
      padding: 40px 48px;
      max-width: 480px;
      width: 90%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    }
    .badge {
      display: inline-block;
      background: #22c55e22;
      color: #22c55e;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.05em;
      padding: 4px 10px;
      border-radius: 999px;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 24px;
      margin: 0 0 8px;
    }
    p.sub {
      color: #9099a8;
      margin: 0 0 28px;
      font-size: 14px;
    }
    .rows {
      display: grid;
      grid-template-columns: auto 1fr;
      row-gap: 12px;
      column-gap: 20px;
      font-size: 14px;
    }
    .rows dt {
      color: #9099a8;
      font-weight: 500;
    }
    .rows dd {
      margin: 0;
      color: #e6e6e6;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      text-align: right;
    }
    .footer {
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid #2a2e37;
      font-size: 12px;
      color: #626a78;
    }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">● RUNNING</span>
    <h1>${info.message}</h1>
    <p class="sub">Deployed via Jenkins &rarr; Docker &rarr; Kubernetes (Minikube)</p>
    <dl class="rows">
      <dt>Version</dt><dd>${info.version}</dd>
      <dt>Pod hostname</dt><dd>${info.hostname}</dd>
      <dt>Uptime</dt><dd>${info.uptimeSeconds}s</dd>
      <dt>Server time</dt><dd>${info.timestamp}</dd>
    </dl>
    <div class="footer">Refresh the page a few times — with 2 replicas, the pod hostname should change as Kubernetes load-balances requests.</div>
  </div>
</body>
</html>
  `);
});

// Same data as JSON, for scripts/tests/monitoring
app.get('/api/info', (req, res) => {
  res.json(getInfo());
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Only start the server if run directly (not when imported by tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}

module.exports = app;