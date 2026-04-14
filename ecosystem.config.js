module.exports = {
  apps: [
    {
      name: 'dd-products',
      script: 'cmd.exe',
      args: '/c npm start',
      cwd: '.',
      autorestart: true,
      watch: false,
      max_restarts: 20,
      env: {
        NODE_ENV: 'production',
        PORT: '3000'
      }
    }
  ]
}
