const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Stub @opentelemetry/api — supabase-js tries to dynamically import it
// but Metro resolves all imports at bundle time, including "dynamic" ones.
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  '@opentelemetry/api': path.resolve(__dirname, 'stubs/opentelemetry-api.js'),
};

module.exports = config;
