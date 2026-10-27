module.exports = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'ai90s.site' }],
        destination: 'https://www.ai90s.site/:path*',
        permanent: true,
      },
    ];
  },
};
