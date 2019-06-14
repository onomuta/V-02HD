navigator.requestMIDIAccess().then(onMIDISuccess,onMIDIFailure);
var midi = null;
var inputs = [];
var outputs = [];
var output = null;
var chs = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
var ch = 1;

var assignList = [
  [10,"ビデオ・フェーダーの位置をコントロールします。",127],
  [11,"EFFECTS TYPE の値をコントロールします。",3],
  [12,"MIX/WIPE TIME の値をコントロールします。",40],
  [13,"PinP TIME の値をコントロールします。",40],
  [14,"KEY TIME の値をコントロールします。",40],
  [15,"PinP POSITION H の値をコントロールします。",100],
  [16,"PinP POSITION V の値をコントロールします。",100],
  [17,"PinP SIZE の値をコントロールします。",100],
  [18,"PinP VIEW ZOOM の値をコントロールします。",100],
  [19,"KEY SOURCE の値をコントロールします。",2],
  [20,"KEY LEVEL の値をコントロールします。",127],
  [21,"KEY GAIN の値をコントロールします。",127],
  [22,"KEY MIX LEVEL の値をコントロールします。",127],
  [23,"VFX SW の値をコントロールします。",1],
  [24,"VFX TYPE の値をコントロールします。PART MOSAIC、BACKGROUND MOSAIC、FULL MOSAIC、WAVE、RGB REPLACE、COLORPASS、NEGATIVE、COLORIZE、POSTERIZE、SILHOUETTE、EMBOSS、FIND EDGES、MONOCOLOR、HUE OFFSET",15],
  [25,"VFX MIX LEVEL の値をコントロールします。",127],
  [26,"［OUTPUT FADE］つまみを左に回したときと同じ効果が得られます。",63],
  [27,"［OUTPUT FADE］つまみを右に回したときと同じ効果が得られます。",127],
  [28,"AUDIO INPUT LEVEL（INPUT 1）の値をコントロールします。",127],
  [29,"AUDIO INPUT LEVEL（INPUT 2）の値をコントロールします。",127],
  [30,"AUDIO INPUT LEVEL（AUDIO IN）の値をコントロールします。",127],
  [31,"AUDIO OUTPUT LEVEL の値をコントロールします。",127],
  [52,"［1］ボタンを押したときと同じ効果が得られます。",127],
  [53,"［2］ボタンを押したときと同じ効果が得られます。",127],
  [54,"「<=AUTO TAKE=>」で映像を切り替えます。",127],
  [55,"「<=CUT=>」で映像を切り替えます。",127],
  [56,"静止画表示を切り替えます。",1],
  [57,"AUDIO INPUT 1 MUTE の値をコントロールします。",1],
  [58,"AUDIO INPUT 2 MUTE の値をコントロールします。",1],
  [59,"AUDIO IN MUTE の値をコントロールします。",1],
  [60,"AUDIO OUTPUT MUTE の値をコントロールします。",1]
];


/////////////////////////////////////////////////////////////////////////////
var main = document.querySelector('#slider-box');
var fragment = document.createDocumentFragment();
for(var i=0; i < assignList.length; i++ ){
  var container = document.createElement('div');
  container.classList.add('slide-container');
  
  var label = document.createElement('div');
  label.classList.add('label');
  label.id =('label' + assignList[i][0]);
  label.innerHTML = "CC"+assignList[i][0];
  container.appendChild(label);

  // var comment = document.createElement('div');
  // comment.classList.add('comment');
  // comment.id =('comment' + assignList[i][0]);
  // comment.innerHTML = assignList[i][1];
  // container.appendChild(comment);

  var disp = document.createElement('div');
  disp.classList.add('display');
  disp.id =('display' + assignList[i][0]);
  disp.innerHTML = 0;
  container.appendChild(disp);

  var slider = document.createElement('div');
  slider.classList.add('slider');
  slider.id =('slider' + assignList[i][0]);
  container.appendChild(slider);

  fragment.appendChild(container);

  var comment = document.createElement('div');
  comment.classList.add('comment');
  comment.id =('comment' + assignList[i][0]);
  comment.innerHTML = assignList[i][1];
  fragment.appendChild(comment);



}
// 最後に追加！
main.appendChild(fragment);
/////////////////////////////////////////////////////////////////////////////

function onMIDISuccess(m){
  midi = m;
  var it = midi.inputs.values();
  for(var o = it.next(); !o.done; o = it.next()){
    inputs.push(o.value);
  }
  var ot = midi.outputs.values();
  for(var o = ot.next(); !o.done; o = ot.next()){
    outputs.push(o.value);
  }
  
  output = outputs[0];
  outputs.forEach(function(element, index) {
    var option = document.createElement('option');
    option.appendChild(document.createTextNode(element.name));
    option.setAttribute('value', index);
    document.getElementById('select-midi-output-device').appendChild(option);
  });
  document.getElementById('select-midi-output-device').onchange = function() {
    output = outputs[this.value];
  };  
  for(var cnt=0;cnt < inputs.length;cnt++){
    inputs[cnt].onmidimessage = onMIDIEvent;
  }
}

chs.forEach(function(value, index) {
  var option = document.createElement('option');
  option.appendChild(document.createTextNode(value));
  option.setAttribute('value', index);
  document.getElementById('select-midi-output-ch').appendChild(option);
});
document.getElementById('select-midi-output-ch').onchange = function() {
  ch = chs[this.value];
};

function onMIDIEvent(e){
  if(e.data[2] != 0){ 
    // なにかをうけとったときの処理
    // console.log(e.data[2]);
    // console.log(e.data[1]);
  }
}

function onMIDIFailure(){
  console.log("munen!");
};

function sendCC(cc, val){
  if(output){
    output.send([0xB0 + ch-1, cc, val]);
  }
}

/////////////////////////////////////////////////////////////////////////////
var sliderOption = {
  start: [ 0 ],
  range: {
    'min': [  0 ],
    'max': [ 127 ]
  },
  step: 1,
  connect: "lower",
};

var ccList = [];
for(var i=0; i<assignList.length; i++ ){
  ccList.push(document.getElementById('slider' + assignList[i][0]));

  sliderOption.range.max = assignList[i][2];
  noUiSlider.create(ccList[i], sliderOption);


}

ccList[0].noUiSlider.on('slide', function(){sliderMove(0)});
ccList[1].noUiSlider.on('slide', function(){sliderMove(1)});
ccList[2].noUiSlider.on('slide', function(){sliderMove(2)});
ccList[3].noUiSlider.on('slide', function(){sliderMove(3)});
ccList[4].noUiSlider.on('slide', function(){sliderMove(4)});
ccList[5].noUiSlider.on('slide', function(){sliderMove(5)});
ccList[6].noUiSlider.on('slide', function(){sliderMove(6)});
ccList[7].noUiSlider.on('slide', function(){sliderMove(7)});
ccList[8].noUiSlider.on('slide', function(){sliderMove(8)});
ccList[9].noUiSlider.on('slide', function(){sliderMove(9)});
ccList[10].noUiSlider.on('slide', function(){sliderMove(10)});
ccList[11].noUiSlider.on('slide', function(){sliderMove(11)});
ccList[12].noUiSlider.on('slide', function(){sliderMove(12)});
ccList[13].noUiSlider.on('slide', function(){sliderMove(13)});
ccList[14].noUiSlider.on('slide', function(){sliderMove(14)});
ccList[15].noUiSlider.on('slide', function(){sliderMove(15)});
ccList[16].noUiSlider.on('slide', function(){sliderMove(16)});
ccList[17].noUiSlider.on('slide', function(){sliderMove(17)});
ccList[18].noUiSlider.on('slide', function(){sliderMove(18)});
ccList[19].noUiSlider.on('slide', function(){sliderMove(19)});
ccList[20].noUiSlider.on('slide', function(){sliderMove(20)});
ccList[21].noUiSlider.on('slide', function(){sliderMove(21)});
ccList[22].noUiSlider.on('slide', function(){sliderMove(22)});
ccList[23].noUiSlider.on('slide', function(){sliderMove(23)});
ccList[24].noUiSlider.on('slide', function(){sliderMove(24)});
ccList[25].noUiSlider.on('slide', function(){sliderMove(25)});
ccList[26].noUiSlider.on('slide', function(){sliderMove(26)});
ccList[27].noUiSlider.on('slide', function(){sliderMove(27)});
ccList[28].noUiSlider.on('slide', function(){sliderMove(28)});
ccList[29].noUiSlider.on('slide', function(){sliderMove(29)});
ccList[30].noUiSlider.on('slide', function(){sliderMove(30)});



function sliderMove(num){
  var a = parseInt(ccList[num].noUiSlider.get());
  document.getElementById("display" + assignList[num][0]).innerHTML = a;
  sendCC(assignList[num][0], a);
  console.log(assignList[num][0] + "/"+a);
}
