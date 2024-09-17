import { GoogleGenerativeAI } from "@google/generative-ai";
import MarkdownIt from "markdown-it";
import "./src/output.css";

let API_KEY = "AIzaSyCEHW-T2CA3B8WTjKmQFFOAVZvYzHZX6-M";

let form = document.querySelector("form");
let promptInput = document.querySelector('input[name="prompt"]');
let output = document.querySelector(".output");
let input = document.querySelector(".input");
let image = document.querySelector(".image");

form.onsubmit = async (ev) => {
  ev.preventDefault();
  image.classList.add("hidden");
  output.textContent = "Generating...";
  output.classList.remove("hidden");
  input.textContent = promptInput.value;
  input.classList.remove("hidden");

  try {
    // Assemble the prompt by combining the text with the chosen image
    let contents = [
      {
        role: "user",
        parts: [{ text: promptInput.value }],
      },
    ];

    promptInput.value = "";

    // Call the multimodal model, and get a stream of results
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro", // or gemini-1.5-pro
    });

    const result = await model.generateContentStream({ contents });

    // Read from the stream and interpret the output as markdown
    let buffer = [];
    let md = new MarkdownIt();
    for await (let response of result.stream) {
      buffer.push(response.text());
      output.innerHTML = md.render(buffer.join(""));
    }
  } catch (e) {
    output.innerHTML += "<hr>" + e;
  }
};
