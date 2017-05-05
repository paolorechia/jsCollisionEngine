## Game engine written in Javascript

Initially born as a simple collision engine, over time a few modules based on the collision have been added.
The modules include: cookies, raw buttons, space ships with simple vectorial physics (acceleration with no decaying velocity, i.e., no air resistance or gravity); weapons of fixed speed but with many possible settings (range,velocity, rate of fire etc)

The shipBase.js module is specially interesting since it contains several prototypes which can be added to the ship as seen fit: shield, hull, powersupply, weapons, all of which hold configurable settings, that allow different ships to be coded. As an example, the shipPresets.js module contains four examples of ships constructed using the shipBase.js and weapon.js module.

More features/modules will be (hopefully) included in the future. 

Please note that this engine lacks documentation and an API. It's unlikely that either will be added in the nearby future.

### The Collision engine.

The engine is suitable for small/medium 2d games, because of the broad phase spacial partitioning algorithm does not scale well with size.

Narrow Phase - Uses Separating Axis Theorem to detect collision.
Broad Phase - Grid partitioning.

### Examples
Three examples have been coded so far: the sandbox and the pongGame, both relying solely on the collision module, besides a short snippet of code to get it running; and the asteroids game, which uses all modules up to this date (jan 19 2017).

They can be all seen at work:

[Heroku](http://js-collision-engine.herokuapp.com/)

The asteroids was also submitted to the Kongregate website under the name of "Spaceroids".

[Spaceroids](http://www.kongregate.com/games/Mangus2009/spaceroids)
