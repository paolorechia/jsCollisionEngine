###Game engine written in Javascript

Initially born as a simple collision engine, over time a few modules based onthe collision have grown.
The modules include: cookies, raw buttons, space ships ships with simple vectorial physics (acceleration with no decaying velocity, i.e., no air resistance or gravity); weapons of fixed speed but with many possible settings (range,velocity, rate of fire etc)

The shipBase.js module is specially interesting since it contains several prototypes which can be added to the ship as seen fit: shield, hull, powersupply, weapons, all of which hold configurable settings, that allow different ships to becoded. As an example, the shipPresets.js module contains four examples of ships constructed using the shipBase.js and weapon.js module.

More features/modules will be (hopefully) included in the future.

## The Collision engine.

Applies Separating Axis Theorem to detect collision; Currently lacks spacial partiotining, so it's only viable for small games.

## Examples
Three examples have been coded so far: the sandbox and the pongGame, both relying solely on the collision module, besides a short snippet of code to get it running; and the asteroids game, which uses all modules up to this date (jan 19 2017).

They can be all seen at work:

[http://js-collision-engine.herokuapp.com/](Heroku)

The asteroids was also submitted to the Kongregate website under the name of "Spaceroids".

[http://www.kongregate.com/games/Mangus2009/spaceroids](Spaceroids)
