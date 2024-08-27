const { Kafka } = require('kafkajs');
const { PrismaClient } = require('@prisma/client');
const config = require('./config');

const prisma = new PrismaClient();
const kafka = new Kafka({
  brokers: config.kafka.brokers,
});

const consumer = kafka.consumer({ groupId: config.kafka.groupId });

// Função principal
const run = async () => {
  // Conectando ao Kafka
  await consumer.connect();
  await consumer.subscribe({ topic: config.kafka.topic, fromBeginning: true });

  console.log('Conectado ao Kafka');

  // Consumindo mensagens
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const event = JSON.parse(message.value.toString());
        const { accountId, balance } = event;

        // Atualizando ou criando a conta
        await prisma.account.upsert({
          where: { accountId },
          update: { balance },
          create: { accountId, balance },
        });

        console.log(`Saldo da conta ${accountId} atualizado para ${balance}`);
      } catch (error) {
        console.error('Erro ao processar mensagem:', error);
      }
    },
  });
};

run().catch(console.error);
