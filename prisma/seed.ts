import "dotenv/config";
import { prisma } from "../lib/prisma";

// Replace with your admin email
const ADMIN_EMAIL = "marketing-2@dir.com.mm";

async function main() {
  console.log("🌱 Starting placement test seed...");

  // Find the admin user
  const admin = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (!admin) {
    console.error(`❌ Admin user not found with email: ${ADMIN_EMAIL}`);
    console.log("Please update ADMIN_EMAIL in this seed file");
    process.exit(1);
  }

  console.log(`✅ Found admin user: ${admin.email}`);

  // Delete existing placement test if it exists
  const existingTest = await prisma.placementTest.findFirst({
    where: { teacherId: admin.id, title: "IT Placement Test" },
  });

  if (existingTest) {
    await prisma.placementTest.delete({ where: { id: existingTest.id } });
    console.log("🗑️  Deleted existing IT Placement Test");
  }

  // Create the placement test with all 30 questions
  const test = await prisma.placementTest.create({
    data: {
      title: "IT Placement Test",
      description: "A comprehensive IT placement test covering various topics",
      teacherId: admin.id,
      questions: {
        create: [
          {
            question:
              "What happens if you click on the maximize button in a window of Microsoft Windows?",
            type: "MULTIPLE_CHOICE",
            options: [
              "a new window of the same window is opened",
              "the window is maximized",
              "the size of the window is changed to the preset size",
              "the window appears in front of others",
            ],
            correctAnswer: "the window is maximized",
            position: 1,
          },
          {
            question:
              "If you want to select multiple objects and copy them to a specific location…",
            type: "MULTIPLE_CHOICE",
            options: [
              "Hold Ctrl and click each one and drag them to the location",
              "Hold Alt and click each one and drag them to the location",
              "Drag each one to the location",
              "Hold Shift and click each one, then right-click and click Cut",
            ],
            correctAnswer:
              "Hold Ctrl and click each one and drag them to the location",
            position: 2,
          },
          {
            question: "What is Firewall?",
            type: "MULTIPLE_CHOICE",
            options: [
              "It is a program that checks your computer for malware",
              "It is a program that cleans your infected computer from viruses",
              "It is a separate device in each case",
              "It is something which keeps your network secure",
            ],
            correctAnswer: "It is something which keeps your network secure",
            position: 3,
          },
          {
            question:
              "What happen when a Trojan horse is infected in your computer?",
            type: "MULTIPLE_CHOICE",
            options: [
              "It usually steals information from your computer",
              "It intends to copy itself",
              "It infects other files",
              "It is a hidden program",
            ],
            correctAnswer: "It usually steals information from your computer",
            position: 4,
          },
          {
            question:
              "Your data table has numerical data in some rows and columns. At the top of each column and at the left of each row is the proper description (headers). How to create the chart?",
            type: "MULTIPLE_CHOICE",
            options: [
              "It is necessary to select only the row headers",
              "It is necessary to select both the row and the column headers",
              "It is necessary to select only the column headers",
              "It is not necessary to select any header",
            ],
            correctAnswer:
              "It is necessary to select both the row and the column headers",
            position: 5,
          },
          {
            question: "When you type inside a cell.",
            type: "MULTIPLE_CHOICE",
            options: [
              "text is aligned to the right",
              "numbers are aligned to the right",
              "text and numbers are aligned to the right",
              "None of above",
            ],
            correctAnswer: "numbers are aligned to the right",
            position: 6,
          },
          {
            question:
              "The picture shows the Timing group of the Transition tab for a slide. (See image: powerpoint-timing.png)",
            type: "MULTIPLE_CHOICE",
            options: [
              "The transition takes 10 seconds and the slide appears for 4 extra",
              "The transition takes 6 seconds and the slide appears for 16 extra",
              "The transition takes 6 seconds and the slide appears for 10 extra",
              "The transition takes 10 seconds and the slide appears for 6 extra",
            ],
            correctAnswer:
              "The transition takes 6 seconds and the slide appears for 10 extra",
            position: 7,
            imageUrl: "quizzimage.png", // Update this when you have the image
          },
          {
            question: "When you set the Right Tab.",
            type: "MULTIPLE_CHOICE",
            options: [
              "the text flows to the right",
              "the numbers are aligned around a decimal point",
              "the text flows to the left",
              "the text centres to this position as you type",
            ],
            correctAnswer: "the text flows to the left",
            position: 8,
          },
          {
            question: "When you insert page numbering...",
            type: "MULTIPLE_CHOICE",
            options: [
              "you insert a SmartArt",
              "you insert a picture",
              "you insert a header or footer",
              "None of above",
            ],
            correctAnswer: "you insert a header or footer",
            position: 9,
          },
          {
            question: "When does the error message '#NAME?' appear?",
            type: "MULTIPLE_CHOICE",
            options: [
              "This message appears when the column is not wide enough to display all of its content",
              "This error message appears when you have typed a wrong formula and Excel cannot recognize it",
              "This error message appears when you divide something by 0",
              "None of above",
            ],
            correctAnswer:
              "This error message appears when you have typed a wrong formula and Excel cannot recognize it",
            position: 10,
          },
          {
            question: "What does the COUNTIF function do?",
            type: "MULTIPLE_CHOICE",
            options: [
              "Defines which cells will be counted",
              "Checks if all the conditions of a particular group are met",
              "Checks if any of a group of conditions are met",
              "None of Above",
            ],
            correctAnswer: "Defines which cells will be counted",
            position: 11,
          },
          {
            question:
              "When you use the dollar sign in front of a letter (e.g. $E1).",
            type: "MULTIPLE_CHOICE",
            options: [
              "the cell does not change when it is copied. Both the column and the row remain the same",
              "the row changes when it is copied, but the column remains the same",
              "the column changes when it is copied, but the row remains the same",
              "None of above",
            ],
            correctAnswer:
              "the row changes when it is copied, but the column remains the same",
            position: 12,
          },
          {
            question: "What things can you add to a website.",
            type: "MULTIPLE_CHOICE",
            options: ["videos", "links", "images", "all the above"],
            correctAnswer: "all the above",
            position: 13,
          },
          {
            question: "Why can you add Content Block into your web page?",
            type: "MULTIPLE_CHOICE",
            options: [
              "copy and paste",
              "drags and drop",
              "opening the Design menu",
              "you cannot add elements",
            ],
            correctAnswer: "drags and drop",
            position: 14,
          },
          {
            question:
              "In Microsoft Word a heading can be applied from the Outline view.",
            type: "TRUE_FALSE",
            options: ["true", "false"],
            correctAnswer: "true",
            position: 15,
          },
          {
            question: "To select a word, you can double-click it.",
            type: "TRUE_FALSE",
            options: ["true", "false"],
            correctAnswer: "true",
            position: 16,
          },
          {
            question:
              "When you change the line or character spacing you use points (pt). 10pt is about one millimetre.",
            type: "TRUE_FALSE",
            options: ["true", "false"],
            correctAnswer: "false",
            position: 17,
          },
          {
            question:
              "You can attach a movie to an email message, but it is not certain if it will reach the recipient.",
            type: "TRUE_FALSE",
            options: ["true", "false"],
            correctAnswer: "true",
            position: 18,
          },
          {
            question:
              "You can change the home page of a browser to whatever you want.",
            type: "TRUE_FALSE",
            options: ["true", "false"],
            correctAnswer: "true",
            position: 19,
          },
          {
            question: "What does a variable store in programming?",
            type: "MULTIPLE_CHOICE",
            options: ["fixed value", "A changing value", "A command", "A loop"],
            correctAnswer: "A changing value",
            position: 20,
          },
          {
            question: "Which of the following is a correct variable name?",
            type: "MULTIPLE_CHOICE",
            options: ["2number", "my-variable", "myVariable", "my variable"],
            correctAnswer: "myVariable",
            position: 21,
          },
          {
            question:
              "What will this code output?\n\nx = 5\ny = 3\nprint(x + y)",
            type: "MULTIPLE_CHOICE",
            options: ["53", "8", "15", "Error"],
            correctAnswer: "8",
            position: 22,
          },
          {
            question:
              "Which statement is used to make decisions in programming?",
            type: "MULTIPLE_CHOICE",
            options: ["loop", "print", "if", "input"],
            correctAnswer: "if",
            position: 23,
          },
          {
            question: "What is a loop used for?",
            type: "MULTIPLE_CHOICE",
            options: [
              "Storing data",
              "Repeating actions",
              "Making decisions",
              "Displaying output",
            ],
            correctAnswer: "Repeating actions",
            position: 24,
          },
          {
            question: "What comes next in the sequence?\n2, 4, 8, 16, ___",
            type: "MULTIPLE_CHOICE",
            options: ["18", "24", "32", "30"],
            correctAnswer: "32",
            position: 25,
          },
          {
            question:
              "If a robot turns right 3 times, what direction is it facing?",
            type: "MULTIPLE_CHOICE",
            options: [
              "Left",
              "Backward",
              "Same direction",
              "Opposite direction",
            ],
            correctAnswer: "Backward",
            position: 26,
          },
          {
            question: "Which is an example of an algorithm?",
            type: "MULTIPLE_CHOICE",
            options: [
              "A picture",
              "Step-by-step instructions",
              "A variable",
              "A sensor",
            ],
            correctAnswer: "Step-by-step instructions",
            position: 27,
          },
          {
            question: "What is a sensor used for in a robot?",
            type: "MULTIPLE_CHOICE",
            options: [
              "To move the robot",
              "To detect environment",
              "To store data",
              "To charge battery",
            ],
            correctAnswer: "To detect environment",
            position: 28,
          },
          {
            question: "Which of the following is an output device?",
            type: "MULTIPLE_CHOICE",
            options: ["Temperature sensor", "Motor", "Button", "Light sensor"],
            correctAnswer: "Motor",
            position: 29,
          },
          {
            question: "What does a microcontroller do?",
            type: "MULTIPLE_CHOICE",
            options: [
              "Powers the robot",
              "Controls and processes instructions",
              "Moves the robot",
              "Detects light",
            ],
            correctAnswer: "Controls and processes instructions",
            position: 30,
          },
        ],
      },
    },
  });

  console.log(`✅ Created placement test: ${test.id}`);
  console.log(`📝 Added 30 questions to the test`);
  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
