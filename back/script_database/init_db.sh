mysql -u root --password=passwd matcha -e "CREATE TABLE IF NOT EXISTS USER (
      ID INT(11) PRIMARY KEY AUTO_INCREMENT NOT NULL COMMENT 'Identifiant utilisateur',
      username VARCHAR(30) UNIQUE NOT NULL COMMENT 'username',
      password TEXT NOT NULL COMMENT 'Mot de passe crypte',
      firstname VARCHAR(30) NOT NULL COMMENT 'Prenom',
      lastname VARCHAR(50) NOT NULL COMMENT 'Nom',
      email VARCHAR(100) UNIQUE NOT NULL COMMENT 'e-mail',
      genre1 ENUM('undefined', 'male', 'female') DEFAULT 'undefined' COMMENT 'Genre de naissance (Homme,Femme)',
      genre2 ENUM('undefined', 'cisgender', 'transgender', 'non binary', 'fluid') DEFAULT 'undefined' COMMENT 'Genre vecu et exprime',
      sexual_orientation ENUM('undefined', 'heterosexual', 'homosexual', 'bisexual', 'pansexual', 'asexual') DEFAULT 'undefined' COMMENT 'Orientation sexuelle',
      bio TEXT COMMENT 'Bio courte',
      last_ip TEXT COMMENT 'Derniere IP utilisee pour localisation si besoin',
      city VARCHAR(50) COMMENT 'Nom de la city (loc geo)',
      country VARCHAR(50) COMMENT 'Nom du pays',
      is_online tinyINT(1) DEFAULT 0 COMMENT 'En ligne',
      tra_id INT(11) COMMENT 'Id tranche d''age',
      fake_counter INT(11) DEFAULT 0 COMMENT 'counter for reported accounts',
      refreshToken TEXT DEFAULT NULL COMMENT 'Token de refresh pour le access token'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Liste des utilisateurs';

    CREATE TABLE IF NOT EXISTS TRA (
      ID int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL COMMENT 'Identifiant Tranche d''age',
      min INT NOT NULL DEFAULT 18 COMMENT 'age min',
      max INT NOT NULL COMMENT 'age max',
      activated BOOL NOT NULL COMMENT 'Tranche d''age active ou non'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Liste des tranches d''ages des utilisateurs';

    CREATE TABLE IF NOT EXISTS IMG (
      ID int(11) PRIMARY KEY AUTO_INCREMENT  NOT NULL COMMENT 'Identifiant Image',
      user_id int(11) NOT NULL COMMENT 'Identifiant utilisateur',
      file BLOB NOT NULL COMMENT 'Nom du fichier image'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Liste des images pour un utilisateur (limiter a 5 par programme)';

    CREATE TABLE IF NOT EXISTS NOTIF (
      id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
      sender_id int(11) NOT NULL COMMENT 'Utilisateur qui a consulte',
      receiver_id int(11) NOT NULL COMMENT 'Utilisateur qui est consulte',
      category ENUM('liked', 'visited', 'message', 'liked_back', 'unliked') NOT NULL COMMENT 'type de la notification',
      date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date de consultation',
      likes tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Appreciation pour usr qui est cons'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Liste des notifications/consultations';

    CREATE TABLE IF NOT EXISTS TAG (
      ID int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL COMMENT 'Identifiant #tag',
      design varchar(100) NOT NULL COMMENT 'Designation du #tag'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Liste des tags';

    CREATE TABLE IF NOT EXISTS USER_TAG (
      ID int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL COMMENT 'Identifiant couple Utilisateur / #tag',
      user_id int(11) NOT NULL COMMENT 'Identifiant utilisateur',
      tag_id int(11) NOT NULL COMMENT 'Identifiant #tag'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='couples des Utilisateurs / #tag';

    CREATE TABLE IF NOT EXISTS ROOM (
      ID int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL COMMENT 'Identifiant couple Utilisateur / #tag',
      user_id1 int(11) NOT NULL COMMENT 'Identifiant utilisateur 1',
      user_id2 int(11) NOT NULL COMMENT 'Identifiant utilisateur 2'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='liste des rooms';

    CREATE TABLE IF NOT EXISTS MESSAGE (
      ID int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL COMMENT 'Identifiant couple Utilisateur / #tag',
      room_id int(11) NOT NULL COMMENT 'id de la room dans lequel le msg est envoye',
      user_id int(11) NOT NULL COMMENT 'Identifiant du sender' ,
      text VARCHAR(255) NOT NULL COMMENT 'Contenu du message',
      date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date d''envoie du message'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='tous les messages de toutes les rooms';

    CREATE TABLE IF NOT EXISTS BLOCK_LIST (
      ID int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL COMMENT 'Identifiant couple Utilisateur / #tag',
      user_id1 int(11) NOT NULL COMMENT 'Id de celui qui bloque',
      user_id2 int(11) NOT NULL COMMENT 'Id de celui qui est bloque'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Liste des bloquages entre users';

    ALTER TABLE NOTIF
      ADD CONSTRAINT NOTIF_ibfk_1 FOREIGN KEY (sender_id) REFERENCES USER (ID),
      ADD CONSTRAINT NOTIF_ibfk_2 FOREIGN KEY (receiver_id) REFERENCES USER (ID);

    ALTER TABLE IMG
      ADD CONSTRAINT IMG_ibfk_1 FOREIGN KEY (user_id) REFERENCES USER (ID);

    ALTER TABLE USER
      ADD CONSTRAINT USER_ibfk_1 FOREIGN KEY (tra_id) REFERENCES TRA (ID);

    ALTER TABLE USER_TAG
      ADD CONSTRAINT USER_TAG_ibfk_1 FOREIGN KEY (user_id) REFERENCES USER (ID),
      ADD CONSTRAINT USER_TAG_ibfk_2 FOREIGN KEY (tag_id) REFERENCES TAG (ID);

    ALTER TABLE ROOM
      ADD CONSTRAINT ROOM_ibfk_1 FOREIGN KEY (user_id1) REFERENCES USER (ID),
      ADD CONSTRAINT ROOM_ibfk_2 FOREIGN KEY (user_id2) REFERENCES USER (ID);

    ALTER TABLE MESSAGE
      ADD CONSTRAINT MESSAGE_ibfk_1 FOREIGN KEY (room_id) REFERENCES ROOM (ID),
      ADD CONSTRAINT MESSAGE_ibfk_2 FOREIGN KEY (user_id) REFERENCES USER (ID);
    
    ALTER TABLE BLOCK_LIST
      ADD CONSTRAINT BLOCK_LIST_ibfk_1 FOREIGN KEY (user_id1) REFERENCES USER (ID),
      ADD CONSTRAINT BLOCK_LIST_ibfk_2 FOREIGN KEY (user_id2) REFERENCES USER (ID);"