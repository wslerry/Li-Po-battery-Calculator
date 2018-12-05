$( "#cellCount" ).click(function() {
  $( "#watt_column" ).hide("fast");
  $( "#time_column" ).hide("fast");
});

$( "#numPack" ).click(function() {
  $( "#watt_column" ).hide("fast");
  $( "#time_column" ).hide("fast");
});

$( "#mAh" ).click(function() {
  $( "#watt_column" ).hide("fast");
  $( "#time_column" ).hide("fast");
});

$( "#C" ).click(function() {
  $( "#watt_column" ).hide("fast");
  $( "#time_column" ).hide("fast");
});

$( "#discharge" ).click(function() {
  $( "#watt_column" ).hide("fast");
  $( "#time_column" ).hide("fast");
});

$( "#watts_select" ).click(function() {
  $( "#time_column" ).hide("fast");
  $( "#watt_column" ).show("fast");
});

$( "#time_select" ).click(function() {
  $( "#watt_column" ).hide("fast");
  $( "#time_column" ).show("fast");
});

function input_params(){
  if(document.getElementById('cellCount').value == "") {
    document.getElementById('packVoltage').value = "";
    document.getElementById('cellNumbers').value = "";
  }

  if(document.getElementById('cellCount').value == "1s") {
    resetValue()
    document.getElementById('packVoltage').value = "3.7";
    document.getElementById('cellNumbers').value = "1";
  }

  if(document.getElementById('cellCount').value == "2s") {
    resetValue()
    document.getElementById('packVoltage').value = "7.4";
    document.getElementById('cellNumbers').value = "2";
  }

  if(document.getElementById('cellCount').value == "3s") {
    resetValue()
    document.getElementById('packVoltage').value = "11.1";
    document.getElementById('cellNumbers').value = "3";
  }

  if(document.getElementById('cellCount').value == "4s"){
    resetValue()
    document.getElementById('packVoltage').value = "14.8";
    document.getElementById('cellNumbers').value = "4";
  }

  if(document.getElementById('cellCount').value == "5s"){
    resetValue()
    document.getElementById('packVoltage').value = "18.5";
    document.getElementById('cellNumbers').value = "5";
  }

  if(document.getElementById('cellCount').value == "6s"){
    resetValue()
    document.getElementById('packVoltage').value = "22.2";
    document.getElementById('cellNumbers').value = "6";
  }

  if(document.getElementById('cellCount').value == "7s"){
    resetValue()
    document.getElementById('packVoltage').value = "25.9";
    document.getElementById('cellNumbers').value = "7";
  }

  if(document.getElementById('cellCount').value == "8s"){
    resetValue()
    document.getElementById('packVoltage').value = "29.6";
    document.getElementById('cellNumbers').value = "8";
  }

  if(document.getElementById('cellCount').value == "9s"){
    resetValue()
    document.getElementById('packVoltage').value = "33.3";
    document.getElementById('cellNumbers').value = "9";
  }

  if(document.getElementById('cellCount').value == "10s"){
    resetValue()
    document.getElementById('packVoltage').value = "37";
    document.getElementById('cellNumbers').value = "10";
  }

  if(document.getElementById('cellCount').value == "11s"){
    resetValue()
    document.getElementById('packVoltage').value = "40.7";
    document.getElementById('cellNumbers').value = "11";
  }

  if(document.getElementById('cellCount').value == "12s"){
    resetValue()
    document.getElementById('packVoltage').value = "44.4";
    document.getElementById('cellNumbers').value = "12";
  }
}

function resetValue() {
  document.getElementById('packVoltage').value = "";
  document.getElementById('cellNumbers').value = "";
}

var watts_select = document.getElementById('watts_select');
watts_select.onclick = todo;

var time_select = document.getElementById('time_select');
time_select.onclick =calc;

function calc_amps(){
  var pack_no = document.getElementById('numPack').value ;
  var capacity = document.getElementById('mAh').value ;
  var rate = document.getElementById('C').value ;
  var amps = pack_no*capacity*rate*0.001;
  document.getElementById('charge_amps').value= math.round(amps,1);
}

function calc_watts(){
  var amps = document.getElementById('charge_amps').value ;
  var s = document.getElementById('cellNumbers').value;
  var watts = amps * s * 1.25 * 3.8;
  document.getElementById('require_watt').value= math.round(watts,1);
}

function todo() {
  calc_amps();
  calc_watts();
}

function calc_maxload(){
  var capacity = document.getElementById('mAh').value ;
  var discharge = document.getElementById('discharge').value ;
  var maxload = capacity*0.001*discharge;
  document.getElementById('max_load').value= math.round(maxload,1);
}

function calc_time(){
  var capacity = document.getElementById('mAh').value ;
  var discharge = document.getElementById('discharge').value ;
  var flighttime = (capacity/1000)*0.8/20*60 ;
  var flighttime2 = (capacity/1000)/20*60 ;
  document.getElementById('flight_time').value = math.round(flighttime,1);
  document.getElementById('flight_time2').value = math.round(flighttime2,1);
}

function calc() {
  calc_maxload();
  calc_time();
}
