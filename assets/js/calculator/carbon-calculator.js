let arr = {
  'btc': {
    'kWh': 487.368757765725,
    'tons': 0.41034833,
    'gas': 38.7744
  },
  'eth': {
    'kWh': 42.8633,
    'tons': 0.02734399,
    'gas': 2.38677
  },
  'pap': {
    'kWh': 0.044,
    'tons': 0.0000000000232,
    'gas': 0.00350
  },
  'xrp': {
    'kWh': 0.0079,
    'tons': 0.000000000003688,
    'gas': 0.00063
  },
  'vsa': {
    'kWh': 0.0008,
    'tons': 0.0000000000005,
    'gas': 0.00006
  },
  'mst': {
    'kWh': 0.0006,
    'tons': 0.0000000000005,
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
  dataViz = document.querySelectorAll( '.viz-output' );

// Update the current slider value (each time you drag the slider handle)
function doCalculations( val ){

  [].slice.call( dataTypes ).forEach( function( dataType ){

    if ( dataType.classList.contains( 'active' ) ){

      let data_type = dataType.getAttribute( 'data-type' ),
        data_comp = dataType.getAttribute( 'data-comp' ),
        total =  val * 1000000 * arr[ data_type ][ data_comp ],
        num = document.getElementById( data_comp + '-' + data_type ),
        // comp = the number of kWh Portugal used in 2019
        kwhComp = ( total / 50340000000 ).toFixed( 2 );

      if ( data_comp === 'tons' ) {
        total = total * 1000000;
      }

      num.innerHTML = total.commarize();
      num.style.transition = "all .2s ease-in-out";

      if ( data_comp === 'kWh' && kwhComp > .02 ){
        let dot = document.getElementById( data_comp + '-' + data_type + '-dot' );
        dot.style.transition = "all .2s ease-in-out";
        dot.style.transform = "scale(" + kwhComp * 100 + ")";
        dot.style.webkitTransform = "scale(" + kwhComp * 100 + ")";
        dot.style.msTransform = "scale(" + kwhComp * 100 + ")";
      }

    }
  })
}


function cryptoSelected(){
  gasCryptoAnimation( );
  co2CryptoAnimation();
}

function cashSelected(){
  gasCashAnimation();
  co2CashAnimation();
}

function creditSelected(){
  gasCreditAnimation();
  co2CreditAnimation();
}

function changeDataType( type ){

  [].slice.call( dataTypes ).forEach( function( dataType ){
    if ( dataType.classList.contains( type ) ){
      let dType = type.substring(2);
      dataType.classList.add( 'active' );
      document.getElementById('gasAnimation').innerHTML = '';
      document.getElementById('co2Animation').innerHTML = '';

      if ( dType === 'cash' ){
        cashSelected();
      } else if ( dType === 'credit' ){
        creditSelected()
      } else {
        cryptoSelected();
      }
    } else {
      dataType.classList.remove( 'active' );
    }
  });

  doCalculations( slider.value );

}

$('.tab-link').on('click', function(e){
  $( '#data-selector li' ).removeClass( 'active' );
  $( this ).parent( 'li' ).addClass( 'active' );

  let type = $( this ).data("currencytype");

  changeDataType( type );
  e.preventDefault();
})

$( document ).ready( function(){
   [].slice.call( txns ).forEach( function( txn ){
    txn.innerHTML = slider.value;
  })

  slider.oninput = function() {
    var val = this.value;
    [].slice.call( txns ).forEach( function( txn ){
      txn.innerHTML = val;
    })
    doCalculations( val );
  }

  doCalculations( slider.value );
  cryptoSelected();

  $(window).on('load resize scroll', function() {
    if ( $(window).width() < 993 ) {
      let distance = $('#calculator-outputs').offset().top,
        $window = $(window).scrollTop(),
        data_toggle = $('#calculator-mobile-toggle'),
        inputs = $('#calculator-inputs'),
        inputs_offset = $( '#calculator-inputs-offset');

      if ( distance < $window ){
        data_toggle.addClass( 'show' ).removeClass( 'hide' );
      } else {
        inputs.removeClass( 'sticky' );
        data_toggle.addClass( 'hide' ).removeClass( 'show' );
        inputs_offset.removeClass( 'offset' );
        $('#data-toggle').text('Change Inputs');
      }
    }
  });

  $('#calculator-mobile-toggle').on( 'click', function(e){
    e.preventDefault();
    console.log( "working");

    let inputs = $('#calculator-inputs'),
      inputs_offset = $( '#calculator-inputs-offset');

    $( '#calculator-inputs' ).toggleClass( 'show' );

    if ( inputs.hasClass( 'sticky' ) ) {
      inputs.removeClass( 'sticky' );
      inputs_offset.removeClass( 'offset' );
      $( this ).text('Change Inputs');
    } else {
      inputs.addClass( 'sticky show' );
      inputs_offset.addClass( 'offset' );
      $( this ).text('Hide Inputs');
    }
  })
});
