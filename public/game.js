var canvas = document.getElementById("canvas1");
var context = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 710;

var on = false; //toggle stuff
var level = 1;
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


var heroPos = {
    x: 200,
    y: 100,
    dirX: 0,
    dirY: 0,
    speed: 2,
    timeout: 25
};

hero.shoot = function() {
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


zombie.add = function() {
    // var tmpZ = zombie({});

    screenZombies.push(zombie({}));
    // console.log(screenZombies);
};

var screenZombies = [];


// DONE ┌(ㆆ㉨ㆆ)ʃ
// ** Do we want to add an IF here? IF next level is clicked then go to level++?
// NO, KRISTINE! (╯°□°）╯︵ ┻━┻
//AJAX request for the level data
var image;
var zAmount;
function getLevel(){
    $.ajax({
        url: "/get_level",
        type: 'get',
        dataType: 'json',
        data: {stage: level},
        success: function(data) {
            image = data.image;
            clock = data.clock;
            zAmount = data.zAmount;
        }
});
}
// } else start the game normally?
// } I SAID NO! (╬ ಠ益ಠ)

// creating our zombie using an ajax request pulling the
// images from postgres
function zombie(I) {
    var img;
    var speed;
    $.ajax({
        url: "/get_zombie",
        type: 'get',
        dataType: 'json',
        data:{
            level:level
        },
        async: false,
        success: function(data) {
            img = data.img;
            speed = data.speed;
        }
     });

    I.active = true;
    I.src = "/img/" + img;
    I.x = Math.round(Math.random()* 800);
    I.y = Math.round(Math.random()* 700);
    I.dirX = 0;
    I.dirY = 0;
    I.speed = speed;
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
        if (!gameOver){
            if (on) {
                toggleOff();
            } else
            toggleOn();
        }
    }
    if (key == 32) { //spacebar (shoot gun)
        event.preventDefault();
        if (gameOver === false) {
            hero.shoot();
        }
    }
    border(hero);
});



var sum = 0;
function handleCollisions() {
     heroBullets.forEach(function(bullet){
         screenZombies.forEach(function(z){
             if (shot(bullet, z)) {
                 sum +=10;
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
        hero.src = "img/wiggum-zombiesm.png";
        setTimeout(function(){gameOver=true;},3000);
        bullet.active = false;
        clearInterval(timer);
        clearInterval(clockb);

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
function draw() {
    var src = "img/locations/" + image;
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
    if(screenZombies.length === zAmount) clearInterval(timer);
    zombie.add();
    // console.log(screenZombies);
};

var clock;
var clockb;
var gameClock = function(){
    clock --;
    if (clock < 0) {
        gameOver = true;
        clearInterval(clockb);
    } else {
        $('#timer').html(clock);
    }
};

function main() {
    draw();
    update();
    move(heroPos);

    if (screenZombies.length === 0) {
        clearInterval(timer);
        clearInterval(clockb);
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

    } else if (gameOver) {
        (function($) {
        $.fn.flash_message = function(options) {
            options = $.extend({
                text: 'Done',
                time: 3000,
                how: 'before',
                class_name: ''
            }, options);

            return $(this).each(function() {
                if ($(this).parent().find('flash_message').get(0))
                return;

                var message = $('<span />', {'class': 'flash_message' + options.class_name, text: options.text}).hide().fadeIn('fast');

                $(this)[options.how](message);
                message.fadeOut('very slow', function() {
                    $(this).remove();
                });
            });
        };
        })(jQuery);
            $('#status-area').flash_message({
            text: 'HA HA!',
            how: 'append'
            });
            $('#start').show();
            $.ajax({
                url: "/set_score",
                type: 'post',
                dataType: 'json',
                data: {score: sum},

        });
    } else {
            requestAnimationFrame(main);
    }

}
function startgame() {
    level = 1;
    gameOver=false;
    // console.log(level);
    clearInterval(timer);
    on = false;
    hero.src = "img/wiggum.png";
    heroPos = {
        x: 200,
        y: 100,
        dirX: 0,
        dirY: 0,
        speed: 2,
        timeout: 25
    };
    sum = 0;
    screenZombies = [];
    heroBullets = [];
    zombie.add();
    getLevel();
    main();
    timer = setInterval(addZombies, 1 * 6000);
    clock;
    clockb = setInterval(gameClock, 1000);
}

function next() {
    level ++;
    clearInterval(timer);
    on = false;
    hero.src = "img/wiggum.png";
    heroPos = {
        x: 200,
        y: 100,
        dirX: 0,
        dirY: 0,
        speed: 2.5,
        timeout: 10
    };
    screenZombies = [];
    heroBullets = [];
    zombie.add();
    getLevel();
    main();
    timer = setInterval(addZombies, 1 * 3000);
    clock;
    clockb = setInterval(gameClock, 1000);

}



// main();
