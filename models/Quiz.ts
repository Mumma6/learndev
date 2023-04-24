import { ObjectId } from "mongodb"

// Replace these with Zod

export interface IAnswer {
  text: string
  key: number
}

export interface IQuestion {
  text: string
  answers: IAnswer[]
  correctAnswer: number
}

export interface IQuiz {
  _id: ObjectId | string
  title: string
  difficulty: 1 | 2 | 3 // 1-3. Show stars on the frontend. 1 star = easy, 3 stars = hard
  description: string
  tags: string[] // t ex "javascript, functionell programming, front end."
  passingScore: number
  questions: IQuestion[]
  mainTopic: string
}

/*

 past this into any quiery

  const db = await getMongoDb()

  db.collection("quizzes").insertOne({
    title: "HTML Quiz",
    difficulty: 1,
    description: "Test your knowledge of HTML!",
    tags: ["html", "web development"],
    passingScore: 7,
    questions: [
      {
        text: "What does HTML stand for?",
        answers: [
          {
            text: "Hyper Text Markup Language",
            key: 1,
          },
          {
            text: "Hyperlinks and Text Markup Language",
            key: 2,
          },
          {
            text: "Home Tool Markup Language",
            key: 3,
          },
        ],
        correctAnswer: 1,
      },
      {
        text: "What is the correct HTML element for inserting a line break?",
        answers: [
          { text: "<lb>", key: 1 },
          { text: "<break>", key: 2 },
          { text: "<br>", key: 3 },
        ],
        correctAnswer: 3,
      },
      {
        text: "What is the correct HTML for creating a hyperlink?",
        answers: [
          {
            text: '<a href="http://www.example.com">Example</a>',
            key: 1,
          },
          {
            text: '<hyperlink url="http://www.example.com">Example</hyperlink>',
            key: 2,
          },
          {
            text: '<link url="http://www.example.com">Example</link>',
            key: 3,
          },
        ],
        correctAnswer: 1,
      },
      {
        text: "Which HTML attribute is used to define inline styles?",
        answers: [
          { text: "class", key: 1 },
          { text: "style", key: 2 },
          { text: "font", key: 3 },
        ],
        correctAnswer: 2,
      },
      {
        text: "What is the correct HTML for creating an unordered list?",
        answers: [
          {
            text: "<list>",
            key: 1,
          },
          {
            text: "<ul>",
            key: 2,
          },
          {
            text: "<ol>",
            key: 3,
          },
        ],
        correctAnswer: 2,
      },
      {
        text: "What does HTML stand for?",
        answers: [
          {
            text: "Hyper Text Markup Language",
            key: 1,
          },
          {
            text: "Hyperlinks and Text Markup Language",
            key: 2,
          },
          {
            text: "Home Tool Markup Language",
            key: 3,
          },
        ],
        correctAnswer: 1,
      },
      {
        text: "What is the correct HTML element for inserting a line break?",
        answers: [
          { text: "<lb>", key: 1 },
          { text: "<break>", key: 2 },
          { text: "<br>", key: 3 },
        ],
        correctAnswer: 3,
      },
      {
        text: "What is the correct HTML for creating a hyperlink?",
        answers: [
          {
            text: '<a href="http://www.example.com">Example</a>',
            key: 1,
          },
          {
            text: '<hyperlink url="http://www.example.com">Example</hyperlink>',
            key: 2,
          },
          {
            text: '<link url="http://www.example.com">Example</link>',
            key: 3,
          },
        ],
        correctAnswer: 1,
      },
      {
        text: "Which HTML attribute is used to define inline styles?",
        answers: [
          { text: "class", key: 1 },
          { text: "style", key: 2 },
          { text: "font", key: 3 },
        ],
        correctAnswer: 2,
      },
      {
        text: "What is the correct HTML for creating an unordered list?",
        answers: [
          {
            text: "<list>",
            key: 1,
          },
          {
            text: "<ul>",
            key: 2,
          },
          {
            text: "<ol>",
            key: 3,
          },
        ],
        correctAnswer: 2,
      },
    ],
  })



const a = {
  title: "CSS Quiz",
  difficulty: 1,
  description: "Test your knowledge of CSS!",
  tags: ["css", "web development"],
  passingScore: 7,
  questions: [
    {
      text: "What does CSS stand for?",
      answers: [
        {
          text: "Cascading Style Sheets",
          key: 1,
        },
        {
          text: "Cascading Style Scripts",
          key: 2,
        },
        {
          text: "Cascading Style Syntax",
          key: 3,
        },
      ],
      correctAnswer: 1,
    },
    {
      text: "What is the CSS property used for changing the text color?",
      answers: [
        { text: "font-color", key: 1 },
        { text: "text-color", key: 2 },
        { text: "color", key: 3 },
      ],
      correctAnswer: 3,
    },
    {
      text: "What is the CSS property used for changing the background color?",
      answers: [
        {
          text: "background-color",
          key: 1,
        },
        {
          text: "color-background",
          key: 2,
        },
        {
          text: "background",
          key: 3,
        },
      ],
      correctAnswer: 1,
    },
    {
      text: "Which CSS property is used for adding shadows to an element?",
      answers: [
        { text: "shadow", key: 1 },
        { text: "text-shadow", key: 2 },
        { text: "box-shadow", key: 3 },
      ],
      correctAnswer: 3,
    },
    {
      text: "What is the CSS property used for changing the font family?",
      answers: [
        {
          text: "font-family",
          key: 1,
        },
        {
          text: "font-style",
          key: 2,
        },
        {
          text: "font-type",
          key: 3,
        },
      ],
      correctAnswer: 1,
    },
    {
      text: "What is the CSS property used for changing the font size?",
      answers: [
        { text: "font-height", key: 1 },
        { text: "text-size", key: 2 },
        { text: "font-size", key: 3 },
      ],
      correctAnswer: 3,
    },
    {
      text: "What is the CSS property used for changing the border color?",
      answers: [
        {
          text: "border-color",
          key: 1,
        },
        {
          text: "color-border",
          key: 2,
        },
        {
          text: "border",
          key: 3,
        },
      ],
      correctAnswer: 1,
    },
  ],
}

*/
