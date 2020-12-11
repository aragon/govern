CREATE TABLE whitelist {
    ID int NOT NULL AUTO_INCREMENT,
    PublicKey char(42) NOT NULL,
    "Limit" int DEFAULT 100 NOT NULL,
    Executed int DEFAULT 0 NOT NULL,
    PRIMARY KEY (id)
};

CREATE TABLE admins {
    ID int NOT NULL AUTO_INCREMENT,
    PublicKey char(42) NOT NULL,
    PrivateKey char(64) NOT NULL,
    PRIMARY KEY (id)
};

INSERT INTO whitelist (PublicKey, "Limit") VALUES ("0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B", 100)

INSERT INTO admin (PublicKey, PrivateKey) VALUES ("0x6FA59C2C8EAaCC1f8875794f2DAe145Bb32Bd9B1", "3d4ba04a9c7b159a998d146760cba981ea05784404e38c6fa0a2fe852fbdd648")
