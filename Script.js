let expenses=[];

let chart;
let pieChart;

window.onload=function(){

setTimeout(()=>{
document.getElementById("openAnimation").style.display="none";
},2000);

}


function addExpense(){

let name=document.getElementById("name").value;
let amount=parseFloat(document.getElementById("amount").value);
let date=document.getElementById("date").value;
let category=document.getElementById("category").value;

if(name=="" || amount=="" || date==""){
alert("Enter all fields");
return;
}

let expense={
name:name,
amount:amount,
date:new Date(date),
category:category
};

expenses.push(expense);

displayExpenses();
calculateTotals();
updateGraph();
updateCategoryChart();
predictNextMonth();
coinRain();

document.getElementById("name").value="";
document.getElementById("amount").value="";
document.getElementById("date").value="";

}


function displayExpenses(){

let list=document.getElementById("list");
list.innerHTML="";

expenses.forEach((exp,index)=>{

let row=`
<tr>
<td>${exp.name}</td>
<td>₹${exp.amount}</td>
<td>${exp.date.toLocaleDateString()}</td>
<td>${exp.category}</td>
<td><button onclick="deleteExpense(${index})">Delete</button></td>
</tr>
`;

list.innerHTML+=row;

});

}


function deleteExpense(index){

expenses.splice(index,1);

displayExpenses();
calculateTotals();
updateGraph();
updateCategoryChart();
predictNextMonth();

}


function calculateTotals(){

let total=0;
let day=0;
let week=0;
let month=0;
let six=0;
let year=0;

let now=new Date();

expenses.forEach(exp=>{

total+=exp.amount;

let diff=(now-exp.date)/(1000*60*60*24);

if(diff<=1) day+=exp.amount;
if(diff<=7) week+=exp.amount;
if(diff<=30) month+=exp.amount;
if(diff<=180) six+=exp.amount;
if(diff<=365) year+=exp.amount;

});

document.getElementById("total").innerText=total;
document.getElementById("day").innerText=day;
document.getElementById("week").innerText=week;
document.getElementById("month").innerText=month;
document.getElementById("six").innerText=six;
document.getElementById("year").innerText=year;


let average=0;

if(expenses.length>0){

let firstDate=expenses[0].date;

expenses.forEach(exp=>{
if(exp.date < firstDate){
firstDate=exp.date;
}
});

let days=((now-firstDate)/(1000*60*60*24))+1;

average=(total/days).toFixed(2);

}

document.getElementById("average").innerText=average;

}


function updateGraph(){

let monthlyData={};

expenses.forEach(exp=>{

let key=exp.date.getFullYear()+"-"+(exp.date.getMonth()+1);

if(!monthlyData[key]){
monthlyData[key]=0;
}

monthlyData[key]+=exp.amount;

});

let labels=Object.keys(monthlyData);
let data=Object.values(monthlyData);

if(chart){
chart.destroy();
}

let ctx=document.getElementById("expenseChart");

chart=new Chart(ctx,{
type:"bar",
data:{
labels:labels,
datasets:[{
label:"Monthly Expense",
data:data,
backgroundColor:"#36a2eb"
}]
}
});

}


function updateCategoryChart(){

let categoryData={
Food:0,
Travel:0,
Shopping:0,
Bills:0,
Other:0
};

expenses.forEach(exp=>{
categoryData[exp.category]+=exp.amount;
});

let labels=Object.keys(categoryData);
let data=Object.values(categoryData);

if(pieChart){
pieChart.destroy();
}

let ctx=document.getElementById("categoryChart");

pieChart=new Chart(ctx,{
type:"pie",
data:{
labels:labels,
datasets:[{
data:data,
backgroundColor:[
"#ff6384",
"#36a2eb",
"#ffcd56",
"#4bc0c0",
"#9966ff"
]
}]
}
});

}


function predictNextMonth(){

let monthlyData={};

expenses.forEach(exp=>{

let key=exp.date.getFullYear()+"-"+(exp.date.getMonth()+1);

if(!monthlyData[key]){
monthlyData[key]=0;
}

monthlyData[key]+=exp.amount;

});

let values=Object.values(monthlyData);

let prediction=0;

if(values.length>0){

let sum=values.reduce((a,b)=>a+b,0);
prediction=(sum/values.length).toFixed(2);

}

document.getElementById("prediction").innerText=prediction;

}


function coinRain(){

for(let i=0;i<10;i++){

let coin=document.createElement("div");

coin.innerHTML="₹";
coin.classList.add("coin");

coin.style.left=Math.random()*100+"%";

document.body.appendChild(coin);

setTimeout(()=>{
coin.remove();
},3000);

}

}