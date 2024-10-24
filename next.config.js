const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase) => {
	const isDev = phase === PHASE_DEVELOPMENT_SERVER;

	const config = {
		reactStrictMode: true,
		pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
		compress: true, 
		productionBrowserSourceMaps: true,
		images: {
			domains: ['images.unsplash.com', 'assets.aceternity.com'],
		  },
		experimental: {
			reactCompiler: true,
		},
		bundlePagesRouterDependencies: true,
	};

	if (isDev) {
		config.devIndicators = {
			buildActivityPosition: "top-right",
			experimental: {
				webVitalsAttribution: ["CLS", "LCP"],
			},
		};
	}

	return config;
};
