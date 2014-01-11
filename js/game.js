/**
 * Created by DDavison on 12/19/13.
 */

var LOC_DOT = "dot";
var LOC_SCORE = "score";
var LOC_CONTAINER = "mainContainer";
var LOC_MULTIPLIER = "multiplier";
var LOC_POPSOUND = "pop";
var LOC_GETREADYMSG = "getReadyMessage";

var DEFAULT_TIMEOUT = 5000;

var Game = function() {
  this.debugging = true;
  this.name = "Dot Hunt";

  this.version = "1.0.0";

  /**
   * The player's score
   * @type {number}
   */
  this.score = 1;

  /**
   * The current multiplier.
   * @type {number}
   */
  this.multiplier = 1;

  /**
   * The <div id="mainContainer"> element that contains the dot.
   * @type {HTMLElement}
   */
  this.container = null;

  this.settings = null;

  var calculateTimeout = function() {
    return DEFAULT_TIMEOUT; // later, it should calculate the score and reduce the time based on it.
  };

  var timer = null;

  /**
   * Initializer
   * This can load in the cookie, too.
   */
  this.init = function() {
    // configure the settings.
    // start the timer.
    this.settings = localStorage['settings'] ? localStorage['settings'] : {
      // set default settings.
      playSounds: true
    };

    this.container = this.find(LOC_CONTAINER);

    restartTimer();
  };

  var set = function(obj, value) {
    // use the id as the setting name.
    localStorage[obj] = value;
  };

  /**
   * Start / Restart the timer.
   */
  var restartTimer = function() {
    clearInterval(timer);

    timer = setInterval(function() {
      if (game.debugging)
        console.log("Interval hit: resetting multiplier to x1");

        game.multiplier = 1; // reset the multiplier.
        game.newDot();
        game.update();

    }, calculateTimeout());
  };

  /**
   * Pause the game.
   */
  this.pause = function() {
    clearInterval(timer);

  };

  /**
   * Function that executes when it's clicked.
   */
  var clicked = function() {
    // they clicked on appearing dot.

    var scoreWas = game.score;

    // base the score on how small the dot is.

    game.score += (100 * game.multiplier);

    game.multiplier += 1;

    if (game.debugging)
      console.log("[was: %s, now: %s (difference: %s)] [with multiplier: %s]",
        scoreWas,
        game.score,
        (game.score - scoreWas),
        game.multiplier
      );

    // reset the timer

    restartTimer();

    game.update();
    game.newDot();
  };

  /*var playPopSound = function() {
    if (game.settings.playSounds) {
      var sound = game.find(LOC_POPSOUND);
      sound.currentTime = 0;
      sound.play();
    }
  };*/

  var getRandomNumber = function(to) {
    return Math.floor((Math.random() * to)+1);
  };

  this.newDot = function() {
    if (this.debugging)
      console.log("creating new dot.");

    var existingElement = this.find(LOC_DOT);

    if (existingElement != null)
      this.container.removeChild(existingElement);

    var element = document.createElement('div');
    element.id = 'dot';

    // dimensions
    var width = getRandomNumber(500);
    var height = width; // keep it proportional.

    // location properties.
    var x = getRandomNumber(window.innerWidth);
    var y = getRandomNumber(window.innerHeight);
    element.style.backgroundColor = '#fff';
    element.style.position = 'absolute';
    element.style.borderRadius = '50%';
    element.style.mozBorderRadius = '50%';
    element.style.webkitBorderRadius = '50%';

    // before we append the child, we should ensure that it's within the bounds of the screen.
    if ((x + width > window.innerWidth) || (y + height > window.innerHeight)) {
      element = null;
      this.newDot();
    }

    this.container.appendChild(element);

      if (element.addEventListener)
        element.addEventListener('click', clicked, false);
      else if (element.attachEvent)
      element.attachEvent('click', clicked);

    element.style.width = width + "px";
    element.style.height = height + "px";
    element.style.left = x + "px";
    element.style.top = y + "px";

    if (this.debugging)
      console.log("dot created. [x: %s, y: %s][w: %s, h: %s]",
        x, y,
        width, height
      );

    return element;
  };

  /**
   * Game update function.
   * This function will update all UI elements and stuff.
   */
  this.update = function() {
    this.find(LOC_SCORE).innerText = ""+this.score;
    this.find(LOC_MULTIPLIER).innerText = "x" + this.multiplier;
  };

  /**
   * Since we will only be using ID's, we will use game.find() to find elements with id.
   * @param id The id of the element to find.
   * @returns {HTMLElement}
   */
  this.find = function(id) {
    if (id != null)
      return document.getElementById(id);
  };
};