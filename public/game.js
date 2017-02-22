

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 710;

var on = false; //toggle stuff
gameOver = false;

var heroBullets = [];
function bullet(I) {
    I.active = true;
    I.yVelocity = 0;
    I.width = 7;
    I.height = 7;
    I.color = "white"

    if (on) {
        I.x = heroPos.x - 5;
        I.y = heroPos.y + 22;
        I.xVelocity = heroPos.dirX - 30;
    } else {
        I.x = heroPos.x + 97;
        I.y = heroPos.y + 22;
        I.xVelocity = heroPos.dirX + 30;
    }

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
    // console.log("i'm shooting");
    // console.log(heroBullets);
    var bulletPosition = this.midpoint();

    heroBullets.push(bullet({
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


var zombies = [
    'bartsm.png',
    'apusm.png',
    'catsm.png',
    'duffmansm.png',
    'grandpasm.png',
    'homersm.png',
    'flanderssm.png',
    'krustysm.png',
    'lisasm.png',
    'margesm.png',
    'martinsm.png',
    'milhousesm.png',
    'moesm.png',
    'mrburnssm.png',
    'nelsonsm.png',
    'ottosm.png',
    'quimbysm.png',
    'revlovejoysm.png',
    'skinnersm.png',
    'snakesm.png',
    'williesm.png',
]

zombie.add = function() {
    screenZombies.push(zombie({}));
};

var screenZombies = [];
function zombie(I) {
    var number = Math.round(Math.random()* 21);
    I.active = true;
    I.src = "/img/" + zombies[number];
    I.x = Math.round(Math.random()* 300);
    I.y = Math.round(Math.random()* 200);
    I.dirX = 0;
    I.dirY = 0;
    I.speed = .8;
    I.timeout = 25;

    var zImg = new Image();
    zImg.src = I.src;

    I.inBounds = function() {
        return I.x >= 0 && I.x < 899 && I.y >= 0 && I.y <= canvas.height;
    }


    I.draw = function() {
        context.drawImage(zImg, this.x, this.y);
    }

    I.pos = function () {
        this.x,
        this.y,
        this.dirX,
        this.dirY,
        this.speed,
        this.timeout
    }
    I.moveRandom = function() {
        this.timeout -= 1;
        this.x += this.dirX * this.speed;
        this.y += this.dirY * this.speed;
        if (this.timeout <= 0) {
            this.dirX = Math.floor(Math.random() * 3) - .9;
            this.dirY = Math.floor(Math.random() * 3) - .9;
            this.timeout = 25;
            //   player.speed = Math.floor(Math.random() * 1) - 5;
        }
    }

    I.update = function() {
        I.active = I.active && I.inBounds();
    };

    return I;
}

function border(object) {
    if (object.x > 899) {
        object.x = 880;
    } else if (object.x < 0) {
        object.x = 5;
    } else if (object.y > 650) {
        object.y = 600;
    } else if (object.y < 0) {
        object.y = 5;
    }
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


var sum = 0;
function handleCollisions() {
     heroBullets.forEach(function(bullet){
         screenZombies.forEach(function(z){
             if (shot(bullet, z)) {
                 sum +=10;
                 console.log("you shot him!");
                 z.active = false;
                 bullet.active = false;
             };
        });
        console.log(sum);
        return sum;
     });

     $('#score').html(sum);

  screenZombies.forEach(function(zombie){
      if (collision(heroPos, zombie)) {
        //   console.log("you died SOB");
          hero.src = "img/wiggum-zombiesm.png";
          bullet.active = false;
      };
  });

 }



function collision(heroPos, zombie) {
  if (heroPos.x +32 < zombie.x){
      return false;
  } else if (zombie.x + 32 < heroPos.x) {
    return false;
  } else if (heroPos.y + 32 < zombie.y) {
    return false;
  } else if (zombie.y + 32 < heroPos.y ) {
    return false;
  }
  return true;
}

function shot(bullet, z) {
    if (bullet.x + 7 < z.x){
        return false;
    } else if (z.x + 40 < bullet.x) {
      return false;
  } else if (bullet.y + 7 < z.y) {
      return false;
  } else if (z .y + 40  < bullet.y ) {
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
    screenZombies.forEach(function(zombie){
        zombie.update()
        zombie.moveRandom();
        border(zombie);
    });

    screenZombies = screenZombies.filter(function(s){
        return s.active
    });
    handleCollisions();

}
var src = "img/locations/background.png"
function draw() {
    var bgImage = new Image();
    bgImage.src = src;
    context.drawImage(bgImage, 0, 0);
    context.drawImage(hero, heroPos.x, heroPos.y);
    heroBullets.forEach(function(bullet) {
        bullet.draw()
    });

    screenZombies.forEach(function(z) {
        z.draw()
    });
};


zombie.add();
var addZombies = function() {
    if(screenZombies.length === 4) clearInterval(timer);
    zombie.add();
    console.log(screenZombies);
};

var clock = 30;
var clockb;
var gameClock = function(){
    console.log(clock);
    clock --;
    if (clock < 0) {
        gameOver = true;
        clearInterval(clockb);
    } else {
        $('#timer').html(clock + " seconds.");
    }
};
// var gameClock = setInterval(function() {
//     clock --;
//     if (clock < 0) {
//         gameOver = true;
//         clearInterval(clock);
//     } else {
//         $('#timer').innerHTML = clock.toString() + " seconds.";
//         console.log(clock);
//     }
//     }, 1000);

function main() {
    draw();
    update();
    move(heroPos);

    if (screenZombies.length === 0) {
        clearInterval(timer);
        (function($) {

        $.fn.flash_message = function(options) {
            options = $.extend({
                text: 'Done',
                time: 1000,
                how: 'before',
                class_name: ''
            }, options);

            return $(this).each(function() {
                if ($(this).parent().find('flash_message').get(0) )
                return;

                var message = $('<span />', {'class': 'flash_message' + options.class_name, text: options.text}).hide().fadeIn('fast');

                $(this)[options.how](message);

                message.delay(options.time).fadeOut('very slow', function() {
                    $(this).remove();
                });
            });
        };
        })(jQuery);
            $('#levelup').show();
            $('#status-area').flash_message({
            text: 'Level Cleared!',
            how: 'append'
            });

    } else {
            requestAnimationFrame(main);
    }

}
function startgame() {
    clearInterval(timer);
    hero.src = "img/wiggum.png";
    heroPos = {
        x: 200,
        y: 100,
        dirX: 0,
        dirY: 0,
        speed: .8,
        timeout: 25
    };
    screenZombies = [];
    heroBullets = [];
    zombie.add();
    main();
    timer = setInterval(addZombies, 1 * 6000);
    clockb = setInterval(gameClock, 1000);
}


// function next() {
//     src = "img/locations/school.png"
//     context.clearRect(0,0,canvas.width, canvas.height)
//     startgame();
// }

// main();
