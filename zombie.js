var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
canvas.width = 750;
canvas.height = 800;

var heroBullets = [];

function bullet(I) {
    I.x = heroPos.x + 97;
    I.y = heroPos.y + 22;
    I.active = true;
    I.xVelocity = heroPos.dirX;
    I.yVelocity = heroPos.dirY;
    I.width = 7;
    I.height = 7;
    I.color = "white"

    I.inBounds = function() {
        return I.x >= 0 && I.x <= canvas.width && I.y >= 0 && I.y <= canvas.height;
    };

    I.draw = function() {
        context.fillStyle = this.color;
        context.fillRect(I.x, I.y, this.width, this.height)
    };

    I.update = function() {
        I.x += I.xVelocity;
        I.y += I.yVelocity;

        I.active = I.active && I.inBounds();
    };

    return I;
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

hero.shoot = function() {
    console.log("i'm shooting");
    console.log(heroBullets);
    var bulletPosition = this.midpoint();

    heroBullets.push(bullet({
        speed: 5,
        x: bulletPosition.x,
        y: bulletPosition.y
    }));

};

hero.midpoint = function() {
    return {
        x: this.x + this.width/2,
        y: this.y + this.height/2
    };
};

var zombie = new Image();
zombie.src = "img/bartsm.png";

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

var toggle = function() {
    var on = false;
    return function() {
        if(!on) {
            on = true;
            hero.src = "img/wiggumflip.png";
            return;
        }
        hero.src = "img/wiggum.png";
        on = false;
    };
}();


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
        toggle();
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

function collides(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

function handleCollisions() {
  heroBullets.forEach(function(bullet) {
      if (collides(bullet, zombie)) {
        console.log("you shot him!");
        bullet.active = false;
      }
    });
  }


function collision(player) {
    if (heroPos.x +32 < zombiePos.x){
        return false;
    } else if (zombiePos.x + 32 < heroPos.x) {
      return false;
  } else if (heroPos.y + 32 < zombiePos.y) {
      return false;
  } else if (zombiePos.y + 32 < heroPos.y ) {
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

    if (collision(zombie)) {
        hero.src = "img/wiggum-zombiesm.png";
        console.log("you turned into a zombie");    }
}
// zombiePos.x+=1;



main();
