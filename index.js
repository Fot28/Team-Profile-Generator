const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./src/page-template.js");

// Function to prompt for manager information
function promptManager() {
	console.log("Please enter manager information:");

	return inquirer.prompt([
		{
			type: "input",
			name: "name",
			message: "Manager's name:",
			validate: function (input) {
				if (!/^[A-Za-z]+$/.test(input)) {
					return "Please enter a valid name containing only letters.";
				}
				return true;
			},
			filter: function (input) {
				// Capitalize the first letter and convert the rest to lowercase
				return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
			},
		},
		{
			type: "input",
			name: "id",
			message: "Manager's ID:",
			validate: function (input) {
				if (!/^[1-9]\d*$/.test(input)) {
					return "Please enter a valid ID (must be a positive integer).";
				}
				return true;
			},
		},
		{
			type: "input",
			name: "email",
			message: "Manager's email:",
			validate: function (input) {
				if (!/\S+@\S+\.\S+/.test(input)) {
					return "Please enter a valid email address.";
				}
				return true;
			},
		},
		{
			type: "input",
			name: "officeNumber",
			message: "Manager's office number:",
			validate: function (input) {
				if (!/^[1-9]\d*$/.test(input)) {
					return "Please enter a valid office number (must be a positive integer).";
				}
				return true;
			},
		},
	]);
}

// Function to prompt for engineer information
function promptEngineer() {
	console.log("Please enter engineer information:");

	return inquirer.prompt([
		{
			type: "input",
			name: "name",
			message: "Engineer's name:",
			validate: function (input) {
				if (!/^[A-Za-z]+$/.test(input)) {
					return "Please enter a valid name containing only letters.";
				}
				return true;
			},
			filter: function (input) {
				// Capitalize the first letter and convert the rest to lowercase
				return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
			},
		},
		{
			type: "input",
			name: "id",
			message: "Engineer's ID:",
			validate: function (input) {
				if (!/^[1-9]\d*$/.test(input)) {
					return "Please enter a valid ID (must be a positive integer).";
				}
				return true;
			},
		},
		{
			type: "input",
			name: "email",
			message: "Engineer's email:",
			validate: function (input) {
				if (!/\S+@\S+\.\S+/.test(input)) {
					return "Please enter a valid email address.";
				}
				return true;
			},
		},
		{
			type: "input",
			name: "github",
			message: "Engineer's GitHub username:",
			validate: function (input) {
				if (input.trim().length === 0) {
					return "Please enter a valid GitHub username.";
				}
				return true;
			},
		},
	]);
}

// Function to prompt for intern information
function promptIntern() {
	console.log("Please enter intern information:");

	return inquirer.prompt([
		{
			type: "input",
			name: "name",
			message: "Intern's name:",
			validate: function (input) {
				if (!/^[A-Za-z]+$/.test(input)) {
					return "Please enter a valid name containing only letters.";
				}
				return true;
			},
			filter: function (input) {
				// Capitalize the first letter and convert the rest to lowercase
				return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
			},
		},
		{
			type: "input",
			name: "id",
			message: "Intern's ID:",
			validate: function (input) {
				if (!/^[1-9]\d*$/.test(input)) {
					return "Please enter a valid ID (must be a positive integer).";
				}
				return true;
			},
		},
		{
			type: "input",
			name: "email",
			message: "Intern's email:",
			validate: function (input) {
				if (!/\S+@\S+\.\S+/.test(input)) {
					return "Please enter a valid email address.";
				}
				return true;
			},
		},
		{
			type: "input",
			name: "school",
			message: "Intern's school:",
			validate: function (input) {
				if (input.trim().length === 0) {
					return "Please enter a valid school name.";
				}
				return true;
			},
		},
	]);
}

// Main function to gather information and generate the team HTML
function gatherTeamInformation() {
	const teamMembers = [];

	// Prompt for manager information
	return promptManager()
		.then(function (managerData) {
			const manager = new Manager(
				managerData.name,
				managerData.id,
				managerData.email,
				managerData.officeNumber
			);
			teamMembers.push(manager);

			// Prompt for additional team members until the user chooses not to add anymore
			function promptNextMember() {
				return inquirer
					.prompt([
						{
							type: "list",
							name: "role",
							message: "Choose the role of the team member:",
							choices: ["Engineer", "Intern", "Finish building the team"],
						},
					])
					.then(function ({ role }) {
						if (role === "Engineer") {
							return promptEngineer().then(function (engineerData) {
								const engineer = new Engineer(
									engineerData.name,
									engineerData.id,
									engineerData.email,
									engineerData.github
								);
								teamMembers.push(engineer);
								return promptNextMember();
							});
						} else if (role === "Intern") {
							return promptIntern().then(function (internData) {
								const intern = new Intern(
									internData.name,
									internData.id,
									internData.email,
									internData.school
								);
								teamMembers.push(intern);
								return promptNextMember();
							});
						} else if (role === "Finish building the team") {
							return teamMembers;
						}
					});
			}

			return promptNextMember();
		})
		.then(function (teamMembers) {
			// Generate HTML using the team members' data
			const renderedHTML = render(teamMembers);

			// Create the output directory if it doesn't exist
			if (!fs.existsSync(OUTPUT_DIR)) {
				fs.mkdirSync(OUTPUT_DIR);
			}

			// Write the rendered HTML to the output file
			fs.writeFileSync(outputPath, renderedHTML);

			console.log(`Team HTML file generated successfully at: ${outputPath}`);
		})
		.catch(function (err) {
			console.error("An error occurred:", err);
		});
}

// Call the main function to gather information and generate the team HTML
gatherTeamInformation();
