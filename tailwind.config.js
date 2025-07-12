/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}' // Isso cobre seus arquivos .js, .jsx, .ts, .tsx na pasta src
  ],
  theme: {
    extend: {
      // Aqui você pode estender o tema padrão do Tailwind
      // Por exemplo, definir suas cores azul e branco
      colors: {
        'planning-blue': '#1a73e8', // Um tom de azul Google
        'planning-white': '#f8f9fa' // Um branco suave
      }
    }
  },
  plugins: []
}
