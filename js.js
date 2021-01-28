
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
  $(go.Node, "Horizontal",
    { background: "#44CCFF" },
    //$(go.Picture,
    //  { margin: 10, width: 50, height: 50, background: "red" },
    //  new go.Binding("source")),
    $(go.TextBlock, "Default Text",
      { margin: 12, stroke: "#000000", font: "bold 16px sans-serif" },
      new go.Binding("text", "name"))
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
    recipes=[];
    var temp={
        key:"",
        name:""
    };
    temp.key=id+"|"+0;
    temp.name=data[id].name;
    temp.source="";

    recipes.push(temp);
    doMake(id,0,temp.key);
    model.nodeDataArray=recipes;
    myDiagram.model=model;
    
}

function doMake(id,c,parent){
    if(data[id].level>0){
        data[id].make.item.forEach(e => {
            var temp={
                key:"",
                name:""
            };
            if(data[e.id]===undefined){
                console.log(e.id);
            }
            temp.key=e.id+"|"+(c+1)+"-"+Math.random();
            temp.name=data[e.id].name;
            temp.parent=parent;
            temp.source="img/1.jpg";
            recipes.push(temp);
            doMake(e.id,c+1,temp.key);
        });
    }
}


d("tc");



