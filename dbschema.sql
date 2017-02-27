DROP TABLE IF EXISTS "zombies";
CREATE TABLE "zombies" (
  "id" SERIAL  ,
  "name" TEXT  NULL,
  "img_path" TEXT  NULL,
  PRIMARY KEY(id)
) ;

DROP TABLE IF EXISTS "levels";
CREATE TABLE "levels" (
  "id" serial,
  "level" integer NOT NULL,
  "background" text NOT NULL,
  "speed" integer NOT NULL,
  "timer" integer NOT NULL,
  "amount" integer NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS "user";
CREATE TABLE "user" (
  "id" integer NOT NULL,
  "username" text,
  "password" text,
  "level" integer,
  "highscore" integer,
  PRIMARY KEY (id)
 );

DROP TABLE IF EXISTS "scores";
CREATE TABLE "scores" (
  "id" serial,
  "name" text,
  "score" integer,
  PRIMARY KEY (id)
 );

insert into zombies(name, img_path) values ('Bart','bartsm.png');insert into zombies(name, img_path) values ('Apu','apusm.png');insert into zombies(name, img_path) values ('Cat','catsm.png');insert into zombies(name, img_path) values ('Duffman','duffmansm.png');insert into zombies(name, img_path) values ('Flanders','flanderssm.png');insert into zombies(name, img_path) values ('Grandpa','granpasm.png');insert into zombies(name, img_path) values ('Homer','homersm.png');insert into zombies(name, img_path) values ('Krusty','krustysm.png');insert into zombies(name, img_path) values ('Lisa','lisasm.png');insert into zombies(name, img_path) values ('Marge','margesm.png');
insert into zombies(name, img_path) values ('Martin','martinsm.png');insert into zombies(name, img_path) values ('Milhouse','milhousesm.png');insert into zombies(name, img_path) values ('Moe','moesm.png');insert into zombies(name, img_path) values ('Burns','mrburnssm.png');insert into zombies(name, img_path) values ('Nelson','nelsonsm.png');insert into zombies(name, img_path) values ('Otto','ottosm.png');insert into zombies(name, img_path) values ('Quimby','quimbysm.png');insert into zombies(name, img_path) values ('Lovejoy','revlovejoysm.png');insert into zombies(name, img_path) values ('Skinner','skinnersm.png'); insert into zombies(name, img_path) values ('Snake','snakesm.png');insert into zombies(name,img_path) values ('Willie','williesm.png');

insert into levels(level, background, speed, timer, amount) values(1,'background.png',0.8,30,5);insert into levels(level, background, speed, timer, amount) values(2,'powerplant.png',0.9,30,10);insert into levels(level, background, speed, timer, amount) values(3,'prison.png',1.1,35,15);insert into levels(level, background, speed, timer, amount) values(4,'duff.png',1.2,45,20);insert into levels(level, background, speed, timer, amount) values(5,'moes.png',1.4,30,25);insert into levels(level, background, speed, timer, amount) values(6,'school.png',1.2,20,20);insert into levels(level, background, speed, timer, amount) values(7,'krusty.png',1.4,25,25);


INSERT INTO user(id, username, password, level, highscore)VALUES (1, marge, maggie, 3, 250); INSERT INTO user(id, username, password, level, highscore)VALUES (2, bart, dude, 1, 1000);
