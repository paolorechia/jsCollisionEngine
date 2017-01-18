file=index.html
touch index.html
cat << DOCSTART >$file
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/> <!--320-->
</head>
<body>
<canvas id="umCanvas" width="800" height="600">
<audio id="music">
<source src="music.mp3" type ="audio/mpeg">
</audio>
 
<script> 
DOCSTART
scripts=$(ls | grep .js | grep -v compressed | tr '\n' '@')
scripts=$(echo $scripts | tr ' ' '@' )
numberFiles=$(echo $scripts | grep -o @ | wc -l)
index=`expr index $scripts $ `
i=0
while [ $i -ne $numberFiles ]; do
    index=`expr index $scripts @ `
    index=`expr $index - 1`
    substring=${scripts:0:$index}
    echo $substring
    java -jar ~/bin/closure-compiler-v20161201.jar $substring >> $file
    index=`expr $index + 1`
    scripts=${scripts:$index}
    i=`expr $i + 1`
done;
cat <<DOCEND >>$file
</script>
</body>
</body>

</html>
DOCEND

cp index.html index.php
