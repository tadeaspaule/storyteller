var storyData;
var stats;
var startStats;
var nodes;
var choices;
var theme;

var currentNode;

var choicesDiv;
var nodeHeader;
var mainText;

function preload(){
  storyData = loadJSON('storydata.json');
}

function setup() {
  nodes = storyData.nodes;
  stats = storyData.stats;
  for (var i = 0; i < stats.length; i++){
  	if (stats[i][1] == 'Number') stats[i][2] = int(stats[i][2]);
  }
  startStats = JSON.parse(JSON.stringify(stats));
  choices = storyData.choices;
  theme = storyData.theme;
  setupUI();
}


function getStatIndex(statname){
  for (var i = 0; i < stats.length; i++){
  	if (stats[i][0] == statname) return i;
  }
  return -1;
}
function getStatType(statname){
  for (var i = 0; i < stats.length; i++){
  	if (stats[i][0] == statname) return stats[i][1];
  }
}
function getStatVal(statname){
  for (var i = 0; i < stats.length; i++){
  	if (stats[i][0] == statname) return stats[i][2];
  }
}

function checkRequirements(reqstring){
  if (reqstring == "") return true;
  var splitstr = reqstring.split(' ');
	var stat = splitstr[0];
  var op = splitstr[1];
  var value = splitstr.slice(2);
  var stattype = getStatType(stat);
  var statval = getStatVal(stat);
  if (stattype == 'Number'){
  	if ((op == '>' || op == '>=') && statval > int(value)) return true;
    if ((op == '<' || op == '<=') && statval < int(value)) return true;
    if (op == '=' && statval == int(value)) return true;
    print("Failed at "+reqstring);
    return false;
  }
  else if (stattype == 'True/False'){
  	if (op == '=' && stats.stat[2] == boolean(value)) return true;
    if (op == '!=' && stats.stat[2] != boolean(value)) return true;
    print("Failed at "+reqstring);
    return false;
  }
  else if (stattype == 'Text'){
  	if (op == '=' && stats.stat[2] == value) return true;
    print("Failed at "+reqstring);
    return false;
  }
  else if (stattype == 'List'){
  	if (op == 'has' && stats.stat[2].indexOf(value) > -1) return true;
    if (op == '!has' && stats.stat[2].indexOf(value) == -1) return true;
    print("Failed at "+reqstring);
    return false;
  }
  else {
   print("nope");
  }
}

function checkValidNode(nodename){
	for (var i = 0; i < nodes.length; i++){
  	if (nodes[i].name == nodename) return true;
  }
  return false;
}

function getNodeIndex(nodename){
  for (var i = 0; i < nodes.length; i++){
  	if (nodes[i].name == nodename) return i;
  }
  return 0;
}

function applyResults(results){
  for (var i = 0; i < results.length; i++){
  	var res = results[i].split(' ');
    var stat = res[0];
    var op = res[1];

    var val = res.slice(2);

    var stattype = getStatType(stat);
    var ind = getStatIndex(stat);
    if (ind == -1) continue;
    if (stattype == 'Number') {
      val = int(val);
      if (val[0]) val = val[0];
      if (op == '+') stats[ind][2] += val;
      if (op == '-') stats[ind][2] -= val;
      if (op == '=') stats[ind][2] = val;
    }
    else if (stattype == 'True/False'){
      if (op == '=') stats[ind][2] = boolean(val);
    }
    else if (stattype == 'Text'){
      if (op == '=') stats[ind][2] = val;
    }
    else if (stattype == 'List'){
      if (op == 'gets') stats[ind][2].push(val);
      if (op == 'loses') stats[ind][2].remove(val);
    }
    else {
     print("nope");
    }
  }
}

function setupChoices(){
  choicesDiv.html('');
  choicesDiv.remove();
  choicesDiv = createDiv();
  var divcount = 0;
  for (var ch = 0; ch < choices[currentNode].length; ch++){
    var valid = true;
    var destname = choices[currentNode][ch].destination;
    if (!checkValidNode(destname)) continue;
  	for (var req = 0; req < choices[currentNode][ch].required.length; req++){
    	if (!checkRequirements(choices[currentNode][ch].required[req])) valid = false;
    }
    if (!valid) continue;

    var div = createDiv();
    div.class('choicediv');
    div.style('background',theme.color5);
    div.style('border-color',theme.color6);
    div.style('color',theme.color7);
    var choicetext = createElement('p',choices[currentNode][ch].text);
    choicetext.class('choicetext');
    div.child(choicetext);
    const i2 = getNodeIndex(destname);
    const results = choices[currentNode][ch].results;

    div.mousePressed( () => {
      print(i2);
      applyResults(results);
      changeNode(i2);
    });
    choicesDiv.child(div);
    divcount++;
  }
  if (divcount == 0){
  	// the reader has no choices available, adding a reset game choice
    var div = createDiv();
    div.class('choicediv');
    div.style('background',theme.color5);
    div.style('border-color',theme.color6);
    div.style('color',theme.color7);
    var choicetext = createElement('p',"Restart from the beginning");
    choicetext.class('choicetext');
    div.child(choicetext);
    div.mousePressed( () => {
      stats = JSON.parse(JSON.stringify(startStats));
      changeNode(0);
    });
  }
}

function changeNode(i){
  mainText.value(nodes[i].text);
  nodeHeader.html(nodes[i].name);
	currentNode = i;
  setupChoices();
}

function setupUI(){
  document.body.style.backgroundColor = theme.bg;
  nodeHeader = select('.nodeheader');
  nodeHeader.style('color',theme.color7);
  mainText = select('.maintextarea');
  mainText.style('color',theme.color7);
  select('.textdiv').style('background',theme.color2);
  choicesDiv = select('#choicesdiv');
  print("g");
  changeNode(0);

}

/*function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'savedstory.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
 }*/