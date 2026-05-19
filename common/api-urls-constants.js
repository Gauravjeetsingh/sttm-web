const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  BANIS: isProduction
    ? 'https://api.banidb.com/v2/banis'
    : 'https://api.khajana.org/v2/banis',
  PRODUCTION: 'https://api.banidb.com/v2/',
  DEVELOPMENT: 'https://api.khajana.org/v2/',
  AMRIT_KEERTAN: 'https://api.banidb.com/v2/amritkeertan',
  AMRIT_KEERTAN_SHABADS: 'https://api.banidb.com/v2/shabads',
  BANNERS: 'https://api.sikhitothemax.org/messages/web',
  SYNC: {
    PRODUCTION: 'https://api.sikhitothemax.org/',
    LOCAL: 'https://stgapi.sikhitothemax.org/',
  },
  CEREMONIES: 'https://api.sikhitothemax.org/ceremonies/',
  DOODLE: 'https://api.sikhitothemax.org/doodle/',
  WRITERS: 'https://api.banidb.com/v2/writers/',
  GURBANIBOT: 'http://localhost:5006/',
  SP_API: 'https://serviceprovider.khalis.net',
  SHABAD_REVIEW_API:'https:///sodh-api.banidb.com/',
};
