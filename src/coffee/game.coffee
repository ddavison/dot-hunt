###
Created by DDavison on 12/19/13.
###
LOC_DOT = "dot"
LOC_SCORE = "score"
LOC_CONTAINER = "mainContainer"
LOC_MULTIPLIER = "multiplier"
LOC_POPSOUND = "pop"
LOC_GETREADYMSG = "getReadyMessage"
LOC_COUNTERCONTAINER = "counterContainer"
TIMEOUT = 5000

window.Game = (->
  @debugging = true
  @name = "Dot Hunt"
  @version = "1.0.0"
  hasStarted = false
  @size = -1

  ###
  The player's score
  @type {number}
  ###
  @score = 1

  ###
  The current multiplier.
  @type {number}
  ###
  @multiplier = 1

  ###
  The <div id="mainContainer"> element that contains the dot.
  @type {HTMLElement}
  ###
  @container = null
  @settings = null

  ###
  Calculates the timeout.
  @returns {number}
  ###
  calculateTimeout = ->
    TIMEOUT -= 50  if TIMEOUT > 500
    TIMEOUT

  timer = null

  ###
  Initializer
  This can load in the cookie, too.
  ###
  @init = ->

    # configure the settings.
    # start the timer.

    # set default settings.
    @settings = (if localStorage["settings"] then localStorage["settings"] else playSounds: true)
    @container = @find(LOC_CONTAINER)
    restartTimer()
    return

  set = (obj, value) ->

    # use the id as the setting name.
    localStorage[obj] = value
    return


  ###
  Start / Restart the timer.
  ###
  restartTimer = ->
    clearInterval timer
    timer = setInterval(->
      console.log "Interval hit: resetting multiplier to x1"  if game.debugging

      # game over.
      if hasStarted
        document.write "Game Over!\n\nYour score was: " + game.score + "\n\n(until i can think of a better way to show this."
        return
      else
        game.newDot()
        game.update()
        hasStarted = true
      return
    , TIMEOUT)
    return


  ###
  Pause the game.
  ###
  @pause = ->
    clearInterval timer
    return


  ###
  Function that executes when it's clicked.
  ###
  clicked = ->

    # they clicked on appearing dot.
    scoreWas = game.score

    # base the score on how small the dot is.
    game.score += (game.multiplier * game.calculateScore(game.size))

    # reduce the timeout per click.
    TIMEOUT = calculateTimeout()
    game.multiplier += 1
    console.log "[was: %s, now: %s (difference: %s)] [with multiplier: %s]", scoreWas, game.score, (game.score - scoreWas), game.multiplier  if game.debugging

    # reset the timer
    restartTimer()
    game.update()
    game.newDot()
    return


  #var playPopSound = function() {
  #    if (game.settings.playSounds) {
  #      var sound = game.find(LOC_POPSOUND);
  #      sound.currentTime = 0;
  #      sound.play();
  #    }
  #  };

  ###
  Fetches a random number between 0 and whatever you specify. (used for calculating circle sizes)
  @param to
  @returns {number}
  ###
  getRandomNumber = (to) ->
    Math.floor (Math.random() * to) + 1


  ###
  Calculate the score based on the circle size.
  @param size The size of the circle.
  @returns {number} the calculated score.
  ###
  @calculateScore = (size) ->
    max = 0
    if document.body.clientWidth > document.body.clientHeight
      max = document.body.clientWidth
    else
      max = document.body.clientHeight
    Math.floor (1000 - (size / (max / 1000))) + 100


  ###
  Creates a new dot on the page.
  @returns {HTMLElement}
  ###
  @newDot = ->
    console.log "creating new dot."  if @debugging
    existingElement = @find(LOC_DOT)
    @container.removeChild existingElement  if existingElement?
    element = document.createElement("div")
    element.id = "dot"

    # dimensions
    width = getRandomNumber(500)
    height = width # keep it proportional.

    # location properties.
    x = getRandomNumber(window.innerWidth)
    y = getRandomNumber(window.innerHeight)
    element.style.backgroundColor = "#fff"
    element.style.position = "absolute"
    element.style.borderRadius = "50%"
    element.style.mozBorderRadius = "50%"
    element.style.webkitBorderRadius = "50%"

    # before we append the child, we should ensure that it's within the bounds of the screen.
    if (x + width > window.innerWidth) or (y + height > window.innerHeight)
      element = null
      @newDot()
    @container.appendChild element
    if element.addEventListener
      element.addEventListener "click", clicked, false
    else element.attachEvent "click", clicked  if element.attachEvent
    element.style.width = width + "px"
    element.style.height = height + "px"
    element.style.left = x + "px"
    element.style.top = y + "px"
    console.log "dot created. [x: %s, y: %s][w: %s, h: %s]", x, y, width, height  if @debugging
    @size = width
    element


  ###
  Game update function.
  This function will update all UI elements and stuff.
  ###
  @update = ->
    @find(LOC_SCORE).innerText = "" + @score
    @find(LOC_MULTIPLIER).innerText = "x" + @multiplier
    if @debugging
      @find(LOC_COUNTERCONTAINER).removeChild @find("to")  if @find("to")
      toElement = document.createElement("span")
      toElement.id = "to"
      toElement.innerText = "(timeout: " + TIMEOUT + ")"
      @find(LOC_COUNTERCONTAINER).appendChild toElement
      @find(LOC_COUNTERCONTAINER).removeChild @find("pause")  if @find("pause")
      pauseLink = document.createElement("a")
      pauseLink.id = "pause"
      pauseLink.href = "javascript:game.pause()"
      pauseLink.innerText = "Pause"
      @find(LOC_COUNTERCONTAINER).appendChild pauseLink
    return


  ###
  Since we will only be using ID's, we will use game.find() to find elements with id.
  @param id The id of the element to find.
  @returns {HTMLElement}
  ###
  @find = (id) ->
    document.getElementById id  if id?

  return
)