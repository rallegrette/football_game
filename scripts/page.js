// ========================= EECS 493 Assignment 2 Starter Code =========================
/********A3 DECLARATIONS*************/

let onScreenShield;
var seenHowToPlayPage = false;
let onScreenPortal;
let portalOccurrence = 6000;       
let portalGone = 3000;              
let isPaused = false;
let onScreenAsteroid;
let game_window;
let game_screen;
let astProjectileSpeed = 3;          
let astSpawnRate = 800;
let firstProjectileSpeed = 3; 
let currentAsteroid = 1;
let AST_OBJECT_REFRESH_RATE = 15;
let maxPersonPosX = 1218;
let maxPersonPosY = 658;
let PERSON_SPEED = 4;  
var gameNum = 1;
let difficulty = "normal";
var score = 0;
var scoreNum;
var score_idx;
let danger;
let level;
let spawn_rate = 800; 
var LEFT = false;
var RIGHT = false;
var UP = false;
var DOWN = false;
var shieldHit;
var portal_collision;
var shieldTimer;
let shield;
var danger_num = 20;
var sound_dead = new Audio('./src/audio/die.mp3');
var collectSound = new Audio('./src/audio/collect.mp3');
var level_num = 1;
let shieldOccurrence = 9000;          // Masks spawn every 15 seconds
let shieldGone = 3000;                 // Mask disappears in 5 seconds

var vol = 50; //default





// Main
$(document).ready(function () {

  //5:37 and before
  $("#tutorial").hide();
  $("#player").hide();
  $("#game_right_section").hide();
  $("#actual_game").hide();

  game_window = $('game-window');
  game_screen = $("actual_game");
  scoreNum = $('#score_num');
  finalScore = $('#final_score');
  danger = $('#danger_num');
  level = $('#level_num');
  player = $('#player');
  onScreenAsteroid = $('.curAstroid');
  onScreenShield = $('.curShield');
  onScreenPortal = $('.curPortal');


  scoreNum.html(score);
  danger.html(danger_num);
  scoreNum.html(score);
  finalScore.html(score);
  level.html(level_num);
  
  let slider = $("#volume-slider"); 
  let output = $("#volume-value");   

  output.text(slider.val());  
    vol = parseFloat(slider.val()) / 100;  // Convert to 0.0 - 1.0 range

    sound_dead.volume = vol;
    collectSound.volume = vol;

       slider.on("input", function () {
        let volumeValue = parseFloat($(this).val()) / 100;  // Normalize to 0.0 - 1.0
        output.text($(this).val());  
        vol = volumeValue;
        sound_dead.volume = vol;
        collectSound.volume = vol;
    });
});






// TODO: ADD YOUR EVENT HANDLERS HERE



function setting_click(){
  // console.log("hello world");
  $('#settings').show();
  // $('settings_front_pg').show();
}


function easy_mode(){
  console.log("EASY");
  $('#easy').show();
  // $('settings_front_pg').show();
}

function openPopup() {

  document.getElementById("myPopup").style.display = "block";

}

function close_settings(){
  $('#settings').show();
}

function open_settings() {
  document.getElementById('open_settings').style.display = 'block';
}

function close_settings() {
  document.getElementById('open_settings').style.display = 'none';
}

$(function () {
  $('#volume-slider').on('input', function () {
    $('#volume-value').text($(this).val());
  });
});

$(function () {
  $('#difficulty-control button').on('click', function () {
    $('#difficulty-control button').css('border-color', 'white');
    
    // Highlight the clicked button 
    $(this).css('border-color', 'yellow');
  });
  // Set the default highlight for "Normal" button when the page loads
  $('#normal').css('border-color', 'yellow');
});




function closeSettings() {
  // Hide the settings popup
  $('#settings').fadeOut(); 
    $('#landing-page').fadeIn(); 
}

function openTutorial() {
    if (seenHowToPlayPage === true) {
        startGame();
    } else {
        // Otherwise, show the tutorial
        $('#landing-page').fadeOut();
        $('#tutorial-page').fadeIn();
        seenHowToPlayPage = true;
    }

}


function difficulty_helper(clicked_id) {
  console.log(difficulty);
  $(".diff-butt").css("border", "2px solid transparent");
  difficulty = clicked_id;
  $("#" + difficulty).css("border", "2px solid yellow");

  document.getElementById(difficulty).style.border = "none";
  difficulty = clicked_id;
  document.getElementById(difficulty).style.border = "4px solid yellow";
  if (difficulty === 'easy') {
    danger_num = 10;
    spawn_rate = 1000;
    astProjectileSpeed = 1;

  }
  if (difficulty == "normal") {
    danger_num = 20;
    spawn_rate = 800;
    astProjectileSpeed = 3;


  }
  if (difficulty === 'hard') {
    danger_num = 30;
    spawn_rate = 600;
    astProjectileSpeed = 5;
  }

  danger.html(danger_num);  
  
}
/*********************A3 STUFF *********************/
// Keydown event handler
document.onkeydown = function (e){
  if (e.key == 'ArrowLeft') LEFT = true;
  if (e.key == 'ArrowRight') RIGHT = true;
  if (e.key == 'ArrowUp') UP = true;
  if (e.key == 'ArrowDown') DOWN = true;
}

document.onkeyup = function (e){
  if (e.key == 'ArrowLeft') LEFT = false;
  if (e.key == 'ArrowRight') RIGHT = false;
  if (e.key == 'ArrowUp') UP = false;
  if (e.key == 'ArrowDown') DOWN = false;
}

class Asteroid{
  constructor(){
    let objectString = "<div id = 'a-" + currentAsteroid + "' class = 'curAstroid' > <img src ='src/asteroid.png'/></div>";
    onScreenAsteroid = $("#actual_game"); 
    onScreenAsteroid.append(objectString);


    
      this.id = $('#a-' + currentAsteroid);
      
      currentAsteroid++;  
      this.cur_x = 0;
      this.cur_y = 0;
      //priv member variables
      //member variables for how to move asteroid
      this.x_dest = 0;
      this.y_dest = 0;
      this.hide_axis = 'x';
      this.hide_after = 0;
      this.sign_of_switch = 'neg';
      this.#spawnAsteroid();

    
  }
  hasReachedEnd(){
    if (this.hide_axis == 'x') {
      if (this.sign_of_switch == 'pos') {
        if (this.cur_x > this.hide_after) {
          return true;
        }
      }
      else {
        if (this.cur_x < this.hide_after) {
          return true;
        }
      }
    }
    else {
      if (this.sign_of_switch == 'pos') {
        if (this.cur_y > this.hide_after) {
          return true;
        }
      }
      else {
        if (this.cur_y < this.hide_after) {
          return true;
        }
      }
    }
    return false;
  }



updatePosition(){
  if (isNaN(this.cur_x) || isNaN(this.cur_y)) {
    console.error(`ERROR: Asteroid has NaN values! cur_x=${this.cur_x}, cur_y=${this.cur_y}`);
    return;
}
  if (isPaused) return; 
  this.cur_y += this.y_dest * astProjectileSpeed;
  this.cur_x += this.x_dest * astProjectileSpeed;
  this.id.css('top', this.cur_y);
  this.id.css('right', this.cur_x);
}

#spawnAsteroid() {
  let x = getRandomNumber(0, 1280);
  let y = getRandomNumber(0, 720);
  let floor = 784;
  let ceiling = -64;
  let left = 1344;
  let right = -64;
  let major_axis = Math.floor(getRandomNumber(0, 2));
  let minor_aix = Math.floor(getRandomNumber(0, 2));
  let num_ticks;

  let screenWidth = game_screen.width() || 1280;
  let screenHeight = game_screen.height() || 720;

  // console.log(`Game screen dimensions: width=${screenWidth}, height=${screenHeight}`);

  if (major_axis == 0 && minor_aix == 0) {
      this.cur_y = floor;
      this.cur_x = x;
      num_ticks = Math.max(Math.floor((screenHeight + 64) / astProjectileSpeed), 1); 
      //no div by 0!
      this.x_dest = (screenWidth - x);
      this.x_dest = (this.x_dest - x) / num_ticks + getRandomNumber(-0.5, 0.5);
      this.y_dest = -astProjectileSpeed - getRandomNumber(0, 0.5);
      this.hide_axis = 'y';
      this.hide_after = -64;
      this.sign_of_switch = 'neg';
  }
  if (major_axis == 0 && minor_aix == 1) {
      this.cur_y = ceiling;
      this.cur_x = x;
      num_ticks = Math.max(Math.floor((screenHeight + 64) / astProjectileSpeed), 1); //no div by 0
      this.x_dest = (screenWidth - x);
      this.x_dest = (this.x_dest - x) / num_ticks + getRandomNumber(-0.5, 0.5);
      this.y_dest = astProjectileSpeed + getRandomNumber(0, 0.5);
      this.hide_axis = 'y';
      this.hide_after = 784;
      this.sign_of_switch = 'pos';
  }
  if (major_axis == 1 && minor_aix == 0) {
      this.cur_y = y;
      this.cur_x = left;
      num_ticks = Math.max(Math.floor((screenWidth + 64) / astProjectileSpeed), 1); 
      this.x_dest = -astProjectileSpeed - getRandomNumber(0, 0.5);
      this.y_dest = (screenHeight - y);
      this.y_dest = (this.y_dest - y) / num_ticks + getRandomNumber(-0.5, 0.5);
      this.hide_axis = 'x';
      this.hide_after = -64;
      this.sign_of_switch = 'neg';
  }
  if (major_axis == 1 && minor_aix == 1) {
      this.cur_y = y;
      this.cur_x = right;
      num_ticks = Math.max(Math.floor((screenWidth + 64) / astProjectileSpeed), 1);
      this.x_dest = astProjectileSpeed + getRandomNumber(0, 0.5);
      this.y_dest = (screenHeight - y);
      this.y_dest = (this.y_dest - y) / num_ticks + getRandomNumber(-0.5, 0.5);
      this.hide_axis = 'x';
      this.hide_after = 1344;
      this.sign_of_switch = 'pos';
  }

  // console.log(`Spawning Asteroid: cur_x=${this.cur_x}, cur_y=${this.cur_y}, x_dest=${this.x_dest}, y_dest=${this.y_dest}`);

  // Show this Asteroid's initial position on screen
  this.id.css("top", this.cur_y);
  this.id.css("right", this.cur_x);

  //normalize the speed so all asteroids travel at the same speed
  let speed = Math.sqrt((this.x_dest) * (this.x_dest) + (this.y_dest) * (this.y_dest));
  this.x_dest = this.x_dest / speed;
  this.y_dest = this.y_dest / speed;
}

}






function spawn() {
  console.log(" Spawning asteroid...");
  let asteroid = new Asteroid();
  setTimeout(spawn_helper(asteroid), 0);
}

function spawn_helper(asteroid) {
  let astermovement = setInterval(function () {
    asteroid.updatePosition();
    //make sure it stays in game border
    if (asteroid.hasReachedEnd()) {
      asteroid.id.remove();
      clearInterval(astermovement);
    }
  }, AST_OBJECT_REFRESH_RATE);
}







function startGame() {
  $('#landing-page').fadeOut();
  $('#tutorial-page').fadeOut();
  $("#player").hide();
  $('#actual_game').fadeIn();
  $('#game_right_section').fadeIn();

  level_num = 1;
  score = 0;
  PERSON_SPEED = 4;
  gameNum++;
  player_can_move = true;

  $("#player").css({ 'left': '600px', 'top': '300px' });
  player_can_move = true;
  stopped = false;

  $("#tutorial").hide();
  
  document.getElementById("actual_game").style.display = "block";
  document.getElementById("game_right_section").style.display = "block";
  document.getElementById("splash").style.display = "block";

  window.setTimeout("closeSplashPage();", 3000);
  window.setTimeout('createComet()', 3000);
    window.setTimeout('Shield()', 3000);
  window.setTimeout('Portal()', 3000);
  window.setTimeout('update_score()', 3000);
  window.setTimeout('astroidCollision()', 3000);

  $(".player_img").attr('src', 'src/player/player.gif');


  window.setTimeout(function () {
    $("#player").show();

  }, 3000);
  $("#tutorial").hide();

  if (difficulty == "easy") {
    astProjectileSpeed = 1;
  }
  if (difficulty == "normal") {
    astProjectileSpeed = 3;
  }
  if (difficulty == "hard") {
    astProjectileSpeed = 5;
  }
  window.setTimeout(function () {
    personinv = setInterval(movePlayer, 10);
  }, 3000);
  
}


  function gameOver() {
    // console.log("Game Over Triggered");

    $("#landing-page").show();
    $("#play-button").text("Play Game!").attr("onclick", "openTutorial()");

    // Hide game elements
    $("#game_right_section").hide();
    $("#actual_game").hide();
    $("#player").hide();
    $("button[onclick='openTutorial()']").hide();  
    $("button[onclick='setting_click()']").hide();  
    $("#gameover").fadeIn();
    $("#pause-btn").hide(); 
    clearInterval(collision_track);
    clearInterval(cometInterval);
    clearInterval(score_idx);
    clearInterval(shieldHit);
    clearInterval(portal_collision);
    clearInterval(shieldTimer);
    clearInterval(portalTimer);
    clearInterval(personinv);
    $(".curAstroid").remove();
    $(".curShield").remove();
    $(".curPortal").remove();
    score = 0;
    level_num = 1;
    isPaused = false;
    danger_num = (difficulty === "easy") ? 10 : (difficulty === "normal") ? 20 : 30;  // Reset danger level

    if (difficulty == "easy") {
      danger_num = 10;
  } else if (difficulty == "normal") {
      danger_num = 20;
  } else if (difficulty == "hard") {
      danger_num = 30;
  }
    $("#score_num").text(score);
    $("#danger_num").text(danger_num);
    $("#level_num").text(level_num);
    sound_dead.play();
    sound_dead.volume = parseFloat(vol / 100);

  }


  function startOver() {
    // console.log("restarting game...");
    shield = false; 
    // Hide game elements
    $("#gameover").hide();
    $("#game_right_section").hide();
    $("#actual_game").hide();
    $("#player").hide();
    $("#pause-btn").hide(); 
    // Show landing page
    $("#landing-page").fadeIn();
    $("button[onclick='openTutorial()']").show();  
    $("button[onclick='setting_click()']").show();  
    // Reset game variables


    if (difficulty == "easy") {
        danger_num = 10;
    } else if (difficulty == "normal") {
        danger_num = 20;
    } else if (difficulty == "hard") {
        danger_num = 30;
    }


    score = 0;
    score_num = 0;
    level_num = 1;
    isPaused = false;
    danger_num = (difficulty === "easy") ? 10 : (difficulty === "normal") ? 20 : 30;  //  Reset danger level

    $("#score_num").text(score_num);
    $("#danger_num").text(danger_num);
    $("#level_num").text(level_num);

    $(".curAstroid").remove();
    $(".curShield").remove();
    $(".curPortal").remove();

    // Clear all active intervals to reset movement and spawning
    clearInterval(collision_track);
    clearInterval(cometInterval);
    clearInterval(score_idx);
    clearInterval(shieldHit);
    clearInterval(portal_collision);
    clearInterval(shieldTimer);
    clearInterval(portalTimer);
    clearInterval(personinv);
    
  }
  

function closeSplashPage() {
  document.getElementById("splash").style.display = "none";
  $("#player").fadeIn();   
  $("#pause-btn").fadeIn(); 
}

function createComet() {

  // console.log("Spawning asteroids...");

  cometInterval = setInterval(function () {
    spawn();
  }, spawn_rate);

}

function removeallComets() {
  $(".curAstroid").children("div").each(function () {
    $(this).remove();
  });
}


function movePlayer() {
  var newPos;

  if (player_can_move == true) {
    if (LEFT == true) {
      // console.log("hello world");
      newPos = parseInt(player.css('left')) - PERSON_SPEED;

      if (newPos < 0) {
        newPos = 0;
      }
      player.css('left', newPos);
      if (shield == true) {
        $(".player_img").attr('src', 'src/player/player_shielded_left.gif');
      }
      else {
        $(".player_img").attr('src', 'src/player/player_left.gif');
      }
    }
    if (RIGHT == true) {
      newPos = parseInt(player.css('left')) + PERSON_SPEED;
      if (newPos > maxPersonPosX) {
        newPos = maxPersonPosX;
      }
      player.css('left', newPos);
      if (shield == true) {
        $(".player_img").attr('src', 'src/player/player_shielded_right.gif');
      }
      else {
        $(".player_img").attr('src', 'src/player/player_right.gif');
      }
    }
    if (UP == true) {
      newPos = parseInt(player.css('top')) - PERSON_SPEED;
      if (newPos < 0) {
        newPos = 0;
      }
      player.css('top', newPos);
      if (shield == true) {
        $(".player_img").attr('src', 'src/player/player_shielded_up.gif');
      }
      else {
        $(".player_img").attr('src', 'src/player/player_up.gif');
      }
    }
    if (DOWN == true) {
      newPos = parseInt(player.css('top')) + PERSON_SPEED;
      if (newPos > maxPersonPosY) {
        newPos = maxPersonPosY;
      }
      player.css('top', newPos);
      if (shield == true) {
        $(".player_img").attr('src', 'src/player/player_shielded_down.gif');
        $(".player_img").css.height = "90px";
        $(".player_img").css.width = "80px";
      }
      else {
        $(".player_img").attr('src', 'src/player/player_down.gif');
      }

      if (shield == true) {
        $(".player_img").css.height = "90px";
        $(".player_img").css.width = "80px";
      }
      else {

        $(".player_img").css.height = "80px";
        $(".player_img").css.width = "80px";

      }
    }
  }
}

function astroidCollision() {
  collision_track = setInterval(function () {
    let player = $("#player");
    let asteroids = $(".curAstroid");

    if (asteroids.length === 0) {
      console.warn("⚠ No asteroids on screen, skipping collision check...");
      return;
    }

    asteroids.each(function () {
      let asteroid = $(this);

      // console.log("Checking collision with asteroid:", asteroid.attr("id"));

      if (isColliding(player, asteroid)) {
        if (shield) {
          console.log("Shield saved the player!");
          shield = false;
          asteroid.remove();
        } else {
          console.log("Player hit!  game over.");
          stopped = true;
          player_can_move = false;
          clearInterval(collision_track); // Stop checking once the game ends
          endGame();
        }
      }
    });
  }, 100);

}
function Shield() {
  shieldTimer = setInterval(function () {
    if (!isPaused){
    createShield();
    window.setTimeout("removeShield()", shieldGone);
    }
  }, shieldOccurrence);
}


function shield_collision() {
  shieldHit = setInterval(function () {
    if (isColliding($("#player"), $("#curShield")) == true) {
      removeShield();
      shield = true;
      collectSound.play();
      collectSound.volume = parseFloat(vol / 100);

    }

  }, 100);
}

function hit_portals() {
  portal_collision = setInterval(function () {

    if (isColliding($("#player"), $("#curPortal")) == true) {

      level_num = level_num + 1;
      console.log("lev :" + level_num);
      danger_num = danger_num + 2;
      console.log("dan:" + danger_num);

      astProjectileSpeed = astProjectileSpeed + (astProjectileSpeed * 0.2);
      removePortal();
      danger.html(danger_num);
      level.html(level_num);
      collectSound.play();
      collectSound.volume = parseFloat(vol / 100);

    }

  }, 100);
}




function update_score() {
  score_idx = setInterval(function () {
    if(!isPaused){
    score = score + 40;
    }
    document.getElementById("score_num").innerHTML = score;
  }, 500);
}
function getRandomNumber(min, max) {
  let num = (Math.random() * (max - min)) + min;
  // console.log(`Random Number Generated: ${num} (min=${min}, max=${max})`);
  return num;

}
function isColliding(o1, o2) {
  return isOrWillCollide(o1, o2, 0, 0);
}

function willCollide(o1, o2, o1_xChange, o1_yChange) {
  return isOrWillCollide(o1, o2, o1_xChange, o1_yChange);
}

//1:33
function isOrWillCollide(o1, o2, o1_xChange, o1_yChange) {

//   if (!o1?.length || !o2?.length) {
//     console.warn("⚠️ Skipping collision check: One of the elements is missing.", { o1, o2 });
//     return false; // Avoid crash
// }
  const o1D = {
    'left': o1.offset().left + o1_xChange,
    'right': o1.offset().left + o1.width() + o1_xChange,
    'top': o1.offset().top + o1_yChange,
    'bottom': o1.offset().top + o1.height() + o1_yChange
  };
  const o2D = {
    'left': o2.offset().left,
    'right': o2.offset().left + o2.width(),
    'top': o2.offset().top,
    'bottom': o2.offset().top + o2.height()
  };
  // Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  if (o1D.left < o2D.right &&
    o1D.right > o2D.left &&
    o1D.top < o2D.bottom &&
    o1D.bottom > o2D.top) {
    // collision detected!
    return true;
  }
  return false;
}

function createPortals() {
  let portal = " <img id = 'curPortal' src = 'src/port.gif'/>";
  onScreenPortal = $("#actual_game"); 
  onScreenPortal.append(portal);

  let y = getRandomNumber(0, 640);
  let x = getRandomNumber(0, 1200);

  $('#curPortal').css('top', y);
  $('#curPortal').css('left', x);
  

  hit_portals();
}



function Portal() {
  portalTimer = setInterval(function () {
    if (!isPaused){
      createPortals();

    window.setTimeout("removePortal()", portalGone);
    }
  }, portalOccurrence);
}

function removePortal() {

  onScreenPortal.children("img").remove();
  clearInterval(portal_collision);
}



function createShield() {
  let shield = " <img id = 'curShield' src = 'src/shield.gif'/>";
  onScreenShield = $("#actual_game"); 
  onScreenShield.append(shield);
  let y = getRandomNumber(0, 640);
  let x = getRandomNumber(0, 1200);

  $('#curShield').css('top', y);
  $('#curShield').css('left', x);
  shield_collision()


}
function removeShield() {

  onScreenShield.children("img").remove();
  clearInterval(shieldHit);
}

function endGame() {
  astProjectileSpeed = 0;
  window.setTimeout("removeallComets();", 2000);
  window.setTimeout("gameOver();", 2000);
  $(".player_img").attr('src', 'src/player/player_touched.gif');
  sound_dead.play();
  sound_dead.volume = parseFloat(vol / 100);

  dropIndex = 1;
  clearInterval(collision_track);
  clearInterval(cometInterval);
  clearInterval(score_idx);
  finalScore.html(score);
  clearInterval(shieldHit);
  clearInterval(portal_collision);
  clearInterval(shieldTimer);
  clearInterval(portalTimer);
  clearInterval(personinv);

}


let pausedIntervals = []; 
function togglePause() {
  if (!isPaused) {
    console.log("Game Paused");

    $("#pause-menu").fadeIn(); 
    $("#pause-overlay").fadeIn(); 

    pausedIntervals = [
      cometInterval,      
      score_idx,   
      shieldHit,
      portal_collision,  
      shieldTimer,    
      portalTimer,    
      personinv   
    ];

    pausedIntervals.forEach(clearInterval); 

    // Stop player movement
    LEFT = RIGHT = UP = DOWN = false;

    isPaused = true;
  } else {
    console.log("Game Resumed");

    $("#pause-menu").fadeOut(); 
    cometInterval = setInterval(spawn, spawn_rate);
    score_idx = setInterval(update_score, 500);
    personinv = setInterval(movePlayer, 10);
    shieldTimer = setInterval(Shield, shieldOccurrence);
    portalTimer = setInterval(Portal, portalOccurrence);
    shieldHit = setInterval(shield_collision, 100);
    portal_collision = setInterval(hit_portals, 100);

    isPaused = false;
  }
}

// Resume Game Function
function resumeGame() {
  togglePause();
  $("#pause-overlay").fadeOut(); 

}

// Restart Game (Resets Everything)
function restartGame() {
  isPaused = true;
  $("#pause-menu").hide();  
  $("#restart-confirmation").fadeIn(); // Show confirmation popup
}

function confirmRestart() {
  
  $("#restart-confirmation").hide(); 
  
  isPaused = true;

  // Stop all game interval
  clearInterval(collision_track);
  clearInterval(cometInterval);
  clearInterval(score_idx);
  clearInterval(shieldHit);
  clearInterval(portal_collision);
  clearInterval(shieldTimer);
  clearInterval(portalTimer);
  clearInterval(personinv);

  // removing movement logic
  $(".curAstroid, #player").css({ "animation": "none", "transition": "none" });

  $("body").append('<div id="restart-overlay">Restarting...</div>');

  //wait 3 seconds before restarting
  setTimeout(() => {
    $("#restart-overlay").remove(); 
    isPaused = false;
    startOver(); 
    startGame(); 
  }, 3000);
  $("#pause-overlay").fadeOut(); 
}

function cancelRestart() {
  $("#restart-confirmation").fadeOut(); 
  $("#pause-menu").show();
}

function exitGame() {
  $("#pause-overlay").fadeOut(); 
  isPaused = false;
  
  gameState = {
    score: $("#score_num").text(),
    danger: $("#danger_num").text(),
    level: $("#level_num").text(),
    playerPosition: {
      left: $("#player").css("left"),
      top: $("#player").css("top"),
    },
  };
  
  $("#pause-menu").hide();
  $("#actual_game").hide();
  $("#landing-page").css("display", "block");

  //change Play Game button to Resume Game
  $("#play-button").text("Resume Game!").attr("onclick", "backtoMenuFromResume()");
}



function backtoMenuFromResume() {
  if (gameState && Object.keys(gameState).length > 0) {
    //restore stored values
    $("#score_num").text(gameState.score);
    $("#danger_num").text(gameState.danger);
    $("#level_num").text(gameState.level);

    //restore player position
    $("#player").css({
      left: gameState.playerPosition.left,
      top: gameState.playerPosition.top,
    });

    $("#landing-page").hide();
    $("#actual_game").show();
    $("#pause-menu").show(); 
    isPaused = true
    
  } else {
    openTutorial(); // If no previous game, start fresh
  }
}