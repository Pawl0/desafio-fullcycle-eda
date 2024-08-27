-- Insere os clientes ignorando conflitos de chave única
INSERT IGNORE INTO clients (id, name, email)
VALUES
    ('532fe986-9602-49fc-9522-d5b883d4694a', 'Joao Neves', 'joao@neves.com');

INSERT IGNORE INTO clients (id, name, email)
VALUES
    ('b4e73e51-626a-420d-b92d-795693b6f0bf', 'John Doe', 'john@doe.com');

-- Insere as contas associadas aos clientes, usando os IDs dos clientes inseridos
-- Verifica a existência dos clientes e insere contas
INSERT INTO accounts (id, client_id, balance)
SELECT '532fe986-9602-49fc-9522-d5b883d4694a', id, 100
FROM clients
WHERE email = 'joao@neves.com'
ON DUPLICATE KEY UPDATE id = VALUES(id), client_id = VALUES(client_id), balance = VALUES(balance);

INSERT INTO accounts (id, client_id, balance)
SELECT 'b4e73e51-626a-420d-b92d-795693b6f0bf', id, 200
FROM clients
WHERE email = 'john@doe.com'
ON DUPLICATE KEY UPDATE id = VALUES(id), client_id = VALUES(client_id), balance = VALUES(balance);
