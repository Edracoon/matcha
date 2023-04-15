export default {
	verbose: true,
	// extensionsToTreatAsEsm: ['.mjs'], // specify .mjs as ESM extension
	collectCoverageFrom: ["src/**/**.js"],
	testMatch: ['**/tests/api/**/*.js'], // specify .mjs as test file extension	testPathIgnorePatterns: ['/node_modules/'],
	// other configuration options
};
