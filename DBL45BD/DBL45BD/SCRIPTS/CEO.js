const ceobutton = document.getElementById("CEO");
ceobutton.addEventListener("click", function(){
    if (!ceobutton.checked){
        tokeep.splice(tokeep.indexOf("CEO"))
    }else{
        tokeep.push("CEO");
    }
    tokeep.sort();
    
});