import { GoogleGenerativeAI } from "@google/generative-ai";
import MarkdownIt from "markdown-it";
import "./src/output.css";

let API_KEY = "AIzaSyCEHW-T2CA3B8WTjKmQFFOAVZvYzHZX6-M";

let form = document.querySelector("form");
let promptInput = document.querySelector('input[name="prompt"]');
// let output = document.querySelector(".output");
// let input = document.querySelector(".input");
let image = document.querySelector(".image");
// let outputdiv = document.querySelector(".outputdiv");
// let inputdiv = document.querySelector(".inputdiv");
let wrap = document.querySelector(".wrap");

form.onsubmit = async (ev) => {
  ev.preventDefault();
  image.classList.add("hidden");

  // Tampilkan input pengguna di chat
  wrap.innerHTML += `
    <div class="inputdiv gap-4 w-full justify-end flex">
      <div class="order-2 mt-5 rounded-full bg-[#1ABC9C] border border-[#ffffff7a] h-10 w-10 text-xl font-semibold flex items-center justify-center text-center select-none">
        A
      </div>
      <div class="order-1 input bg-[#2F2F2F] max-w-[650px] rounded-3xl p-4 my-3">${promptInput.value}</div>
    </div>`;

  // Simpan nilai input, kemudian kosongkan input field
  let userInput = promptInput.value;
  promptInput.value = "";

  try {
    let contents = [
      {
        role: "user",
        parts: [{ text: userInput }],
      },
    ];

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContentStream({ contents });

    let buffer = [];
    let md = new MarkdownIt();

    // Tampilkan respons dari AI
    for await (let response of result.stream) {
      buffer.push(response.text());

      wrap.innerHTML += `
        <div class="outputdiv w-full justify-start gap-4 flex">
          <img src="src/visualhunter-a1bf6d3746.png" alt="Gpt Logo" class="h-11 rounded-full border-[#ffffff52] border mt-5 select-none">
          <div class="output bg-[#2F2F2F] max-w-[650px] rounded-3xl p-4 my-3">${md.render(
            buffer.join("")
          )}</div>
        </div>`;
    }
  } catch (e) {
    wrap.innerHTML += `<div class="error">Error</div>`;
  }
};
