module.exports = {
  kafka: {
    brokers: ['kafka:29092'],
    // brokers: ['host.docker.internal:9092', 'host.docker.internal:29092', 'localhost:29092'],
    // brokers: ['localhost:9092'],
    groupId: 'wallet',
    topic: 'transactions'
  }
};
