# DBL45BD
This is the github repository for DBL group 45BD
Link: https://maikocheng.github.io/DBL45BD/DBL45BD/index.html
*Note: The webpage does not work correctly when opening from the downloaded html file because the paths to the script files are set to work in Github. To see the
aplication please use the link. It works best in Chrome, other browsers may have some issues. We will fix this in the next update.

Explanation:

When opening the application the user is directed to the home page (index.html) from where they can go to a information page (info.html), or to the visualization page (graphs.html). All of the styling is in the same file (style.css). The visualizations were made using JavaScript and the library used is D3.

Information page: Clicking and holding the left mouse button on any of the tabs will reveal information about the title of the tab. There are navigation buttons to the other two pages.

Visualization page: In order to see the visualizations the user has to upload a csv file using the upload button at the top left corner (the button only works when clicking the "Upload data" text, next update will have the whole button work). After that, the visualizations will show up, together with some checkboxes on the left (those don't do anything right now). The visualizations consist of an arc diagram and an adjacency matrix.


The arc diagram: nodes represent employees, and the edges represent emails between them. When hovering on a node, it is highlighted, along with the name of the employee that is represented by that node, and the adjacent edges.

The adjacency matrix: the squares in the matrix represent one or multiple emails between employees, and the color represents the average sentiment of the emails. When hovering over a square, the exact value of the average sentiment is displayed, along with its meaning, the sender and recipient. There is also a legend explaining the correlation between the colors and values for the sentiment, and when hovering over a color, its meaning is displayed.



