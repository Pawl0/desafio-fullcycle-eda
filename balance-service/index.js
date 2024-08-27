const { Kafka } = require('kafkajs');
const { PrismaClient } = require('@prisma/client');
const express = require('express');

const app = express()
const config = require('./kafka-config');

console.log("kafka config", config)
const prisma = new PrismaClient();
const kafka = new Kafka({
  brokers: config.kafka.brokers,
});

const consumer = kafka.consumer({ groupId: config.kafka.groupId });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: config.kafka.topic, fromBeginning: true });

  console.log('Conectado ao Kafka');

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const event = JSON.parse(message.value.toString());
        console.log({ event })
        if (event.Name === 'TransactionCreated') {
            const { account_id_from, account_id_to, amount } = event.Payload;

            const accountFrom = await prisma.accounts.findUnique({
                where: { id: account_id_from },
                select: { balance: true }
            })
            const accountTo = await prisma.accounts.findUnique({
                where: { id: account_id_to },
                select: { balance: true }
            })
            console.log({accountFrom, accountTo, amount})
            await prisma.accounts.update({
                where: { id: account_id_from },
                data: { balance: accountFrom.balance.sub(amount) },
            });
            await prisma.accounts.update({
                where: { id: account_id_to },
                data: { balance: accountTo.balance.add(amount) },
            });

            console.log(`Transferindo R$ ${amount.toFixed(2)} da conta ${account_id_from} para a conta ${account_id_to}`);
        }
      } catch (error) {
        console.error('Erro ao processar mensagem:', error);
      }
    },
  });
};

app.get('/balance/:accountId', async (req, res) => {
    const { balance } = await prisma.accounts.findUnique({
        where: { id: req.params.accountId },
        select: { balance: true }
    })
  res.send({
    accountId: req.params.accountId,
    balance
  })
});

app.listen(3003, () => {
  console.log('Server is listening on port 3003!')
});

run().catch(console.error);
