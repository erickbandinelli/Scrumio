const Footer = () => (
  <footer className="w-full text-center py-4 text-gray-600 text-sm mt-auto">
    &copy;{' '}
    <a
      href="https://www.linkedin.com/in/erick-de-oliveira-b592228b/"
      target="_blank"
      className="text-gray-600 hover:planning-blue"
    >
      Erick de Oliveira
    </a>{' '}
    {new Date().getFullYear()} Scrumio Poker. Todos os direitos reservados.
  </footer>
)

export default Footer
