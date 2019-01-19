/*default values*/
const defaultChoiceText = 'Choice Text (type here to edit)';
const defaultAddNodeText = 'Add node';
const defaultSelectedNodeCol = '#FF0000';
const defaultNotSelectedNodeCol = '#000';
const defaultTextHint = 'Tell your story here...';
const defaultDestHint = 'For example: Node2';
const defaultRequirementsHint = 'For example:\nstrength >= 8\ninventory has potion';
const defaultRewardsHint = 'For example:\nstrength + 1\ninventory gets potion';
const defaultDestText = 'Leads to:';
const defaultAddReqText = 'Add requirements';
const defaultAddRewardsText = 'Add results';
const defaultAddChoiceText = 'Add choice';

var themeDiv;
var helpDiv;
var helpStats;
var helpRequirements;
var helpResults;
var helpNodes;
var helpText;
var statsDiv;
var statsText;

var startStatsDiv;
var startStatEntries;

var nodes = [];
var currentNode = -1;

var currentTheme = {
  'navicolor': 'black',				// color of up/down arrows
  'bg':     '#ffffff',				// background color
  'color1': '#C1EDDA',  			// menu backgrounds
  'color2': '#A3F0DD',  			// textarea background
  'color3': '#D2F2EB',  			// button background
  'color4': '#AEE3C0',  			// button border
  'color5': '#A1EFD4',  			// choicediv background
  'color6': '#49D3B8',  			// choicediv border
  'color7': '#000000',  			// font color
  'color8': '#229A6A',  			// font color for selected node
  'color9': '#194221',  			// font color for navigation (buttons etc)
}

var choices = [];
var nodeChoices = [];
var choicesDiv;
var choiceDivs = [];
var addChoiceButton;
var removeChoiceButtons = [];
var topmenuDiv;
var nodeHeader;
var nodesDiv;
var naviDiv;
var txtDiv;
var txtArea;
var borderColor = '#AAAAFF';

function setup() {
  frameRate(10);
  setupUI();
  updateTheme();
}

function changeArrowColor(color){
    currentTheme.navicolor = color;
    if (color == 'white'){
        select('#whitearrows').style('text-decoration:underline;');
        select('#blackarrows').style('text-decoration:none;');
    }
    else {
        select('#whitearrows').style('text-decoration:none;');
        select('#blackarrows').style('text-decoration:underline;');
    }
    updateTheme();
}

function updateTheme(){
  /*
  'navicolor' - color of up/down arrows
  'bg' - background color
  'color1' - menu backgrounds
  'color2' - textarea background
  'color3' - button background
  'color4' - button border
  'color5' - menu background 2 (choice divs, help/stat/etc divs)
  'color6' - menu border 2
  'color7' - font color
  'color8' - font color for selected node
  'color9' - font color for navigation (buttons etc)
  */
  currentTheme.bg = select("#colorBG").value();
  currentTheme.color1 = select("#color1").value();
  currentTheme.color2 = select("#color2").value();
  currentTheme.color3 = select("#color3").value();
  currentTheme.color4 = select("#color4").value();
  currentTheme.color5 = select("#color5").value();
  currentTheme.color6 = select("#color6").value();
  currentTheme.color7 = select("#color7").value();
  currentTheme.color8 = select("#color8").value();
  currentTheme.color9 = select("#color9").value();


  document.body.style.backgroundColor = currentTheme.bg;

  topmenuDiv.style('background',currentTheme.color1);
  nodesDiv.style('background',currentTheme.color1);

  txtDiv.style('background',currentTheme.color2);

  addChoiceButton.style('background',currentTheme.color3);
  select('.addnodebutton').style('background',currentTheme.color3);

  addChoiceButton.style('border-color',currentTheme.color4);
  select('.addnodebutton').style('border-color',currentTheme.color4);
  txtArea.style('border-color',currentTheme.color4+'aa');

  txtArea.style('color',currentTheme.color7);
  nodeHeader.style('color',currentTheme.color7);
  helpText.style('color',currentTheme.color7);
  statsText.style('color',currentTheme.color7);

  addChoiceButton.style('color',currentTheme.color9);
  select('.addnodebutton').style('color',currentTheme.color9);
  topmenuDiv.style('color',currentTheme.color9);
  helpNodes.style('color',currentTheme.color9);
  helpStats.style('color',currentTheme.color9);
  helpRequirements.style('color',currentTheme.color9);
  helpResults.style('color',currentTheme.color9);

  changeNode(currentNode); // applies color changes to choice divs & node list

  for (var i = 0; i < nodes.length; i++){
    nodes[i].naviDown.attribute('src','/static/storyteller/images/down-'+currentTheme.navicolor+'.png');
    nodes[i].naviUp.attribute('src','/static/storyteller/images/up-'+currentTheme.navicolor+'.png');
  }

  // apply changes to theme div as well
  toggleThemeDiv();
  toggleThemeDiv();
}

function saveStory(filename, stats) {
  // first make sure it's saving the most up to date version
  nodeChoices[currentNode] = JSON.parse(JSON.stringify(choices));
  updateUI();

  // we're saving one json file, which contains 4 areas of data about the story:
  // - choices data (just saving the nodeChoices object this script is using)
  // - node data (list of nodes, their names & texts)
  // - stats data (stat names, types, and values)
  // - theme data (just saving the currentTheme object this script is using)

  var nodesData = [];
  for (var i = 0; i < nodes.length; i++) {
    nodesData.push({
      'text': nodes[i].nodeText,
      'name': nodes[i].nodeElem.html()
    });
  }
	print(nodeChoices);

  // putting them together
  var all = {
    'choices': nodeChoices,
    'nodes': nodesData,
    'stats': stats,
    'theme': currentTheme
  };
  print("Object being saved:");
  print(all);

 // finally we make a .zip file containing the story data (in storydata.json) together with all necessary HTML/CSS/JS files
 // this can then function together as a website for reading the story stored in storydata.json
  var zip = new JSZip();
  zip.file("style.css", loadFile('/static/storyteller/reader-files/style.css'));
  zip.file("index.html", loadFile('/static/storyteller/reader-files/index.html'));
  zip.file("p5.dom.min.js", loadFile('/static/storyteller/reader-files/p5.dom.min.js'));
  zip.file("p5.min.js", loadFile('/static/storyteller/reader-files/p5.min.js'));
  zip.file("p5.sound.min.js", loadFile('/static/storyteller/reader-files/p5.sound.min.js'));
  zip.file("sketch.js", loadFile('/static/storyteller/reader-files/sketch.js'));
  zip.file("storydata.json",JSON.stringify(all));
  zip.generateAsync({type:"blob"}).then(function (blob) {saveAs(blob, "storyteller-reader.zip");});
}

function loadFile(filePath) {
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", filePath, false);
  xmlhttp.send();
  if (xmlhttp.status==200) {
    result = xmlhttp.responseText;
  }
  return result;
}

function downloadObjectAsJson(exportObj, exportName) {
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

function handleFiles(files) {
  read = new FileReader();
  read.readAsBinaryString(files[0]);
  read.onloadend = function() {
    var x = JSON.parse(read.result);
    print("Reading the following object:");
    print(x);
    handleImportedData(x);
  }
}

function handleImportedData(f) {
  var d = JSON.parse(JSON.stringify(f));
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].nodeElem.remove();
    nodes[i].nodeDiv.html('');
    nodes[i].nodeDiv.remove();
  }

  nodes = [];
  for (var i = 0; i < d.nodes.length; i++) {
    addNode();
    nodes[i].nodeElem.html(d.nodes[i].name);
    nodes[i].nodeText = d.nodes[i].text;
  }
  nodeChoices = JSON.parse(JSON.stringify(d.choices));
  currentNode = 0;
  choices = JSON.parse(JSON.stringify(nodeChoices[0]));
  changeNode(0);
  print("Object that got loaded:");
  print(d);
}

function draw() {
  updateUI();
  //nodeHeader.html(imgURIs.length);
}

function moveUp(i){
	if (i > 0){
    // --------- changing node names and node texts
    var tmpText = nodes[i].nodeText;
    var tmpName = nodes[i].nodeElem.html();
    nodes[i].nodeText = nodes[i-1].nodeText;
    nodes[i].nodeElem.html(nodes[i-1].nodeElem.html());
    nodes[i-1].nodeText = tmpText;
    nodes[i-1].nodeElem.html(tmpName);
    if (currentNode == i) {
      nodeHeader.html(nodes[i].nodeElem.html());
      txtArea.value(nodes[i].nodeText);
    }
    else if (currentNode == i-1) {
      nodeHeader.html(tmpName);
      txtArea.value(tmpText);
    }

    // --------- changing the choices
    var tmpChoices = nodeChoices[i];
    nodeChoices[i] = nodeChoices[i-1];
    nodeChoices[i-1] = tmpChoices;
    if (currentNode == i || currentNode == i-1) {
      choices = JSON.parse(JSON.stringify(nodeChoices[currentNode]));
    }

    if (currentNode == i)changeNode(i-1);
  }
}

function moveDown(i){
	if (i+1 < nodes.length){
    // --------- changing node names and node texts
    var tmpText = nodes[i].nodeText;
    var tmpName = nodes[i].nodeElem.html();
    nodes[i].nodeText = nodes[i+1].nodeText;
    nodes[i].nodeElem.html(nodes[i+1].nodeElem.html());
    nodes[i+1].nodeText = tmpText;
    nodes[i+1].nodeElem.html(tmpName);
    if (currentNode == i) {
      nodeHeader.html(nodes[i].nodeElem.html());
      txtArea.value(nodes[i].nodeText);
    }
    else if (currentNode == i+1) {
      nodeHeader.html(tmpName);
      txtArea.value(tmpText);
    }

    // --------- changing the choices
    var tmpChoices = nodeChoices[i];
    nodeChoices[i] = nodeChoices[i+1];
    nodeChoices[i+1] = tmpChoices;
    if (currentNode == i || currentNode == i+1) {
      choices = JSON.parse(JSON.stringify(nodeChoices[currentNode]));
    }

    if (currentNode == i)changeNode(i+1);
  }
}

function deleteNode(i){
  if (currentNode != i) nodeChoices[currentNode] = JSON.parse(JSON.stringify(choices));
  else if (currentNode > 0)currentNode -= 1;

  if (nodes.length > 1) changeNode2(currentNode);

  nodes[i].nodeElem.remove();
	nodes[i].nodeDiv.html('');
  nodes[i].nodeDiv.remove();
  nodes.splice(i,1);
  nodeChoices.splice(i,1);
  if (nodes.length == 0) {
    addNode();
    currentNode = 0;
    choices = [];
    nodeChoices[0] = [];
    resetChoiceDivs();
    return;
  }
}

function resetNavi() {
  for (var i = 0; i < nodes.length; i++){
    const i2 = i;
    nodes[i].nodeElem.mousePressed(()=> {
      changeNode(i2);
    });
    //nodeElem.parent(nodesDiv);
    nodes[i].naviUp.mousePressed(()=>{
      moveUp(i2);
      resetNavi();
    });
    nodes[i].naviDown.mousePressed(()=>{
      moveDown(i2);
      resetNavi();
    });
    nodes[i].naviDel.mousePressed(()=>{
      deleteNode(i2);
      resetNavi();
    });
  }
}

function addNode() {
  var d = createDiv();
  d.class('onenodediv');
  var name = 'Node' + str(nodes.length + 1);
  var nodeElem = createElement('p',name);
  nodeElem.class('nodep');
  d.child(nodeElem);
  nodeElem.attribute('name', nodes.length);

  var delbutton = createImg('/static/storyteller/images/delete.png');
  delbutton.class('navimage');
  delbutton.style('margin-right:25px;');
  d.child(delbutton);
  var downarrow = createImg('/static/storyteller/images/down-black.png');
  downarrow.class('navimage');
  d.child(downarrow);
  var uparrow = createImg('/static/storyteller/images/up-black.png');
  uparrow.class('navimage');
  d.child(uparrow);

  nodesDiv.child(d);

  const i2 = nodes.length;
  nodeElem.mousePressed(function() {
    changeNode(i2);
  });
  //nodeElem.parent(nodesDiv);
 	uparrow.mousePressed(()=>{
    moveUp(i2);
    resetNavi();
  });
  downarrow.mousePressed(()=>{
    moveDown(i2);
    resetNavi();
  });
  delbutton.mousePressed(()=>{
    deleteNode(i2);
    resetNavi();
  });

  var newnode = {
    nodeElem: nodeElem,
    nodeDiv: d,
    nodeText: '',
    naviUp: uparrow,
    naviDown: downarrow,
    naviDel: delbutton
  };
  nodes.push(newnode);
  nodeChoices.push([]);
  changeNode(nodes.length - 1);
}

function updateUI() {
  var txt = nodes[currentNode].nodeText;
  nodes[currentNode].nodeElem.html(nodeHeader.html());
  nodes[currentNode].nodeText = txtArea.value();

  for (var i = 0; i < choices.length; i++) {
    choices[i].text = choiceDivs[i].text.html();
    choices[i].required = choiceDivs[i].reqtextarea.value().split('\n');
    choices[i].results = choiceDivs[i].rewardstextarea.value().split('\n');
    choices[i].destination = choiceDivs[i].destination.value();
  }
  nodeChoices[currentNode] = JSON.parse(JSON.stringify(choices));
}

function changeNode2(i){
  // doesn't overwrite nodeChoices[currentNode] with choices
  currentNode = i;
  choices = JSON.parse(JSON.stringify(nodeChoices[i]));
  resetChoiceDivs();
  txtArea.value(nodes[i].nodeText);
  nodeHeader.html(nodes[i].nodeElem.html());
  for (var i = 0; i < nodes.length; i++) {
    if (i == currentNode) nodes[i].nodeElem.style('color', currentTheme.color8);
    else nodes[i].nodeElem.style('color', currentTheme.color7);
  }
}

function changeNode(i) {
  nodeChoices[currentNode] = JSON.parse(JSON.stringify(choices));
  currentNode = i;
  choices = JSON.parse(JSON.stringify(nodeChoices[i]));
  resetChoiceDivs();
  txtArea.value(nodes[i].nodeText);
  nodeHeader.html(nodes[i].nodeElem.html());
  for (var i = 0; i < nodes.length; i++) {
    if (i == currentNode) nodes[i].nodeElem.style('color', currentTheme.color8);
    else nodes[i].nodeElem.style('color', currentTheme.color7);
    nodes[i].nodeDiv.style('border-color',currentTheme.color4+'aa');
  }

}

function auto_grow(element) {
  element.style.height = "5px";
  element.style.height = (element.scrollHeight) + "px";

  if (element.value == '') {
    var id = int(element.id.split('-')[0]);
    var type = element.id.split('-')[1];
    if (type == 'req') {
      choiceDivs[id].addreqbutton.style('display', 'block');
      choiceDivs[id].reqtextarea.style('display', 'none');
    } else if (type == 'rew') {
      choiceDivs[id].addrewardsbutton.style('display', 'block');
      choiceDivs[id].rewardstextarea.style('display', 'none');
    }

  }
  return 1;
}

function showStartStatPopup(){
  helpDiv.style('display','none');
  statsDiv.style('display','none');
  allStats = getAllStats(); // remove && false later, now for testing
  if (allStats.length == 0) {
    saveStory('savedstory',[]);
    return;
  }
  if (startStatsDiv) {startStatsDiv.html(''); startStatsDiv.remove();}
 	startStatsDiv = createDiv();
  startStatsDiv.style('width:100%;height:100%;background:#0000;position:absolute;top:0;right:0;z-index:2;');

  // basically startStatsDiv will hold everything, but it itself is just a full-screen transparent div
  // this is to prevent clicking elsewhere, basically you have to manually click export/close button to close popup

	var popup = createDiv();
  popup.class('startstatpopupdiv');
  popup.style('background',currentTheme.color5);
  popup.style('color',currentTheme.color7);

  // for some reason the .y has to have the -20 to be aligned
  var closePopup = createElement('button', 'X');
  closePopup.class('removechoicebutton');
  closePopup.mousePressed(() => {
    startStatsDiv.html('');
    startStatsDiv.remove();
    popup.html('');
    popup.remove();
  });
  popup.child(closePopup);

  var statsHeader = createElement('p', "Set reader's starting stats:");
  statsHeader.class('statsheader');
  //statsHeader.style('background',currentTheme.color5);
  popup.child(statsHeader);


  var allstatsdiv = createDiv();
  allstatsdiv.class('allstartstatsdiv');

  var statfields = [];

  for (var i = 0; i < allStats.length; i++) {
    var div = createDiv();
    div.class('onestatdiv');
    div.id('onestat');
    var p = createElement('p', allStats[i][0] + ':');
    p.class('onestatname');

    var ed = createElement('textarea', '');
    ed.class('onestatfield');
    statfields.push(ed);
    //var pattern = '';
    //if (allStats[i][1] == 'Number') pattern = /^[0-9]+$/;
    //else if (allStats[i][1] == 'List') pattern =
    //ed.attribute('pattern',pattern);
    ed.attribute('placeholder', allStats[i][1]);
    ed.attribute('rows', 1);
    div.child(p);
    div.child(ed);
    allstatsdiv.child(div);

    if (allStats[i][0].length > 19) {
  		p.html(p.html().slice(0,17) + '...');
    }
  }
  popup.child(allstatsdiv);

  var exportButton = createElement('button','Export');
  exportButton.class('exportbutton');
  exportButton.mousePressed(()=>exportButtonPressed(allStats,statfields));
  popup.child(exportButton);

  var x = window.innerWidth/2-popup.elt.offsetWidth/2;
  var y = window.innerHeight/2-popup.elt.offsetHeight/2;
  popup.position(x,y);
}

function exportButtonPressed(stats,startstatvalues){
  var numDefault = 0;
  var tfDefault = true;
  var listDefault = [];
  var textDefault = 'none';
  for (var i = 0; i < stats.length; i++){
    var type = stats[i][1];
    var val = startstatvalues[i].value();
  	if (type == 'Number' && !/^\d+$/.test(val)) stats[i][2] = numDefault;
    else if (type == 'Number') stats[i][2] = val;

    if (type == 'Text' && val.length == 0) stats[i][2] = textDefault;
    else if (type == 'Text') stats[i][2] = val;

    if (type == 'True/False' && ['true','false'].indexOf(val.toLowerCase() == -1)) stats[i][2] = tfDefault;
    else if (type == 'True/False') stats[i][2] = val.toLowerCase() == 'true';

    if (type == 'List' && val.length == 0) stats[i][2] = listDefault;
    else if (type == 'List') {
    	var tempList = [];
      var ori = val.split(',');
      for (var t = 0; t < ori.length; t++) tempList.push(ori[i].trim());
      stats[i][2] = tempList;
    }
  }
  saveStory('savedstory',stats)
}

function toggleThemeDiv(){
  var pos = select('#theme').position();
  //themeDiv.position(pos.x+select('#theme').elt.offsetWidth/2-themeDiv.elt.offsetWidth/2,40);
  helpDiv.style('display','none');
  statsDiv.style('display','none');
  themeDiv.style('background',currentTheme.color5);
  themeDiv.style('border-color',currentTheme.color6);
  themeDiv.style('color',currentTheme.color7);
  if (themeDiv.style('display') == 'none') themeDiv.style('display','block');
  else themeDiv.style('display','none');
}

function setupUI() {
  themeDiv = select(".mainthemediv");
  themeDiv.style('background',currentTheme.color5);
  themeDiv.style('border-color',currentTheme.color6);
  themeDiv.style('color',currentTheme.color7);
  var pos = select('#theme').position();
  themeDiv.position(pos.x+select('#theme').elt.offsetWidth/2-themeDiv.elt.offsetWidth/2,40);

  select("#colorBG").value(currentTheme.bg);
  select("#color1").value(currentTheme.color1);
  select("#color2").value(currentTheme.color2);
  select("#color3").value(currentTheme.color3);
  select("#color4").value(currentTheme.color4);
  select("#color5").value(currentTheme.color5);
  select("#color6").value(currentTheme.color6);
  select("#color7").value(currentTheme.color7);
  select("#color8").value(currentTheme.color8);
  select("#color9").value(currentTheme.color9);

  topmenuDiv = select(".topmenudiv");
  var helpButton = select("#help");
  var statsButton = select("#stats");
  var exportButton = select("#export");
  exportButton.mousePressed(showStartStatPopup);
  const fileSelect = document.getElementById("fileSelect"),
    fileElem = document.getElementById("fileElem");
  fileSelect.addEventListener("click", function(e) {
    helpDiv.style('display','none');
  	statsDiv.style('display','none');
    if (fileElem) {
      fileElem.click();
    }
  }, false);

  helpDiv = createDiv();
  helpDiv.id("helpdiv");
  helpDiv.class('itemdiv');


  helpNodes = createElement('p', 'nodes');
  helpNodes.id("helpnodes");
  helpNodes.class('helptopic');
  helpNodes.mousePressed(() => setHelpText('nodes'));
  helpDiv.child(helpNodes);
  helpStats = createElement('p', 'stats');
  helpStats.id("helpstats");
  helpStats.class('helptopic');
  helpStats.mousePressed(() => setHelpText('stats'));
  helpDiv.child(helpStats);
  helpRequirements = createElement('p', 'requirements');
  helpRequirements.id("helpreq");
  helpRequirements.class('helptopic');
  helpRequirements.mousePressed(() => setHelpText('req'));
  helpDiv.child(helpRequirements);
  helpResults = createElement('p', 'results');
  helpResults.id("helpres");
  helpResults.class('helptopic');
  helpResults.mousePressed(() => setHelpText('res'));
  helpDiv.child(helpResults);

  helpText = createElement('textarea', 'some help\nyes yes');
  helpText.id("helptext");
  helpText.class('helptext');
  helpText.attribute('readonly', true);
  helpDiv.child(helpText);
  setHelpText('nodes');

  statsDiv = createDiv();
  statsDiv.id("statsdiv");
  statsDiv.class('itemdiv');
  statsText = createElement('textarea', 'dddd');
  statsText.id("statstext");
  statsText.class('helptext');
  //statsText.style('display', 'none');
  statsDiv.child(statsText);

  var w = helpDiv.elt.offsetWidth;
  var topW = topmenuDiv.elt.offsetWidth;
  var topH = topmenuDiv.elt.offsetHeight;
  helpDiv.position(topW / 2 - (w / 2), topH);

  helpButton.mousePressed(() => {
    if (helpDiv.style('display') == 'block') {
      helpDiv.style('display', 'none');
      //helpButton.style('text-decoration', 'none');
      //statsButton.style('text-decoration', 'none');
    } else {
      setHelpText('nodes');
      helpDiv.style('display', 'block');
      statsDiv.style('display', 'none');
      //helpButton.style('text-decoration', 'underline');
      //statsButton.style('text-decoration', 'none');
      var w = helpDiv.elt.offsetWidth;
      var topW = topmenuDiv.elt.offsetWidth;
      var topH = topmenuDiv.elt.offsetHeight;
      helpDiv.position(topW / 2 - (w / 2), topH);
    }
  });
  helpDiv.style('display', 'none');

  statsDiv.position(topW / 2 - (w / 2), topH);
  statsButton.mousePressed(() => {
    if (statsDiv.style('display') == 'block') {
      statsDiv.style('display', 'none');
      //helpButton.style('text-decoration', 'none');
      //statsButton.style('text-decoration', 'none');
    } else {
      setStatsText();
      statsDiv.style('display', 'block');
      helpDiv.style('display', 'none');
      //helpButton.style('text-decoration', 'none');
      //statsButton.style('text-decoration', 'underline');
    }
  });
  statsDiv.style('display', 'none');

  nodesDiv = select(".nodediv");


  //naviDiv.style('margin-top', str(topH) + 'px');

  newNode = select('.addnodebutton');
  newNode.style('height', str(topH) + 'px');
  newNode.mousePressed(addNode);

  nodeHeader = select(".nodeheader");

  txtDiv = select(".textdiv");

  txtArea = select(".maintextarea");
  txtArea.attribute('placeholder', defaultTextHint);

  choicesDiv = select("#choicesdiv");
  addNode();

  addChoiceButton = createElement('button', defaultAddChoiceText);
  addChoiceButton.class('addchoicebutton');
  addChoiceButton.style('background',currentTheme.color3);
  addChoiceButton.style('border-color',currentTheme.color4);
  addChoiceButton.style('color',currentTheme.color9);
  addChoiceButton.mousePressed(() => {
    createChoiceDiv(defaultChoiceText, true)
  });

  document.onclick = function(e) {
    // handles closing the help/stats popup when you click outside of it
    var x = ["help", "helpdiv", "helptext", "helpnodes", "helpreq", "helpres",
      "stats", "statsdiv", "statstext", "onestat", "topmenudiv", "helpstats"
    ]

    if (!e.target.parentElement || x.indexOf(e.target.parentElement.id) == -1) {
      statsDiv.style('display', 'none');
      helpDiv.style('display', 'none');
      //helpButton.style('text-decoration', 'none');
      //statsButton.style('text-decoration', 'none');
    }
  };


}

function setHelpText(topic) {
	themeDiv.style('display','none');
  var stattips = [
  	"There are four types of values stats can hold:",
    "• Numbers",
    "• True/False",
    "• Text - any length",
    "• Lists - start and end in brackets, seperated by commas",
    "",
    "Some examples specifying a result:",
    "Number:       luck + 1",
    "True/False:   alive = true",
    "Text:         class = warrior",
    "List:         inventory = (cloak, sword)",
  ];

  var nodetips = [
    "Nodes can be anything you want:",
    "• places the reader visits",
    "• merchant stalls",
    "• monster encounters",
    "The limit is your imagination.",

  ];
  var reqtips = [
    'How to write requirements:',
    'STAT OPERATOR VALUE',
    "",
    "STAT:",
    "• some stat you're referring to, for example strength",
    "• must be one word",
    "",
    "OPERATOR:",
    "• Valid operators: >,>=,<,<=,=,!=,has,!has",
    "• >, >=, =, <, <= work just like in math",
    "• != means not equal",
    "• 'has' checks if a given list stat has a given value",
    "• '!has' checks if a given list stat doesn't have a given value",
    "",
    "VALUE:",
    "• 'has' and '!has' are used with lists of words, for example a player's inventory or the list of visited places",
    "• != and = are used with numbers, true/false, or text",
    "• >,>=,<,<= are used with numbers",
    "",
    "• One requirement per line",
    "",
    "For example:",
    "strength > 1",
    "isIndoors = true",
    "class = shaman",
    "shoppingList has onion"
  ];
  var restips = [
    "Results are effects to the reader's stats that happen if they choose a given choice",
    "",
    'How to write results:',
    'STAT OPERATOR VALUE',
    "",
    "STAT:",
    "• some stat you're referring to, for example strength",
    "• must be one word",
    "",
    "OPERATOR:",
    "• Valid operators: +,-,=,gets,loses",
    "• + adds a specified amount to the stat",
    "• - substracts a specified amount from the stat",
    "• = sets the stat to a specified value",
    "• 'gets' adds a specified item to the (list) stat",
    "• 'loses' removes a specified item from the (list) stat",
    "",
    "VALUE:",
    "• = for numbers, true/false, or text",
    "• + and - for numbers",
    "• 'gets' and 'loses' for list stats",
    "",
    "• One result per line",
    "",
    "For example:",
    "strength + 1",
    "isIndoors = true",
    "occupation = merchant",
    "shoppingList loses onion"
  ];

  helpDiv.style('background',currentTheme.color5);
  helpDiv.style('border-color',currentTheme.color6);

  helpRequirements.style('text-decoration', 'none');
  helpNodes.style('text-decoration', 'none');
  helpResults.style('text-decoration', 'none');
  helpStats.style('text-decoration', 'none');
  if (topic == 'req') {
    helpText.value(reqtips.join('\n'));
    helpRequirements.style('text-decoration', 'underline');
  }
  if (topic == 'nodes') {
    helpText.value(nodetips.join('\n'));
    helpNodes.style('text-decoration', 'underline');
  }
  if (topic == 'res') {
    helpText.value(restips.join('\n'));
    helpResults.style('text-decoration', 'underline');
  }
  if (topic == 'stats') {
    helpText.value(stattips.join('\n'));
    helpStats.style('text-decoration', 'underline');
  }
  auto_grow(helpText.elt);


}

function getAllStats() {
  var allStatsUsed = [];
  var isnum = /^\d+$/.test();
  for (var n = 0; n < nodeChoices.length; n++) {
    for (var ch = 0; ch < nodeChoices[n].length; ch++) {
      for (var r = 0; r < nodeChoices[n][ch].required.length; r++) {
        var req = nodeChoices[n][ch].required[r].split(' ');
        var type = '';
        if (req.length < 3) continue;
        if (['>', '>=', '<', '<='].indexOf(req[1]) > -1 && req.length == 3 && /^\d+$/.test(req[2])) type = 'Number';
        else if (['=', '!='].indexOf(req[1]) > -1 && req.length == 3 && /^\d+$/.test(req[2])) type = 'Number';
        else if (['=', '!='].indexOf(req[1]) > -1 && req.length == 3 && ['true', 'false'].indexOf(req[2].toLowerCase()) > -1) type = 'True/False';
        else if (['=', '!='].indexOf(req[1]) > -1) type = 'Text';
        else if ('has' == req[1] || '!has' == req[1]) type = 'List';
        else continue;
        var invalid_indexes = [];
        var found = false;
        for (var a = 0; a < allStatsUsed.length; a++) {
          if (allStatsUsed[a][0] == req[0]) {
            if (allStatsUsed[a][1] == type && invalid_indexes.length == 0) found = true;
            else invalid_indexes.push(a);
          }
        }
        if (invalid_indexes.length == 0 && found == false) allStatsUsed.push([req[0], type]);
        else {
          var offset = 0;
          for (var inv = 0; inv < invalid_indexes.length; inv++) {
            allStatsUsed.splice(inv - offset, 1);
            offset++;
          }
        }
      }

      for (var r = 0; r < nodeChoices[n][ch].results.length; r++) {
        var res = nodeChoices[n][ch].results[r].split(' ');
        var type = '';
        if (res.length < 3) continue;
        if (['+', '-'].indexOf(res[1]) > -1 && res.length == 3 && /^\d+$/.test(res[2])) type = 'Number';
        else if ('=' == res[1] && res.length == 3 && /^\d+$/.test(res[2])) type = 'Number';
        else if ('=' == res[1] && res.length == 3 && ['true', 'false'].indexOf(res[2].toLowerCase()) > -1) type = 'True/False';
        else if ('=' == res[1]) type = 'Text';
        else if (['gets', 'loses'].indexOf(res[1]) > -1) type = 'List';
        else continue;
        var invalid_indexes = [];
        var found = false;
        for (var b = 0; b < allStatsUsed.length; b++) {
          if (allStatsUsed[b][0] == res[0]) {
            if (allStatsUsed[b][1] == type && invalid_indexes.length == 0) found = true;
            else invalid_indexes.push(b);
          }
        }
        if (invalid_indexes.length == 0 && found == false) allStatsUsed.push([res[0], type]);
        else {
          var offset = 0;
          for (var inv = 0; inv < invalid_indexes.length; inv++) {
            allStatsUsed.splice(inv - offset, 1);
            offset++;
          }
        }
      }
    }
  }
  return allStatsUsed;
}

function setStatsText() {
  statsDiv.style('background',currentTheme.color5);
  statsDiv.style('border-color',currentTheme.color6);
  themeDiv.style('display','none');
  var res = 'All stats used:\n';
	var allStats = getAllStats();
  for (var i = 0; i < allStats.length; i++){
  	res += '• '+allStats[i][0] + ' ('+allStats[i][1]+')\n';
  }
  statsText.value(res);
}

function createChoiceDiv(txt, addToChoices) {
  if (addChoiceButton) addChoiceButton.remove();
  var newChoiceDiv = createDiv();
  newChoiceDiv.class('choicediv');
  newChoiceDiv.style('background',currentTheme.color5);
  newChoiceDiv.style('border-color',currentTheme.color6);
  newChoiceDiv.style('color',currentTheme.color7);
  var choiceText = createElement('p', txt);
  choiceText.class('choicetext');
  choiceText.attribute('contenteditable', true);

  var removeChoice = createElement('button', 'X');
  removeChoice.class('removechoicebutton');
  var divpos = newChoiceDiv.position();
  newChoiceDiv.child(removeChoice);
  const i = choiceDivs.length;
  removeChoice.mousePressed(() => {
    removeChoiceDiv(i)
  });

  newChoiceDiv.child(choiceText);

  var destinationDiv = createDiv();
  var destP = createElement('p', defaultDestText);
  var destTA = createElement('textarea', '');
  destP.class('destinationp');
  destTA.attribute('placeholder', defaultDestHint);
  destTA.class('destinationta');
  destTA.style('background','#fff3');
  destTA.style('margin-top','10px');
  destTA.style('color',currentTheme.color7);
  destinationDiv.child(destP);
  destinationDiv.child(destTA);
  newChoiceDiv.child(destinationDiv);

  var reqTxtArea = createElement('textarea', defaultRequirementsHint);
  auto_grow(reqTxtArea.elt);
  reqTxtArea.value('');
  reqTxtArea.attribute('placeholder', defaultRequirementsHint);
  reqTxtArea.class('autoexpandtextarea');
  reqTxtArea.style('background','#fff3');
  reqTxtArea.style('margin-top','10px');
  reqTxtArea.style('color',currentTheme.color7);
  reqTxtArea.attribute('onkeyup', 'auto_grow(this)');
  reqTxtArea.id(str(i) + '-req');

  var addRequirementsP = createElement('p', defaultAddReqText);
  addRequirementsP.class('addreqbutton');
  addRequirementsP.style('color',currentTheme.color9+'88');
  addRequirementsP.mousePressed(() => {
    addRequirementsP.style('display', 'none');
    reqTxtArea.style('display', 'block');
  });
  newChoiceDiv.child(addRequirementsP);

  newChoiceDiv.child(reqTxtArea);

  var rewardsTxtArea = createElement('textarea', '');
  rewardsTxtArea.attribute('placeholder', defaultRewardsHint);
  rewardsTxtArea.class('autoexpandtextarea');
  rewardsTxtArea.style('background','#fff3');
  rewardsTxtArea.style('margin-top','10px');
  rewardsTxtArea.style('color',currentTheme.color7);
  rewardsTxtArea.attribute('onkeyup', 'auto_grow(this)');
  rewardsTxtArea.id(str(i) + '-rew');

  var addRewardsP = createElement('p', defaultAddRewardsText);
  addRewardsP.class('addreqbutton');
  addRewardsP.style('color',currentTheme.color9+'88');
  addRewardsP.mousePressed(() => {
    addRewardsP.style('display', 'none');
    rewardsTxtArea.style('display', 'block');
  });
  newChoiceDiv.child(addRewardsP);

  newChoiceDiv.child(rewardsTxtArea);

  var choiceDivContent = {
    'div': newChoiceDiv,
    'destination': destTA,
    'addreqbutton': addRequirementsP,
    'reqtextarea': reqTxtArea,
    'addrewardsbutton': addRewardsP,
    'rewardstextarea': rewardsTxtArea,
    'text': choiceText
  };
  choiceDivs.push(choiceDivContent);
  removeChoiceButtons.push(removeChoice);
  if (addToChoices) {
    var newChoice = {
      'text': txt
    };
    choices.push(newChoice);
  } else if (nodeChoices[currentNode][choiceDivs.length - 1]) {
    // after reset (possibly after changing node), so let's set proper content
    var c = choiceDivs.length - 1;
    destTA.value(nodeChoices[currentNode][c].destination);
    if (nodeChoices[currentNode][c].required != ['']) {
      addRequirementsP.style('display', 'none');
      reqTxtArea.style('display', 'block');
      reqTxtArea.value(nodeChoices[currentNode][c].required.join('\n'));
      auto_grow(reqTxtArea.elt);
    }
    if (nodeChoices[currentNode][c].results != ['']) {
      addRewardsP.style('display', 'none');
      rewardsTxtArea.style('display', 'block');
      rewardsTxtArea.value(nodeChoices[currentNode][c].results.join('\n'));
      auto_grow(rewardsTxtArea.elt);
    }
  }

  addChoiceButton = createElement('button', defaultAddChoiceText);
  addChoiceButton.class('addchoicebutton');
  addChoiceButton.style('background',currentTheme.color3);
  addChoiceButton.style('border-color',currentTheme.color4);
  addChoiceButton.style('color',currentTheme.color9);
  addChoiceButton.mousePressed(() => {
    createChoiceDiv(defaultChoiceText, true)
  });

  choicesDiv.child(newChoiceDiv);
}

function resetChoiceDivs() {
  // deletes all choice divs currently displayed
  choicesDiv.html('');
  choiceDivs = [];

  // deletes all remove buttons currently displayed
  for (var i = 0; i < removeChoiceButtons.length; i++) {
    removeChoiceButtons[i].remove();
  }
  removeChoiceButtons = [];

  // creates new divs, populated by the correct content
  for (var i = 0; i < choices.length; i++) {
    createChoiceDiv(choices[i].text, false);
  }
}

function removeChoiceDiv(i) {
  choices.splice(i, 1);
  resetChoiceDivs();
}



// ------------- autocomplete destination stuff