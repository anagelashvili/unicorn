# How AI Sees You - Project Explanation

## 1. Short Project Description

**How AI Sees You** is an interactive web application that helps users understand how computer vision works. It shows how a camera frame or demo image becomes pixels, RGB values, a matrix, edge/contour signals, a feature vector, and finally an explanation that connects the process to AI model logic.

In simple words: the project makes the hidden process of AI vision visible.

## 2. Problem

Many people hear about AI and computer vision, but they do not understand what happens inside the system. Most AI demos only show the final result, such as a prediction or label. They do not show the steps behind that result.

This creates a learning problem:

- AI feels like a black box.
- Students cannot easily connect images to numbers.
- Concepts like pixels, matrices, vectors, and embeddings feel too abstract.
- Tutorials are often passive, so users read or watch instead of interacting.

## 3. Solution

The solution is a live visual learning tool. The user can open the web app, use a camera or demo frame, and see how visual information is transformed step by step.

The app explains the process through five learning layers:

1. **Pixels** - the image starts as individual color values.
2. **Matrix** - the frame becomes a structured grid of RGB numbers.
3. **Edges** - the app detects changes between neighboring pixels.
4. **Vector** - visual features are compressed into a numeric feature vector.
5. **Model** - the vector is connected to how an AI model would make predictions or explanations.

## 4. Target Users

The main target users are:

- AI beginners
- Students learning computer vision
- Teachers explaining AI concepts
- People interested in how AI sees images
- Bootcamp or course participants who need a visual AI demo

## 5. Product Features

### Live Camera / Demo Mode

The user can start the camera or use a built-in demo frame. The demo mode is useful if camera permission is blocked during presentation.

### Step-by-Step Lesson Rail

The top lesson buttons guide the user through the pipeline:

Pixels -> Matrix -> Edges -> Vector -> Model

### Real-Time Visual Overlay

The app draws contour numbers, vector direction marks, and scanning effects over the frame. This makes the analysis feel live and interactive.

### Click-to-Inspect Pixel

The user can click any part of the frame. The app shows:

- pixel position
- RGB values
- brightness
- edge score
- explanation of what the score means

### Technical Readout

The optional technical drawer shows:

- tensor shape
- pixel matrix sample
- RGB averages
- contour signal
- feature vector bars
- vector code sketch

### AI Vision Tutor Agent

The project includes a tutor agent that explains concepts like matrix, RGB, edges, vectors, embeddings, and model logic.

### Generate Learning Summary

The app can generate a frame-specific learning summary based on the current frame statistics.

## 6. AI Agent Explanation

The AI agent is called **Vision Tutor Agent**.

Its goal is to help the user understand what the app is showing.

### Input

The agent receives:

- a user question, such as "Explain the vector"
- current frame analysis data, such as RGB averages, edge score, and vector values

### Process

The app analyzes the current frame and calculates:

- image resolution
- RGB averages
- brightness
- edge strength
- contour ratio
- 24-value teaching vector

Then the tutor matches the user's question to the correct concept and creates a simple explanation.

### Output

The agent returns:

- beginner-friendly explanation
- frame-specific summary
- formula or mathematical sketch
- link between visual data and AI model logic

## 7. Workflow

```text
User opens app
      |
      v
Camera frame or demo frame is loaded
      |
      v
Frame is sampled as pixels and RGB values
      |
      v
Neighboring pixels are compared to detect edges
      |
      v
Features are compressed into a vector
      |
      v
Vision Tutor Agent explains the concept
      |
      v
User receives a clear learning summary
```

## 8. Technical Explanation

The project is built as a static web app using:

- HTML
- CSS
- JavaScript
- Canvas API
- Browser Camera API

The camera frame is drawn into a canvas. JavaScript reads the pixel data and calculates visual statistics. The app then draws overlays and updates the explanation panels in real time.

The main technical logic is:

```text
frame = camera image
pixel = [R, G, B]
brightness = (R + G + B) / 3
edge = difference between neighboring pixel brightness values
vector = compressed feature representation of the frame
```

## 9. Why This Product Has Value

The app turns an abstract AI concept into an interactive experience. Instead of only reading about computer vision, users can see the process happening live.

The value is educational:

- It reduces fear of AI complexity.
- It makes technical ideas visual.
- It helps students understand the foundation of image models.
- It can be used in classrooms, workshops, and self-study.

## 10. Competitive Advantage

Compared to normal tutorials:

- YouTube videos are passive.
- Textbooks are abstract.
- Many AI demos only show final predictions.

**How AI Sees You** is different because it shows the hidden pipeline interactively.

## 11. Business Potential

This product can grow into an EdTech tool.

Possible future uses:

- AI course demo tool
- classroom activity
- premium computer vision lessons
- interactive ML learning platform
- teacher dashboard
- student progress reports

## 12. Future Improvements

Possible next steps:

- connect a real OpenAI-powered tutor
- add object detection labels
- add downloadable learning reports
- add Georgian language support
- add more lessons about CNNs and embeddings
- add classroom mode for teachers
- save user learning history

## 13. Demo Script

Use this order during the presentation:

1. Open the live website.
2. Explain that the problem is AI being a black box.
3. Click **Demo** or **Camera**.
4. Show the lesson buttons: Pixels, Matrix, Edges, Vector, Model.
5. Click a contour in the frame.
6. Explain the RGB and edge score.
7. Open the AI Tutor Chat.
8. Ask: `Explain the vector`.
9. Click **Generate Learning Summary**.
10. Finish by saying the app helps users understand how AI vision works.

## 14. 5-Minute Presentation Script

### Opening

Hello, my project is called **How AI Sees You**. It is an interactive computer vision learning tool.

The problem I wanted to solve is that AI often feels like a black box. People see the final result of an AI model, but they do not understand what happens between the camera image and the model output.

### Problem

For beginners, concepts like pixels, matrices, edges, vectors, and embeddings are difficult to understand because they are usually explained only with text or formulas.

### Solution

My solution is a web app that makes this process visible. The user can start the camera or use a demo frame, and the app shows how the frame becomes pixel data, edge signals, and a feature vector.

### Demo

Here you can see the live frame. The numbers on top of the image show edge and contour signals. If I click on the image, the app shows the RGB values, brightness, and edge score of that pixel.

The lesson buttons explain the process step by step: pixels, matrix, edges, vector, and model.

### AI Agent

The project also includes an AI Tutor Agent called **Vision Tutor Agent**. Its input is the user's question and the current frame data. It processes the concept and returns a simple explanation or learning summary.

For example, I can ask it to explain the vector, and it explains how the image data becomes a numeric representation.

### Closing

The value of the product is that it makes computer vision easier to understand. It can be used by students, teachers, and AI beginners. In the future, I would add a real LLM tutor, object detection, saved reports, and Georgian language support.

## 15. Possible Questions and Answers

### What problem does your project solve?

It solves the problem of AI being difficult to understand. It makes the hidden computer vision process visible and interactive.

### Who is the target user?

The target users are AI beginners, students, teachers, and anyone who wants to understand how image-based AI works.

### What is the AI agent?

The AI agent is the Vision Tutor Agent. It explains what is happening in the current frame and answers questions about pixels, matrices, edges, vectors, and model logic.

### What is the input, process, and output?

Input: user question and frame data.  
Process: frame analysis, concept matching, and explanation generation.  
Output: simple explanation, formula, and learning summary.

### Why is this better than a normal tutorial?

Because the user can interact with the image and see the AI vision pipeline live instead of only reading or watching.

### What technologies did you use?

HTML, CSS, JavaScript, Canvas API, and Browser Camera API.

### What would you improve next?

I would add a real LLM-based tutor, object detection, saved reports, more lessons, and Georgian language support.
