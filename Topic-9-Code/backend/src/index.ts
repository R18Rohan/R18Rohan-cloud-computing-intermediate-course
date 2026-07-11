import app from './app';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🔌 Topic 9 API Server running on port: ${PORT}`);
  console.log(`=========================================`);
});
