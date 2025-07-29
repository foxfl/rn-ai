const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add `.gguf` to asset extensions for bundling:
config.resolver.assetExts.push('gguf');
// Enable asset hashing plugin:
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];

module.exports = withNativeWind(config, { input: './global.css' });
