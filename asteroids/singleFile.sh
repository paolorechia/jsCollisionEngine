file=index.html
touch index.html
cat << DOCSTART >$file
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/> <!--320-->
</head>
<body>
<canvas id="umCanvas" width="800" height="600">
<audio id="bleep">
<source src="Pickup_Coin4.mp3" type ="audio/mpeg">
</audio>
<script> 
DOCSTART
cat ../webaudio/howler* >> $file
java -jar ~/bin/closure-compiler-v20170423.jar ../sound.js >> $file
java -jar ~/bin/closure-compiler-v20170423.jar ../divisor.js >> $file
java -jar ~/bin/closure-compiler-v20170423.jar ../collision.js >> $file
java -jar ~/bin/closure-compiler-v20170423.jar ../particles.js >> $file
java -jar ~/bin/closure-compiler-v20170423.jar ../explosion.js         >> $file
java -jar ~/bin/closure-compiler-v20170423.jar ../shipBase.js         >> $file
java -jar ~/bin/closure-compiler-v20170423.jar ../weapon.js         >> $file
java -jar ~/bin/closure-compiler-v20170423.jar ../shipPresets.js         >> $file
java -jar ~/bin/closure-compiler-v20170423.jar ../broadCollision.js         >> $file
java -jar ~/bin/closure-compiler-v20170423.jar ../updater.js         >> $file
java -jar ~/bin/closure-compiler-v20170423.jar ../buttons.js         >> $file
java -jar ~/bin/closure-compiler-v20170423.jar ../cookies.js         >> $file
java -jar ~/bin/closure-compiler-v20170423.jar ../cursor.js         >> $file

java -jar ~/bin/closure-compiler-v20170423.jar main.js         >> $file
java -jar ~/bin/closure-compiler-v20170423.jar input.js        >> $file
cat <<DOCEND >>$file
</script>
</body>
</body>

</html>
DOCEND

cp index.html index.php
