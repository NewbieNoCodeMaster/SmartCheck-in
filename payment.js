var smartCheckinCode = "898647634002";

function checkCode(codeId) {
  var enteredCode = document.getElementById(codeId).value;

  if (codeId === 'unlock-code1' && enteredCode === smartCheckinCode) {
    
    alert("Unlocked!");
    
    window.location.href = "content/index.html";
  } else {
    alert("Incorrect code. Try again.");
  }
}

function showPayment(service) {
  alert("You are about to pay for " + service + ".");
  window.location.href = "https://forms.gle/QAEjcg6V7mxqdtSr7";
  
}


