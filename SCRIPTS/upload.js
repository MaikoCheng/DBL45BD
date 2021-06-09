const realFileBtn = document.getElementById("real-file");
const mybutton = document.getElementById("upload");
mybutton.addEventListener("click", function(){
    realFileBtn.click();
    d3.select("svg").remove();
    d3.select("svg2").remove();
});