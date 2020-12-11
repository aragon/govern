CREATE TABLE whitelist (
    ID SERIAL PRIMARY KEY,
    PublicKey CHAR(42)           NOT NULL,
    TxLimit   INT DEFAULT 100    NOT NULL,
    Executed  INT DEFAULT 0      NOT NULL
);

CREATE TABLE admins (
    ID          SERIAL    PRIMARY KEY,
    PublicKey   CHAR(42)     NOT NULL,
    PrivateKey  CHAR(64)     NOT NULL
);

INSERT INTO whitelist (PublicKey, TxLimit) VALUES ('0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B', '100');

INSERT INTO admins (PublicKey, PrivateKey) VALUES ('0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B', '3d4ba04a9c7b159a998d146760cba981ea05784404e38c6fa0a2fe852fbdd648');
