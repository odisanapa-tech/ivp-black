/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Сайт закрыт от индексации целиком, до отдельной команды заказчика.
        // Заголовок дублирует мета-тег: поисковик уважает любой из них,
        // а на файлы (PDF, robots.txt) мета-тег не действует вообще.
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
};

export default nextConfig;
