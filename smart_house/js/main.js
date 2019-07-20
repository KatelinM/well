//noise
// document.getElementById ('noise').contentWindow.scrollTop = 3000;
// $("#noise html").animate({scrollTop:200}, 0);
$(document).ready(function(){
    // document.getElementById('noise').contentWindow.scrollTo(0,500);
    document.getElementById('noise').contentWindow.scrollTo(0,500);

})
//Температура
var temprature = document.getElementById('temperature').value,
rangeTemperature = $('.temperature .input-range'),
valueTemperature = $('.temperature .range-value');
valueTemperature.html(rangeTemperature.attr('value') + ' °C');
rangeTemperature.on('input', function() {
    valueTemperature.html(this.value + ' °C');
});
//Освещенность
var brightness = document.getElementById('brightness').value,
rangeBrightness = $('.brightness .input-range'),
valueBrightness = $('.brightness .range-value');
valueBrightness.html(rangeBrightness.attr('value') + ' Лб');
rangeBrightness.on('input', function() {
    valueBrightness.html(this.value + ' Лб');
});
//Humidity
var humidity = document.getElementById('humidity').value,
rangeHumidity = $('.humidity .input-range'),
valueHumidity = $('.humidity .range-value');
valueHumidity.html(rangeHumidity.attr('value') + ' %');
rangeHumidity.on('input', function() {
    valueHumidity.html(this.value + ' %');
});
//window
var window = document.getElementById('window').value,
rangeWindow = $('.window .input-range'),
valueWindow = $('.window .range-value');
valueWindow.html(rangeWindow.attr('value') + ' °');
rangeWindow.on('input', function() {
    valueWindow.html(this.value + ' °');
});
//открыть дверь
var light = true
$('.button-bg').click(function() {
    light=!light
    $(this).toggleClass('active');
    console.log(light)
});
//admin mode
var isAdmin = false
var admin = document.getElementsByClassName('admin')

function admin() {
    isAdmin=!isAdmin
    if(isAdmin){
        admin.style.display= 'block'
    }else{
        admin.style.display= 'none'
    }
}
