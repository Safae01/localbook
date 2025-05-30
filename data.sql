/*==============================================================*/
/* Nom de SGBD :  MySQL 5.0                                     */
/* Date de création :  28/05/2025 12:07:55                      */
/*==============================================================*/

SET FOREIGN_KEY_CHECKS=0;

drop table if exists ADMIN;
drop table if exists CHATER;
drop table if exists COMMENTER;
drop table if exists LIKER;
drop table if exists POSTE;
drop table if exists STORY;
drop table if exists USER;

SET FOREIGN_KEY_CHECKS=1;

/*==============================================================*/
/* Table : ADMIN                                                */
/*==============================================================*/
create table ADMIN
(
   ID_ADMIN             int                            not null AUTO_INCREMENT,
   EMAIL                varchar(255),
   MDPS                 varchar(255),
   primary key (ID_ADMIN)
)
ENGINE = InnoDB;

/*==============================================================*/
/* Table : USER                                                 */
/*==============================================================*/
create table USER
(
   ID_USER              int                            not null AUTO_INCREMENT,
   ID_ADMIN             int                            not null,
   NOM                  varchar(255),
   CIN_NUM              varchar(255),
   CIN_IMG              varchar(255),
   EMAIL                varchar(255),
   MDPS                 varchar(255),
   IMG_PROFIL           varchar(255),
   IMG_COUVERT          varchar(255),
   BIO                  longtext,
   STATUT               longtext,
   AGE                  int,
   DATE_NAISSANCE       date,
   TELE                 varchar(255),
   DATE_INSCRIPTION     timestamp DEFAULT CURRENT_TIMESTAMP,
   DATE_BLOCK           timestamp NULL DEFAULT NULL,
   DUREE                longtext,
   primary key (ID_USER)
)
ENGINE = InnoDB;

/*==============================================================*/
/* Index : BLOQUER_FK                                           */
/*==============================================================*/
create index BLOQUER_FK on USER
(
   ID_ADMIN
);

/*==============================================================*/
/* Table : POSTE                                                */
/*==============================================================*/
create table POSTE
(
   ID_POST              int                            not null AUTO_INCREMENT,
   ID_ADMIN             int                            not null,
   ID_USER              int                            not null,
   TYPE_LOC             longtext,
   VILLE                longtext,
   QUARTIER             varchar(255),
   DUREE                longtext,
   PRIX                 int,
   SURFACE              int,
   NBRE_PIECE           int,
   ETAT                 longtext,
   EQUIPEMENT           varchar(255),
   POST_IMG             varchar(255),
   POST_VID             varchar(255),
   DESCRIPTION          longtext,
   DATE_POST            timestamp DEFAULT CURRENT_TIMESTAMP,
   primary key (ID_POST)
)
ENGINE = InnoDB;

/*==============================================================*/
/* Index : POSTER_FK                                            */
/*==============================================================*/
create index POSTER_FK on POSTE
(
   ID_USER
);

/*==============================================================*/
/* Index : SUPP_POSTE_FK                                        */
/*==============================================================*/
create index SUPP_POSTE_FK on POSTE
(
   ID_ADMIN
);

/*==============================================================*/
/* Table : COMMENTER                                            */
/*==============================================================*/
create table COMMENTER
(
   ID_COMMENT           int                            not null AUTO_INCREMENT,
   ID_POST              int                            not null,
   ID_USER              int                            not null,
   DATE_COMMENTS        timestamp DEFAULT CURRENT_TIMESTAMP,
   CONTENT              longtext,
   primary key (ID_COMMENT),
   unique key (ID_POST, ID_USER, DATE_COMMENTS)
)
ENGINE = InnoDB;

/*==============================================================*/
/* Index : COMMENTER_FK                                         */
/*==============================================================*/
create index COMMENTER_FK on COMMENTER
(
   ID_POST
);

/*==============================================================*/
/* Index : COMMENTER2_FK                                        */
/*==============================================================*/
create index COMMENTER2_FK on COMMENTER
(
   ID_USER
);

/*==============================================================*/
/* Table : LIKER                                                */
/*==============================================================*/
create table LIKER
(
   ID_USER              int                            not null,
   ID_POST              int                            not null,
   DATE_LIKE            timestamp DEFAULT CURRENT_TIMESTAMP,
   primary key (ID_USER, ID_POST)
)
ENGINE = InnoDB;

/*==============================================================*/
/* Index : LIKER_FK                                             */
/*==============================================================*/
create index LIKER_FK on LIKER
(
   ID_USER
);

/*==============================================================*/
/* Index : LIKER2_FK                                            */
/*==============================================================*/
create index LIKER2_FK on LIKER
(
   ID_POST
);

/*==============================================================*/
/* Table : STORY                                                */
/*==============================================================*/
create table STORY
(
   ID_STORY             int                            not null AUTO_INCREMENT,
   ID_USER              int                            not null,
   ID_ADMIN             int                            not null,
   CONTENT              longtext,
   DATE_STORY           timestamp DEFAULT CURRENT_TIMESTAMP,
   primary key (ID_STORY)
)
ENGINE = InnoDB;

/*==============================================================*/
/* Index : EMETTRE_FK                                           */
/*==============================================================*/
create index EMETTRE_FK on STORY
(
   ID_USER
);

/*==============================================================*/
/* Index : SUPP_STORY_FK                                        */
/*==============================================================*/
create index SUPP_STORY_FK on STORY
(
   ID_ADMIN
);

/*==============================================================*/
/* Table : CHATER                                               */
/*==============================================================*/
create table CHATER
(
   ID_MSG               int                            not null AUTO_INCREMENT,
   USE_ID_USER          int                            not null,
   ID_USER              int                            not null,
   CONTENT              longtext,
   TYPE_CONTENT         varchar(255),
   URL_FICHIER          varchar(255),
   NOM_FICHIER          varchar(255),
   DATE_ENVOI           timestamp DEFAULT CURRENT_TIMESTAMP,
   LU                   smallint,
   primary key (ID_MSG),
   unique key (USE_ID_USER, ID_USER, ID_MSG)
)
ENGINE = InnoDB;

/*==============================================================*/
/* Index : CHATER_FK                                            */
/*==============================================================*/
create index CHATER_FK on CHATER
(
   USE_ID_USER
);

/*==============================================================*/
/* Index : CHATER2_FK                                           */
/*==============================================================*/
create index CHATER2_FK on CHATER
(
   ID_USER
);

alter table CHATER add constraint FK_CHATER foreign key (USE_ID_USER)
      references USER (ID_USER) on delete restrict on update restrict;

alter table CHATER add constraint FK_CHATER2 foreign key (ID_USER)
      references USER (ID_USER) on delete restrict on update restrict;

alter table COMMENTER add constraint FK_COMMENTER foreign key (ID_POST)
      references POSTE (ID_POST) on delete restrict on update restrict;

alter table COMMENTER add constraint FK_COMMENTER2 foreign key (ID_USER)
      references USER (ID_USER) on delete restrict on update restrict;

alter table LIKER add constraint FK_LIKER foreign key (ID_USER)
      references USER (ID_USER) on delete restrict on update restrict;

alter table LIKER add constraint FK_LIKER2 foreign key (ID_POST)
      references POSTE (ID_POST) on delete restrict on update restrict;

alter table POSTE add constraint FK_POSTER foreign key (ID_USER)
      references USER (ID_USER) on delete restrict on update restrict;

alter table POSTE add constraint FK_SUPP_POSTE foreign key (ID_ADMIN)
      references ADMIN (ID_ADMIN) on delete restrict on update restrict;

alter table STORY add constraint FK_EMETTRE foreign key (ID_USER)
      references USER (ID_USER) on delete restrict on update restrict;

alter table STORY add constraint FK_SUPP_STORY foreign key (ID_ADMIN)
      references ADMIN (ID_ADMIN) on delete restrict on update restrict;

alter table USER add constraint FK_BLOQUER foreign key (ID_ADMIN)
      references ADMIN (ID_ADMIN) on delete restrict on update restrict;