CREATE TABLE whitelist {
    ID int NOT NULL AUTO_INCREMENT,
    PublicKey char(42) NOT NULL,
    "Limit" int DEFAULT 100 NOT NULL,
    Executed int DEFAULT 0 NOT NULL,
    PRIMARY KEY (id)
};

CREATE TABLE admin {
    ID int NOT NULL AUTO_INCREMENT,
    PublicKey char(42) NOT NULL,
    PrivateKey char(66) NOT NULL,
    PRIMARY KEY (id)
};
