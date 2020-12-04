const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Employee = require("./lib/Employee");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const team = [];

function showMenu() {
    inquirer
        .prompt([{
            type: "input",
            name: "name",
            message: "Enter the employee name: ",
            validate: input => {
                //https://stackoverflow.com/questions/49633558/javascript-form-validation-letters-only
                if (!/^[a-zA-Z]*$/g.test(input)) {
                    return "Invalid input. The input should be letters only";
                }
                else return true;
            }
        }
            ,
        {
            type: "number",
            name: "id",
            message: "Enter the employee ID: "
        },
        {
            type: "input",
            name: "email",
            message: "Enter the employee email address: ",
        },
        {
            type: "list",
            message: "Enter the employee's role: ",
            name: "role",
            choices: [Manager, Engineer, Intern]
        },
        {
            type: "input",
            message: "Enter the engineer's github account: ",
            name: "github",
            validate: input => {
                if (!/^[a-zA-Z]*$/g.test(input)) {
                    return "Invalid input. The input should be letters only";
                }
                else return true;
            },
            when: input => input.role === "Engineer"
        },
        {
            type: "number",
            message: "Enter the manager's office number: ",
            name: "officeNumber",
            filter: input2 => {
                if (!/^[1-9]{1}[0-9]{9}$/.test(input2)) {
                    return ""
                }
                else return true
            },
            when: input => input.role === "Manager"
        },
        {
            type: "input",
            message: "Enter the intern's school name: ",
            name: "school",
            validate: input => {
                if (!/^[a-zA-Z]*$/g.test(input)) {
                    return "Invalid input. The input should be letters only";
                }
                else return true;
            },
            when: input => input.role === "Intern"
        },
        {
           // Reference: "https://stackoverflow.com/questions/58442756/nodejs-how-to-re-display
           //-custom-cli-menu-after-executing-corresponding-function"
            name: "back",
            type: "input",
            message: "Would you like to add another employee?(y or n)",
            choices: ["y", "n"],
        }]
        ).then((input) => {
            
            if (input.role === "Manager") {
                const emp = new Manager(
                    input.name,
                    input.id,
                    input.email,
                    input.officeNumber
                );
                team.push(emp)
            }
 
            else if (input.role === "Intern") {
                const emp = new Intern(
                    input.name,
                    input.id,
                    input.email,
                    input.school
                );
                team.push(emp)
            }
            else if (input.role === "Engineer") {
                const emp = new Engineer(
                    input.name,
                    input.id,
                    input.email,
                    input.officeNumber
                );
                team.push(emp)
            }
            if (input.back === 'y'){
                return showMenu();
            }
            else {
                const renderteam = render(team);

            console.log(input);

            console.log(team);

            
            fs.writeFile(outputPath, renderteam, {}, (err) =>
                err ? console.log(err) : console.log("HTML file created")
            );
            //create HTML file

        }
    }
        )

        .catch((err) => {
            console.log(err);
        });

}

showMenu();







// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
