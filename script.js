// Initialize GoJS Diagram
function init() {
    const $ = go.GraphObject.make;

    const diagram = $(go.Diagram, "myDiagramDiv", {
      // Define properties of the diagram
      layout: $(go.TreeLayout, { angle: 90, layerSpacing: 35 }),
      "undoManager.isEnabled": true
    });

    // Define the Node template
    diagram.nodeTemplate =
      $(go.Node, "Auto",
        $(go.Shape, "Rectangle", { fill: "lightblue", strokeWidth: 0 }),
        $(go.TextBlock, { margin: 8, font: "14px Arial" }, new go.Binding("text", "display"))
      );

    // Define the Link template with relationship labels
    diagram.linkTemplate =
      $(go.Link,
        $(go.Shape),
        $(go.Shape, { toArrow: "Standard" }),
        $(go.TextBlock, { segmentOffset: new go.Point(0, 10), font: "10px Arial" }, new go.Binding("text", "relationship"))
      );

    // Create the model
    const model = $(go.GraphLinksModel);

    // List of random first names
    const firstNames = ["Tola", "Tomiwa", "Dolapo", "Ade", "Bola", "Chuka", "Tayo", "Gani", "kunle", "Ife"];
    const numGenerations = 10;
    const numPeoplePerGeneration = 4;

    // Define year ranges for each generation
    const generationYearRanges = [
      { start: 1990, end: 1992 },
      { start: 1960, end: 1970 },
      { start: 1930, end: 1940 },
      { start: 1900, end: 1910 },
      { start: 1870, end: 1880 },
      { start: 1840, end: 1850 },
      { start: 1810, end: 1820 },
      { start: 1780, end: 1790 },
      { start: 1750, end: 1760 },
      { start: 1720, end: 1730 }
    ];

    let nodeDataArray = [];
    let linkDataArray = [];

    // Generate nodes with the surname "Aworeni", random first names, and birth years
    for (let gen = 0; gen < numGenerations; gen++) {
      const { start, end } = generationYearRanges[gen];
      for (let i = 0; i < numPeoplePerGeneration; i++) {
        const index = gen * numPeoplePerGeneration + i;
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const birthYear = Math.floor(Math.random() * (end - start + 1)) + start;

        nodeDataArray.push({
          key: index,
          name: `Aworeni ${firstName}`,
          birthYear: birthYear,
          display: `Aworeni ${firstName} (${birthYear})`
        });
      }
    }

    // Create links between generations with structured relationships
    for (let gen = 1; gen < numGenerations; gen++) {
      const numParents = Math.floor(numPeoplePerGeneration / 2);
      for (let i = 0; i < numPeoplePerGeneration; i++) {
        const parentIndex = Math.floor(i / 2) + (gen - 1) * numPeoplePerGeneration;
        const childIndex = gen * numPeoplePerGeneration + i;
        if (parentIndex < numGenerations * numPeoplePerGeneration) {
          if (i < numParents) {
            // Grandparents (links from grandparent to parent)
            if (gen > 1) {
              const grandparentIndex = Math.floor(i / 2) + (gen - 2) * numPeoplePerGeneration;
              linkDataArray.push({
                from: grandparentIndex,
                to: parentIndex,
                relationship: "Grandparent-Parent"
              });
            }
          }
          // Parents (links from parent to child)
          linkDataArray.push({
            from: parentIndex,
            to: childIndex,
            relationship: "Parent-Child"
          });
        }
      }
    }

    model.nodeDataArray = nodeDataArray;
    model.linkDataArray = linkDataArray;

    diagram.model = model;
}

// Run the initialization function when the page loads
window.addEventListener('DOMContentLoaded', init);
