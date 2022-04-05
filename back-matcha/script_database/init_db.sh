mysql -u root --password=passwd matcha -e "CREATE TABLE IF NOT EXISTS USER (
      ID INT(11) PRIMARY KEY AUTO_INCREMENT NOT NULL COMMENT 'Identifiant utilisateur',
      LOGIN VARCHAR(30) NOT NULL COMMENT 'Login',
      PWD TEXT NOT NULL COMMENT 'Mot de passe crypté',
      NOM VARCHAR(50) NOT NULL COMMENT 'Nom',
      PRE VARCHAR(30) NOT NULL COMMENT 'Prénom',
      EMAIL VARCHAR(100) NOT NULL COMMENT 'e-mail',
      GENRE VARCHAR(1) NOT NULL COMMENT 'Genre (Homme,Femme,Autre)',
      BIO TEXT NOT NULL COMMENT 'Bio courte',
      LASTIP TEXT NOT NULL COMMENT 'Dernière IP utilisée pour localisation si besoin',
      ADR1 VARCHAR(100) NOT NULL COMMENT '1° partie de l adresse',
      ADR2 VARCHAR(100) NOT NULL COMMENT 'Adresse partie 2 (loc géo)',
      CODPOS VARCHAR(10) NOT NULL COMMENT 'Code postal (loc géo)',
      VILLE VARCHAR(50) NOT NULL COMMENT 'Nom de la ville (loc géo)',
      ONLINE tinyINT(1) NOT NULL COMMENT 'En ligne',
      TRA_ID INT(11) NOT NULL,
      ORI_ID INT(11) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Liste des utilisateurs';"

mysql -u root --password=passwd matcha -e "CREATE TABLE IF NOT EXISTS TRA (
      ID int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL COMMENT 'Identifiant Tranche d''âge',
      MIN INT NOT NULL COMMENT 'âge min',
      MAX INT NOT NULL COMMENT 'âge max',
      ACT BOOL NOT NULL COMMENT 'Tranche d''âge active ou non'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Liste des tranches d''âges des utilisateurs';"

mysql -u root --password=passwd matcha -e "CREATE TABLE IF NOT EXISTS ORI (
      ID int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL COMMENT 'Identifiant orientation sexuelle',
      DESIGN varchar(100) NOT NULL COMMENT 'Désignation orientation sexuelle',
      ACT tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Orientation active ou non'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Toutes les orientations sexuelles possibles et proposées';"

mysql -u root --password=passwd matcha -e "CREATE TABLE IF NOT EXISTS IMG (
      ID int(11) PRIMARY KEY AUTO_INCREMENT  NOT NULL COMMENT 'Identifiant Image',
      USRID int(11) NOT NULL COMMENT 'Identifiant utilisateur',
      FILE BLOB NOT NULL COMMENT 'Nom du fichier image'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Liste des images pour un utilisateur (limiter à 5 par programme)';"

mysql -u root --password=passwd matcha -e "CREATE TABLE IF NOT EXISTS NOTIF (
      ID int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
      USRIDACONSULT int(11) NOT NULL COMMENT 'Utilisateur qui a consulté',
      USRIDESTCONSULT int(11) NOT NULL COMMENT 'Utilisateur qui est consulté',
      DATE TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date de consultation',
      BLK tinyint(1) NOT NULL DEFAULT 0 COMMENT 'USRID consulté est bloqué ou non',
      LIK tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Appréciation pour usr qui est cons'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Liste des notifications/consultations';"

mysql -u root --password=passwd matcha -e "CREATE TABLE IF NOT EXISTS TAG (
      ID int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL COMMENT 'Identifiant #tag',
      DESIGN varchar(100) NOT NULL COMMENT 'Désignation du #tag',
      COD varchar(10) NOT NULL COMMENT 'Code (ou #tag) attribué'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Liste des tags';"

mysql -u root --password=passwd matcha -e "CREATE TABLE IF NOT EXISTS USR_TAG (
      ID int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL COMMENT 'Identifiant couple Utilisateur / #tag',
      USRID int(11) NOT NULL COMMENT 'Identifiant utilisateur',
      TAGID int(11) NOT NULL COMMENT 'Identifiant #tag'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='couples des Utilisateurs / #tag)';"
