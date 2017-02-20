var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
canvas.width = 750;
canvas.height = 800;

var heroBullets = [];

function bullet(I) {
    I.active = true;
    I.xVelocity = 0;
    I.yVelocity = -I.speed;
    I.width = 3;
    I.height = 3;
    I.color = "#000"

    I.inBounds = function() {
        return I.x >= 0 && I.x <= canvas.width && I.y >= 0 && I.y <= canvas.height;
    };

    I.draw = function() {
        context.fillStyle = this.color;
        context.fillRect(heroPos.x, heroPos.y, this.width, this.height);
    };

    I.update = function() {
        I.x += I.xVelocity;
        I.y += I.yVelocity;

        I.active = I.actuve && I.inBounds();
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
    var bulletPosition = this.midpoint();

    heroBullets.push(bullet({
        speed: 5,
        x: bulletPosition.x,
        y: bulletPosition.y
    }));
    heroBullets.forEach(function(bullet) {
    bullet.update()
});
    heroBullets = heroBullets.filter(function() {
        return bullet.active;
});
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
        console.log("change dir");
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

// function Pool(maxSize) {
// 	var size = maxSize; // Max bullets allowed in the pool
// 	var pool = [];
// 	this.init = function() {
// 		for (var i = 0; i < size; i++) {
// 			// Initalize the bullet object
// 			var bullet = new Bullet();
// 			bullet.init(0,0, bullet., bulletPos.x, bulletPos.y);
// 			pool[i] = bullet;
// 		}
// 	};
//
// 	this.get = function(x, y, speed) {
// 		if(!pool[size - 1].alive) {
// 			pool[size - 1].spawn(x, y, speed);
// 			pool.unshift(pool.pop());
// 		}
// 	};
//
// 	this.animate = function() {
// 		for (var i = 0; i < size; i++) {
// 			// Only draw until we find a bullet that is not alive
// 			if (pool[i].alive) {
// 				if (pool[i].draw()) {
// 					pool[i].clear();
// 					pool.push((pool.splice(i,1))[0]);
// 				}
// 			}
// 			else
// 				break;
// 		}
// 	};
// }
//
// function Bullet() {
// 	this.alive = false;
// 	this.spawn = function(x, y, speed) {
// 		this.x = x;
// 		this.y = y;
// 		this.speed = speed;
// 		this.alive = true;
// 	};
//
// 	this.draw = function() {
// 		this.context.clearRect(this.x, this.y, this.width, this.height);
// 		this.y -= this.speed;
// 		if (this.y <= 0 - this.height) {
// 			return true;
// 		}
// 		else {
// 			this.context.drawImage(imageRepository.bullet, this.x, this.y);
// 		}
// 	};
// 	this.clear = function() {
// 		this.x = 0;
// 		this.y = 0;
// 		this.speed = 0;
// 		this.alive = false;
// 	};
// }
// Bullet.prototype = new Drawable();

function collision(player) {
    if (heroPos.x +32 < zombiePos.x) {
        return false;
    } else if(zombiePos.x + 32 < heroPos.x) {
      return false;
  } else if (heroPos.y + 32 < zombiePos.y) {
      return false;
  } else if (zombiePos.y + 32 < heroPos.y) {
      return false;
    }
    return true;
  }


function main() {
    var bgImage = new Image();
    bgImage.src = "img/locations/background.png";
    context.drawImage(bgImage, 0, 0);
    context.drawImage(hero, heroPos.x, heroPos.y);
    // context.drawImage(bullet, heroPos.x, heroPos.y);
    context.drawImage(zombie, zombiePos.x, zombiePos.y);
    moveRandom(zombiePos);
    move(heroPos);

    heroBullets.forEach(function(bullet) {
        bullet.draw()
});
    requestAnimationFrame(main);
    //
    // Bullet.prototype.context;
	// Bullet.prototype.canvasWidth;
	// Bullet.prototype.canvasHeight;

    if (collision(zombie)) {
        hero.src = "img/wiggum-zombiesm.png";
        console.log("you turned into a zombie");    }
}
// zombiePos.x+=1;

// function update() {
//     });
//
//     });
// }
//
// function draw() {
//     playerBullets.forEach(function(bullet) {
//         bullet.draw();
//     });
// }

main();
