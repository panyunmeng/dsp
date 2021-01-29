var nowId;
var $ = go.GraphObject.make;

var myDiagram =
  $(go.Diagram, "myDiagramDiv",
    {
      "undoManager.isEnabled": true,
      layout: $(go.TreeLayout,
                { angle: 90, layerSpacing: 35 })
    });

// the template we defined earlier
myDiagram.nodeTemplate =
  $(
    go.Node, "Horizontal",
    { background: "#44CCFF" },
  $(go.Panel, "Table",
    
    $(go.RowColumnDefinition, { column: 2, width: 3 }),
    $(go.TextBlock, "Default Text",
      {
        row:0,
        column:0,
        columnSpan:2,
        margin: new go.Margin(4,4,0,4),
        stroke: "#000000",
        font: "bold 14px sans-serif" 
      },
      new go.Binding("text", "name")),
      $(go.Picture,
        { 
          column:0,
          row:1,
          rowSpan:2,
          margin: new go.Margin(0,0,4,4), 
          width: 30, 
          height: 30, 
          background: "#0d151c" },
        new go.Binding("source")),
      $(go.TextBlock, "数量",
      {
        row:1,
        column:1,
        margin: new go.Margin(0,4,0,4), 
        stroke: "#555555", 
        font: "12px sans-serif" 
      },
      new go.Binding("text", "count")),
      $(go.TextBlock, "数量",
      {
        row:2,
        column:1,
        margin: new go.Margin(0,4,4,4), 
        stroke: "#555555", 
        font: "12px sans-serif" 
      },
      new go.Binding("text", "me")),
      ),
  );

// define a Link template that routes orthogonally, with no arrowhead
myDiagram.linkTemplate =
  $(go.Link,
    { routing: go.Link.Orthogonal, corner: 5 },
    $(go.Shape, // the link's path shape
      { strokeWidth: 3, stroke: "#555" }));

var model = $(go.TreeModel);

var recipes=[];
function d(id){
    nowId=id;
    var count= Number(document.getElementById("getCount").value);
    recipes=[];
    var temp={
        key:"",
        name:""
    };
    temp.key=id+"|"+0;
    temp.name=data[id].name;
    temp.source=getSource(id);
    if(data[id].make===undefined){
      temp.me="";
      temp.count="";
    }else{
      var make=data[id].make
      if(count<=0){
        count=60/make.time*make.count;
      }
      temp.count=count+"/min";
      temp.me=1.0*count/make.count*make.time/60.0;
      temp.me=myFix(temp.me)
      
    }
    recipes.push(temp);
    doMake(id,temp.key,count);
    model.nodeDataArray=recipes;
    myDiagram.model=model;
    myDiagram.model.scale=0.5
    
}

function doMake(id,parent,count){
    if(data[id].level>0){
        data[id].make.item.forEach(e => {
            var temp={
                key:"",
                name:""
            };
            if(data[e.id]===undefined){
                console.log(e.id);
            }
            var needcount=count/data[id].make.count;
            var make=data[e.id].make;
            temp.key=e.id+"|"+Math.floor(random()*random());
            temp.name=data[e.id].name;
            temp.parent=parent;
            temp.source=getSource(e.id);
            temp.count=needcount*e.count+"/min";
            if(data[e.id].level>0){
              temp.me=1.0*needcount*e.count/make.count*make.time/60.0;
              temp.me=myFix(temp.me)
            }
            else{
              temp.me=""
            }
            recipes.push(temp);
            doMake(e.id,temp.key,needcount*e.count);
        });
    }
}


function myFix(str){
  str=String(str);
  var index= str.indexOf(".");
  if(index<1)
    return str;
  else
    return str.slice(0, index + 3);
}

function random(){
  return Math.random()*100;
}

function getSource(id){
  return "img/"+id+".jpg";
}

function addStone(id,flag){
  if(flag==0){
    var reid=replaceData[id].re.id;
    var tempmake=data[reid].make;
    data[reid].make=replaceData[id].re.make;
    replaceData[id].re.make=tempmake;
    if(replaceData[id].re1!==undefined){
      reid=replaceData[id].re1.id;
      tempmake=data[reid].make;
      data[reid].make=replaceData[id].re1.make;
      replaceData[id].re1.make=tempmake;
    }
  }
  else{
    var l=data[id].level;
    data[id].level=(l>=1)?0:1;
  }
  isShow(id);
  d(nowId);
}

function isShow(id){
  var elm= document.getElementById(id+"Is");
  if(elm.style.display=="block")
    elm.style.display="none";
  else
    elm.style.display="block";

}

d("m6");



