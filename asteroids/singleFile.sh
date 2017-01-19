file=index.html
touch index.html
cat << DOCSTART >$file
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/> <!--320-->
</head>
<body>
<canvas id="umCanvas" width="800" height="600">
<audio id="selectLoop">
<source src="selectLoop.mp3" type ="audio/mpeg">
</audio>
<audio id="loopA">
<source src="loopA.mp3" type ="audio/mpeg">
</audio>
 
<script> 
DOCSTART

java -jar ~/bin/closure-compiler-v20161201.jar ../collision.js >> $file
java -jar ~/bin/closure-compiler-v20161201.jar shipBase.js         >> $file
java -jar ~/bin/closure-compiler-v20161201.jar weapon.js         >> $file
java -jar ~/bin/closure-compiler-v20161201.jar shipPresets.js         >> $file
java -jar ~/bin/closure-compiler-v20161201.jar main.js         >> $file
java -jar ~/bin/closure-compiler-v20161201.jar input.js        >> $file
cat <<DOCEND >>$file
</script>
</body>
</body>

</html>
DOCEND

cp index.html index.php
