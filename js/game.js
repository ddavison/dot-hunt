/**
 * Created by DDavison on 12/19/13.
 */

var LOC_DOT = "dot";
var LOC_SCORE = "score";
var LOC_CONTAINER = "mainContainer";
var LOC_MULTIPLIER = "multiplier";
var LOC_POPSOUND = "pop";
var LOC_GETREADYMSG = "getReadyMessage";
var LOC_COUNTERCONTAINER = "counterContainer";

var TIMEOUT = 5000;

var Game = (function() {
  this.debugging = true;
  this.name = "Dot Hunt";

  this.version = "1.0.0";

  var hasStarted = false;

  this.size = -1;

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

  /**
   * Calculates the timeout.
   * @returns {number}
   */
  var calculateTimeout = function() {
    if (TIMEOUT > 500) TIMEOUT -= 50;
    return TIMEOUT;
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

      // game over.
      if (hasStarted) {
        document.write("Game Over!\n\nYour score was: " + game.score + "\n\n(until i can think of a better way to show this.");
        return;
      }
      else {
        game.newDot();
        game.update();
        hasStarted = true;
      }
    }, TIMEOUT);
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

    game.score += (game.multiplier * game.calculateScore(game.size));

    // reduce the timeout per click.
    TIMEOUT = calculateTimeout();

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

  /**
   * Fetches a random number between 0 and whatever you specify. (used for calculating circle sizes)
   * @param to
   * @returns {number}
   */
  var getRandomNumber = function(to) {
    return Math.floor((Math.random() * to)+1);
  };

  /**
   * Calculate the score based on the circle size.
   * @param size The size of the circle.
   * @returns {number} the calculated score.
   */
  this.calculateScore = function(size) {
    var max = 0;
    if (document.body.clientWidth > document.body.clientHeight)
      max = document.body.clientWidth;
    else
      max = document.body.clientHeight;

    return Math.floor((1000 - (size/(max/1000))) + 100);
  }

  /**
   * Creates a new dot on the page.
   * @returns {HTMLElement}
   */
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

    this.size = width;

    return element;
  };

  /**
   * Game update function.
   * This function will update all UI elements and stuff.
   */
  this.update = function() {
    this.find(LOC_SCORE).innerText = ""+this.score;
    this.find(LOC_MULTIPLIER).innerText = "x" + this.multiplier;

    if (this.debugging) {
      if (this.find("to")) this.find(LOC_COUNTERCONTAINER).removeChild(this.find("to"));
      var toElement = document.createElement("span");
      toElement.id = "to";
      toElement.innerText = "(timeout: " + TIMEOUT + ")";
      this.find(LOC_COUNTERCONTAINER).appendChild(toElement);

      if (this.find("pause")) this.find(LOC_COUNTERCONTAINER).removeChild(this.find("pause"));
      var pauseLink = document.createElement("a");
      pauseLink.id = "pause";
      pauseLink.href = "javascript:game.pause()";
      pauseLink.innerText = "Pause";
      this.find(LOC_COUNTERCONTAINER).appendChild(pauseLink);
    }
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
});