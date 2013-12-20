/**
 * Created by DDavison on 12/19/13.
 */

var LOC_DOT = "dot";
var LOC_SCORE = "score";
var LOC_CONTAINER = "mainContainer";

var DEFAULT_TIMEOUT = 5;

var Game = function() {
  this.debugging = true;
  this.name = "Dot Hunt";

  this.version = "1.0.0";

  this.score = 0;
  this.clickScore = 1;

  this.multiplier = 1;

  var calculateTimeout = function() {
    return DEFAULT_TIMEOUT; // later, it should calculate the score and reduce the time based on it.
  }

  var timeout = calculateTimeout();

  /**
   * Initializer
   * This can load in the cookie, too.
   */
  this.init = function() {
    this.newDot();
  }

  /**
   * Function that executes when it's clicked.
   */
  var clicked = function() {
    // they clicked on appearing dot.
    var scoreWas = game.score;

    game.score += (game.clickScore * game.multiplier);
    game.multiplier += 1;

    if (game.debugging)
      console.log("[was: %s, now: %s (difference: %s)] [with multiplier: %s]",
        scoreWas,
        game.score,
        (game.score - scoreWas),
        game.multiplier
      );

    game.update();
  }

  var getRandomNumber = function(to) {
    return Math.floor((Math.random() * to)+1);
  }

  this.newDot = function() {
    if (this.debugging)
      console.log("creating new dot.");

    var existingElement = this.find(LOC_DOT);

    if (existingElement != null)
      this.find(LOC_CONTAINER).removeChild(existingElement);

    var element = document.createElement('div');
    element.id = 'dot';

    // dimensions
    var width = getRandomNumber(500);
    var height = width; // keep it proportional.

    // location properties.
    var x = getRandomNumber(screen.width);
    var y = getRandomNumber(screen.height);
    element.style.backgroundColor = '#fff';
    element.style.position = 'absolute';
    element.style.borderRadius = '50%';
    element.style.mozBorderRadius = '50%';
    element.style.webkitBorderRadius = '50%';

    this.find(LOC_CONTAINER).appendChild(element);

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
  }

  /**
   * Game update function.
   * This function will update all UI elements and stuff.
   */
  this.update = function() {
    this.find(LOC_SCORE).innerText = this.score;
    this.newDot();
  }

  /**
   * Since we will only be using ID's, we will use game.find() to find elements with id.
   * @param id The id of the element to find.
   * @returns {HTMLElement}
   */
  this.find = function(id) {
    if (id != null)
      return document.getElementById(id);
  }
};