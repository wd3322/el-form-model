module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    node: true
  },
  plugins: [
    'vue'
  ],
  extends: [
    'plugin:vue/recommended',
    'eslint:recommended'
  ],
  rules: {},
  parserOptions: {
    'parser': 'babel-eslint'
  }
}
