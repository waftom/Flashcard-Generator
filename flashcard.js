var inquirer = require("inquirer");
var fs = require("fs");

var basicArr = []; // Array to print basic cards
var clozeArr = []; // Array to print cloze-deleted

// Basic card constructor
function BasicCard(front, back) {
    this.front = front;
    this.back = back;
    this.type = 'basic';

    // Get front text
    this.getFront = function() {
        return this.front;
    };

    // Get back text
    this.getBack = function() {
        return this.back;
    };

    // Get back text
    this.getType = function() {
        return this.type;
    };
}

// Cloze-deleted constructor
function ClozeCard(text, cloze) {
    this.text = text;

    // Check if cloze is empty
    if(cloze === '' || cloze === null) {
        console.log("Cloze can't be empty");
        return false;
    } else {
        this.cloze = cloze;
    }

    this.type = 'cloze';

    // Get the cloze-deleted text
    this.getCD = function() {
        return this.cloze;
    };

    // Get the partial text
    this.getPT = function() {
        return this.text;
    };

    // Get the full text
    this.getFT = function() {
        return text.replace("...", this.cloze);
    };

    // Get back text
    this.getType = function() {
        return this.type;
    };
}

// Adding a method to BasicCard using prototype
BasicCard.prototype.printCards = function() {
    console.log("Front: " + this.getFront());
    console.log("Back: " + this.getBack());
    console.log("Type: " + this.getType());
};

// Adding a method to ClozeCard using prototype
ClozeCard.prototype.printCards = function() {
    console.log("Full text: " + this.getFT());
    console.log("Partial text: " + this.getPT());
    console.log("Cloze deleted: " + this.getCD());
    console.log("Type: " + this.getType());
};

var again = true; // Flag to check if loop should go again

// Questions function using inquirer
function question() {
    if(again) {
        again = false;
        inquirer.prompt([
            {
                type: "list",
                message: "What type of CARD?",
                choices: ["Cloze-Deleted", "Basic"],
                name: "type"
            }, {
                type: "input",
                message: "Type the TEXT/FRONT text:",
                name: "text_front"
            }, {
                type: "input",
                message: "Type the CLOZE/BACK text:",
                name: "cloze_back"
            }, {
                type: "list",
                message: "Want to add more?",
                choices: ["Yes", "No"],
                name: "again"
            }
        ]).then(function(a) {
            var c;

            // Condition to create a BasicCard/ClozeCard
            if(a.type == "Cloze-Deleted") {
                c = new ClozeCard(a.text_front, a.cloze_back);
                clozeArr.push(c); // Add the object to array
            } else {
                c = new BasicCard(a.text_front, a.cloze_back);
                basicArr.push(c); // Add the object to array
            }

            write(c); // Store the object in the JSON file

            // Loop again if selected so
            if(a.again == "Yes"){
                console.log('');
                again = true;
            } else {
                console.log('');
                printText(clozeArr);
                console.log('');
                printText(basicArr);
            }

            question(); // Keep calling Question function
        });
    }
}

var dataJson = '';

// Function to write the JSON file
function write(cardObj) {
    // Read all the content and store it
    fs.readFile("log.json", "utf8", function(error, data) {
        dataJson = data;

        var obj = JSON.parse(dataJson);
        obj['FlashCard'].push(cardObj); // Add the new object to array (JSON)

        // Rewrite all the file with new content
        fs.writeFile("log.json", JSON.stringify(obj), function(err) {
            if (err) {
                return console.log(err);
            }
        });
    });
}

// Print the content added during the application
function printText(cardObj) {
    for(var i=0;i<cardObj.length;i++) {
        cardObj[i].printCards();
        console.log('');
    }
}

question(); // Call the first time the Question function
