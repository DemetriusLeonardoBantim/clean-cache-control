module.exports = {
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  transform: {
    '.+\\.t$': 'ts-jest'
  },
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-typescript',
  ],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
}