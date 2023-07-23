let mydate=new Date();
console.log(mydate);
function clicked(){
    console.log("The button wws clicked")
}
firstcontainer.addEventListener('mouseover',function(){
console.log("mouse on")
})

logkaro=()=>{
    console.log("I am the log");
}
setTimeout(logkaro,1000);
setinterval(logkaro,2000);
