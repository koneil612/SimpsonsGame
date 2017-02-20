class Zombie {
    constructor() {
    let x = Math.round(Math.random());
    this.zombie = [
        'img/bartsm.png',
        'img/apusm.png',
        'img/catsm.png',
        'img/duffmansm.png',
        'img/grandpasm.png',
        'img/homersm.png',
    ],
    this.pos = {}
    this.state = {
            x: 50,
            y: 250,
            dirX: 0,
            dirY: 0,
            speed: .8,
            timeout: 25
        };
        image: this.zombie[x]
    } zombie = new Image();
    zombie.src = Math.floor(Math.random() * 2) - .9;["img/bartsm.png", "img/margesm.png"] ;
}


var hero = new Image();
hero.src = "img/wiggum.png";
// hero.height = 32;
// hero.width = 32;
var heroPos = {
    x: 200,
    y: 100,
    dirX: 0,
    dirY: 0,
    speed: .8,
    timeout: 25
};

var zombie = new Image();
zombie.src = Math.floor(Math.random() * 2) - .9;["img/bartsm.png", "img/margesm.png"] ;

var zombiePos = {
    x: 50,
    y: 250,
    dirX: 0,
    dirY: 0,
    speed: .8,
    timeout: 25

};

function border(object) {
    if (object.x > 800) {
        object.x = 0;
    } else if (object.x < 0) {
        object.x = 510;
    } else if (object.y > 720) {
        object.y = 0;
    } else if (object.y < 0) {
        object.y = 200;
    }
}

function moveRandom(player) {
    //change opponent's direction randomly
    player.timeout -= 1;
    player.x += player.dirX * player.speed;
    player.y += player.dirY * player.speed;
    if (player.timeout <= 0) {
        player.dirX = Math.floor(Math.random() * 3) - .9;
        player.dirY = Math.floor(Math.random() * 3) - .9;
        player.timeout = 25;
        //   player.speed = Math.floor(Math.random() * 1) - 5;
    }
    border(player);

}
function move(player) {
    //change opponent's direction randomly
    player.x += player.dirX * player.speed;
    player.y += player.dirY * player.speed;
    border(player);
}
function toggleOn() {
    on = true;
    hero.src = "img/wiggumflip.png";
    return;
}

function toggleOff() {
    hero.src = "img/wiggum.png";
    on = false;
    return;
}

window.addEventListener('keydown', function(event) {
// moving the player around & hitting enter to flip and space to shoot
    var key = event.keyCode;
    if (key == 37) { //left
        event.preventDefault();
        heroPos.dirX = -1;
    }
    if (key == 39) { //right
        event.preventDefault();
        heroPos.dirX = 1;
    }
    if (key == 38) { //up
        event.preventDefault();
        heroPos.dirY = -1;
    }
    if (key == 40) { //down
        event.preventDefault();
        heroPos.dirY = 1;
    }
    if (key == 13) { //enter (flip)
        event.preventDefault();
        if (on) {
        toggleOff();
        } else
        toggleOn();
    }
    if (key == 32) { //spacebar (shoot gun)
        event.preventDefault();
        hero.shoot();
    }
    border(hero);
});

// window.addEventListener('keyup', function(event) {
//     var key = event.keyCode;
//     if (key == 37) { //left
//         heroPos.dirX = 0;
//     }
//     if (key == 39) { //right
//         heroPos.dirX = 0;
//     }
//     if (key == 38) { //up
//         heroPos.dirY = 0;
//     }
//     if (key == 40) { //down
//         heroPos.dirY = 0;
//     }
// });

function handleCollisions() {
  heroBullets.forEach(function(bullet) {
      if (collision(bullet, zombiePos)) {
        console.log("you shot him!");
        zombie = "";
        bullet.active = false;
      }
    });
    if (collision(heroPos, zombiePos)) {
      console.log("you died SOB");
      hero.src = "img/wiggum-zombiesm.png";
      bullet.active = false;
    }
  }


function collision(a, b) {
    if (a.x +32 < b.x){
        return false;
    } else if (b.x + 32 < a.x) {
      return false;
  } else if (a.y + 32 < b.y) {
      return false;
  } else if (b.y + 32 < a.y ) {
      return false;
    }
    return true;
  }

function update() {
    heroBullets.forEach(function(bullet) {
        bullet.update()
    });
    heroBullets = heroBullets.filter(function(b) {
       return b.active;
    });
    handleCollisions();
}

function draw() {
    var bgImage = new Image();
    bgImage.src = "img/locations/background.png";
    context.drawImage(bgImage, 0, 0);
    context.drawImage(hero, heroPos.x, heroPos.y);
    context.drawImage(zombie, zombiePos.x, zombiePos.y);
    heroBullets.forEach(function(bullet) {
        bullet.draw()
    });
}
function main() {
    draw();
    update();
    moveRandom(zombiePos);
    move(heroPos);

    requestAnimationFrame(main);
// zombiePos.x+=1;

}

main();
