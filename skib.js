document.addEventListener('DOMContentLoaded', function() {
    document.head.innerHTML += `
    <style>
    tr:nth-child(even) {background-color: #f2f2f2;}
    tr:hover {background-color: #ddd;}
    td, th {
      border: 1px solid #ddd;
      padding: 8px;
      font-family: Arial, Helvetica, sans-serif;
      border-collapse: collapse;
    }
    .switch {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 23px;
    }
    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      -webkit-transition: .4s;
      transition: .4s;
    }
    .slider:before {
      position: absolute;
      content: "";
      height: 17px;
      width: 17px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      -webkit-transition: .4s;
      transition: .4s;
    }
    input:checked + .slider {
      background-color: #2196F3;
    }
    input:focus + .slider {
      box-shadow: 0 0 1px #2196F3;
    }
    input:checked + .slider:before {
      -webkit-transform: translateX(17px);
      -ms-transform: translateX(17px);
      transform: translateX(17px);
    }
    .slider.round {
      border-radius: 23px;
    }
    .slider.round:before {
      border-radius: 50%;
    }
    </style>
    `;

    // Initialize the table content
    document.newBodyData = "<table>";

    chrome.management.getAll(function(extensions) {
        if (chrome.runtime.lastError) {
            console.error("Error fetching extensions:", chrome.runtime.lastError);
            return;
        }
        
        extensions.forEach(function(extension) {
            document.newBodyData += "<tr id=" + extension.id + ">";
            document.newBodyData += "<td><label class='switch'><input type='checkbox' " + (extension.enabled ? "checked" : "") + " onclick=\"toggleFunction('" + extension.id + "')\"><span class='slider round'></span></label></td>";
            document.newBodyData += "<td>" + extension.name + "</td>";
            document.newBodyData += "<td>" + extension.id + "</td>";
            document.newBodyData += "<td>" + extension.installType + "</td>";
            document.newBodyData += "</tr>";
        });

        document.newBodyData += "</table>";
        document.body.innerHTML = document.newBodyData;
    });

    // Define the toggle function
    document.toggleFunction = function(id) {
        var checkbox = document.getElementById(id).querySelector('input[type="checkbox"]');
        var isChecked = checkbox.checked;
        chrome.management.setEnabled(id, isChecked, function() {
            if (chrome.runtime.lastError) {
                console.error("Error setting extension state:", chrome.runtime.lastError);
            } else {
                console.log("Extension " + id + " has been " + (isChecked ? "enabled" : "disabled"));
            }
        });
    };
});
