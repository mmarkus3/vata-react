
export default {
  locales: [
    "fi",
    "en"
  ],
  extract: {
    input: "**/*.{js,jsx,ts,tsx}",
    output: "i18n/{{language}}/{{namespace}}.json",
    ignore: ['node_modules/**', 'functions/**'],
  }
}