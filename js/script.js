
//Button Listener
$('button').on({

    // Touchstart and Mousedown are equivalent
    touchstart: function(e) {
        e.preventDefault();
        this.classList.toggle('active');
        clickButton(e);
    },

    // Touchstart and Mousedown are equivalent
    mousedown: function(e) {
        e.preventDefault();
        this.classList.toggle('active');
        clickButton(e);
    },

    // Touchend and Mouseup are equivalent
    touchend: function(e){
        e.preventDefault();
        this.classList.toggle('active');
        releaseButton(e);
    },

    // Touchend and Mouseup are equivalent
    mouseup: function(e) {
        e.preventDefault();
        this.classList.toggle('active');
        releaseButton(e);
    },
});

//What Happens when the button is clicked
function clickButton(e) {
    document.getElementById('buttonText').innerText = 'click';

    CrComLib.publishSignal('b','1',true);
    CrComLib.publishSignal('n','1',Math.floor(Math.random() * 65536));
    CrComLib.publishSignal('s','1', generateRandomText());

}

// Called when the button is released
function releaseButton(e) {
    document.getElementById('buttonText').innerText = 'release';
    CrComLib.publishSignal('b','1',false);
}


// Generates some random text
function generateRandomText() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}


// Set Up Subscriptions for FB from CS
$( document ).ready(function() {
    $('#digitalSubscribeText')[0].innerText = CrComLib.subscribeSignal('b', 'fb1', handleDigitalFB, errorCallback);
    $('#numericSubscribeText')[0].innerText = CrComLib.subscribeSignal('n', 'fb1', handleNumericFB, errorCallback);
    $('#serialSubscribeText')[0].innerText = CrComLib.subscribeSignal('s', 'fb1', handleSerialFB, errorCallback);
})


// Callback function for Digital FB signals changing from CS
function handleDigitalFB(v) {
    $('#digitalFB')[0].innerText = 'Dig FB = ' + v;
}


// Callback function for Numeric (Analog) FB signals changing from CS
function handleNumericFB(v) {
    $('#numericFB')[0].innerText = 'Analog FB = ' + v;
}

// Callback function for Serial FB signals changing from CS
function handleSerialFB(v) {
    $('#serialFB')[0].innerText = 'Serial FB = ' + v;
}

// Error Callback function for any subscribeSignal() functions
function errorCallback() {
    $('#errorText')[0].innerText = 'error Callback!';
}