#!/bin/bash
inputFiles=$(ls | grep .wav)
inputFiles=$(echo $inputFiles | tr ' ' '@' | tr '\n' '@')
#echo $inputFiles
numberFiles=$(echo $inputFiles | grep -o '@' | wc -l)
#echo $numberFiles
index=`expr index $inputFiles $ `
i=0
while [ $i -ne $numberFiles ]; do
    index=`expr index $inputFiles @ `
    index=`expr $index - 1`
    substring=${inputFiles:0:$index}
#    echo $substring
    index=`expr $index - 3`
    output=${substring:0:$index}
    output=${output}mp3
    echo $output
    ffmpeg -i $substring -codec:a libmp3lame -b:a 8k $output
    index=`expr $index + 4`
    inputFiles=${inputFiles:$index}
    i=`expr $i + 1`
done
