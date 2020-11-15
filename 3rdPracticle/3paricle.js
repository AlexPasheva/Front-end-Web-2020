var s = [10, 5, 13, 18, 51];
for ( i=0; i<5; i++)
{
    console.log(s[i]);
}

function TimesTwo(el)
{
   return s*2;
}
function TimesTwo(array)
{
    array.forEach(TimesTwo);
}
function OnlyEven(array)
{
    array.filter(function(n){ return n%3 === 0; });
}
function FilterDividedByThree(array)
{
    array.filter(function(n){ return n%2 === 0; });
}
function IsElementLessThan10(array)
{
    for ( i=0; i<array.length; i++)
    {
        if(array[i]<10)
        {
            return true;
        }
    }
    return false;
}
function SumEls(array)
{
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    console.log(array1.reduce(reducer));
}
function LastTwo(array)
{
    array.slice(0, array.length-3);
}
Date.prototype.monthDays= function(){
    var d= new Date(this.getFullYear(), this.getMonth()+1, 0);
    return d.getDate();
}
function ParseDate(date1)
{
    return ("<b>" + date[1].prototype.getDate() + "," + d.prototype.getMonth() + "," + d.prototype.getFullYear() + "</b>");
}
function ConstructDate()
{
    var d = new Date(2018, 12, 8, 21);
    var d2 = new Date();
    return [d,d2];
}
function InfoDate(array)
{
    var arr=new Array();
    for ( i=0; i<array.length; i++)
    {
        arr[i]=[array[i].monthDays(), array[i].getDay];
    }
    return arr;
}
function AppendInfo()
{
    var a=[[ParseDate(ConstructDate[0]), InfoDate(ConstructDate[0])[0][0]+"day" ,InfoDate(ConstructDate[0])[0][1]+"days"],
     [ParseDate(ConstructDate[1]), InfoDate(ConstructDate[1])[1][0]+"day" ,InfoDate(ConstructDate[1])[1][1]+"days"]];
}