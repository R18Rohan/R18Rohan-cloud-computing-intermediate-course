import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Express API server running on port: ${PORT}`);
  console.log(`🏥 Health check path: http://localhost:${PORT}/api/health`);
  console.log(`👥 Users database API: http://localhost:${PORT}/api/users`);
  console.log(`=========================================`);
});
