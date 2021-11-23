module.exports = {
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  transform: {
    '.+\\.t$': 'ts-jest'
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
}