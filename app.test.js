const request = require('supertest');
const app = require('./app');

describe('Sample App', () => {
  test('GET / returns an HTML page', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
    expect(res.text).toContain('Hello from Jenkins CI/CD Pipeline');
  });

  test('GET /api/info returns JSON with expected fields', async () => {
    const res = await request(app).get('/api/info');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('hostname');
    expect(res.body).toHaveProperty('version');
  });

  test('GET /health returns ok status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});