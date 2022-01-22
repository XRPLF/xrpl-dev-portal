let calculator_data = {
  'btc': {
    'kWh': 951.58,
    'tons': 0.000000466,
    'gas': 75.7
  },
  'eth': {
    'kWh': 42.86334969,
    'tons': 0.0000000273454,
    'gas': 2.38677
  },
  'pap': {
    'kWh': 0.044,
    'tons': 0.0000000000232,
    'gas': 0.0035
  },
  'xrp': {
    'kWh': 0.0079,
    'tons': 0.0000000000045,
    'gas': 0.00063
  },
  'vsa': {
    'kWh': 0.0008,
    'tons': 0.00000000000046,
    'gas': 0.00006
  },
  'mst': {
    'kWh': 0.0006,
    'tons': 0.00000000000051,
    'gas': 0.00005
  },
}

function commarize() {
  // Alter numbers larger than 1k
  if (this >= 1e6) {
    var units = ["Thousand", "Million", "Billion", "Trillion"];

    // Divide to get SI Unit engineering style numbers (1e3,1e6,1e9, etc)
    let unit = Math.floor(((this).toFixed(0).length - 1) / 3) * 3
    // Calculate the remainder
    var num = (this / ('1e'+unit)).toFixed(2)
    var unitname = units[Math.floor(unit / 3) - 1]

    // output number remainder + unitname
    return num + ' ' + unitname
  }

  // return formatted original number
  return this.toLocaleString()
}

// Add method to prototype. this allows you to use this function on numbers and strings directly
Number.prototype.commarize = commarize
String.prototype.commarize = commarize

let slider = document.getElementById( 'myRange' ),
  txns = document.querySelectorAll( '.slider-amt' ),
  dataTypes = document.querySelectorAll( '.d-output' ),
  dataTxns = document.querySelectorAll( '.dash' ),
  dataViz = document.querySelectorAll( '.viz-output' );

// Update the current slider value (each time you drag the slider handle)
function doCalculations(val){

  // This loops through all the dataTypes returning the calculations for the selected one
  [].slice.call(dataTypes).forEach( function( dataType ){

    // if 'active', do calculations
    if (dataType.classList.contains('active')){

      // looping through the calculator data
      let data_type = dataType.getAttribute( 'data-type' ),
        data_comp = dataType.getAttribute( 'data-comp' ),
        total =  val * 1000000 * calculator_data[ data_type ][ data_comp ],
        num = document.getElementById( data_comp + '-' + data_type ),

        // kWhcomp = the number of kWh Portugal used in 2019
        kWhComp = ( total / 50340000000 ).toFixed( 2 );

      if (data_comp === 'tons') {
        total = total * 1000000;
      }

      num.innerHTML = total.commarize();
      num.style.transition = "all .2s ease-in-out";

      // This is for the kWh comparison, it animates the transition/selection
      if (data_comp === 'kWh' && kWhComp > .02){
        if ( kWhComp > 1.1 ) { kWhComp = 1.03 };
        let dot = document.getElementById(data_comp + '-' + data_type + '-dot');
        dot.style.transition = "all .2s ease-in-out";
        dot.style.transform = "scale(" + kWhComp * 100 + ")";
        dot.style.webkitTransform = "scale(" + kWhComp * 100 + ")";
        dot.style.msTransform = "scale(" + kWhComp * 100 + ")";
      }
    }
  })
}

// This function is for the slider to highlight the selected number
function highlightNum(val){
  [].slice.call(dataTxns).forEach(function(dataTxn){
    dataTxn.classList.remove('active');
    if (dataTxn.dataset.num === val){
      dataTxn.classList.add('active')
    }
  });
}

// Run animations if crypto is selected
function cryptoSelected(){
  gasCryptoAnimation();
  co2CryptoAnimation();
}
// Run animations if cash is selected
function cashSelected(){
  gasCashAnimation();
  co2CashAnimation();
}
// Run animations if credit is selected
function creditSelected(){
  gasCreditAnimation();
  co2CreditAnimation();
}

// This is function to select the data type
function changeDataType( type ){

  [].slice.call(dataTypes).forEach( function(dataType){
    if (dataType.classList.contains(type)){
      let dType = type.substring(2);
      dataType.classList.add('active');
      document.getElementById('gasAnimation').innerHTML = '';
      document.getElementById('co2Animation').innerHTML = '';

      if (dType === 'cash'){
        cashSelected();
      } else if (dType === 'credit'){
        creditSelected()
      } else {
        cryptoSelected();
      }
    } else {
      dataType.classList.remove('active');
    }
  });

  // based on toggle, then to calculations + slider value
  doCalculations(slider.value);

}

$('.tab-link').on('click', function(e){
  e.preventDefault();
  $('#data-selector li').removeClass('active');
  $(this).parent('li').addClass('active');

  // Pass the type to the Change Data function
  let type = $(this).data("currencytype");
  changeDataType(type);
  ga( 'send', 'event', 'Carbon Calculator', 'Toggle Data Type', type );
})

// This is main section that will run the functions once the page is ready
$(document).ready(function(){
  // gets the slider value
  [].slice.call(txns).forEach(function(txn){
    txn.innerHTML = slider.value;
  })

  // On the slider change, run the Calculator functions
  slider.oninput = function() {
    var val = this.value;
    [].slice.call(txns).forEach(function(txn){
      txn.innerHTML = val;
    });
    highlightNum(val);
    doCalculations(val);
    ga( 'send', 'event', 'Carbon Calculator', 'Slider Data Amount', val );
  }

  // On page load, run default functions
  doCalculations(slider.value);
  cryptoSelected();

  // For mobile, show or hide the button
  $(window).on('load resize scroll', function() {
    if ($(window).width() < 993) {
      let distance = $('#calculator-outputs').offset().top,
        $window = $(window).scrollTop(),
        data_toggle = $('#calculator-mobile-toggle'),
        inputs = $('#calculator-inputs'),
        inputs_offset = $('#calculator-inputs-offset');

      if (distance < $window){
        data_toggle.addClass('show').removeClass('hide');
      } else {
        inputs.removeClass('sticky');
        data_toggle.addClass('hide').removeClass('show');
        inputs_offset.removeClass('offset' );
        $('#data-toggle').text('Change Inputs');
      }
    }
  });

  // This is the mobile button
  $('#calculator-mobile-toggle').on( 'click', function(e){
    e.preventDefault();

    let inputs = $('#calculator-inputs'),
      inputs_offset = $('#calculator-inputs-offset');

    $('#calculator-inputs' ).toggleClass('show');

    if (inputs.hasClass('sticky')) {
      inputs.removeClass('sticky');
      inputs_offset.removeClass('offset');
      $(this).text('Change Inputs');
      ga( 'send', 'event', 'Carbon Calculator', 'Mobile Toggle', 'Change Inputs' );
    } else {
      inputs.addClass('sticky show');
      inputs_offset.addClass('offset');
      $(this).text('Hide Inputs');
      ga( 'send', 'event', 'Carbon Calculator', 'Mobile Toggle', 'Hide Inputs' );
    }
  });

  $(document).on('click', 'a[href^="#calculator"]', function(event) {
    event.preventDefault();

    $('html, body').animate({
      scrollTop: $($.attr(this, 'href')).offset().top - 80
    }, 800);
  });
  
});
