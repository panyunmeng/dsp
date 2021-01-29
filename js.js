
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
  //$(go.Picture,
  //  { margin: 10, width: 50, height: 50, background: "red" },
  //  new go.Binding("source")),
  $(go.Panel, "Table",
    
    $(go.RowColumnDefinition, { column: 1, width: 3 }),
    $(go.TextBlock, "Default Text",
      {
        row:0,
        column:0,
        margin: new go.Margin(8,8,0,8),
        stroke: "#000000",
        font: "bold 16px sans-serif" 
      },
      new go.Binding("text", "name")),
      $(go.TextBlock, "数量",
      {
        row:1,
        column:0,
        margin: new go.Margin(0,8,0,8), 
        stroke: "#555555", 
        font: "12px sans-serif" 
      },
      new go.Binding("text", "count")),
      $(go.TextBlock, "数量",
      {
        row:2,
        column:0,
        margin: new go.Margin(0,8,8,8), 
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
function d(id,count){
    recipes=[];
    var temp={
        key:"",
        name:""
    };
    temp.key=id+"|"+0;
    temp.name=data[id].name;
    temp.source="";
    if(data[id].make===undefined){
      temp.me="";
      temp.count="";
    }else{
      var make=data[id].make
      if(count===undefined){
        count=60/make.time;
      }
      temp.count=count+"/min";
      temp.me=1.0*count/make.count*make.time/60.0;
      temp.me=myFix(temp.me)
      
    }
    recipes.push(temp);
    doMake(id,temp.key,count);
    model.nodeDataArray=recipes;
    myDiagram.model=model;
    
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
            var make=data[id].make;
            temp.key=e.id+"|"+Math.floor(Math.random()*100);
            temp.name=data[e.id].name;
            temp.parent=parent;
            temp.source="img/1.jpg";
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

d("tc");



