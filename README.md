# How AI Sees You

How AI Sees You is a friendly interactive computer vision learning app. It helps beginners enjoy the process of understanding AI by turning a camera frame into colors, patterns, matrix data, edge signals, feature vectors, and a simple tutor explanation.

## Problem

Computer vision is difficult to understand because most tools only show the final prediction. Students rarely see the hidden steps between a camera image and an AI model output, so AI can feel intimidating or mysterious.

## Solution

This app makes the process visible and approachable. Users can start their camera or use a demo frame, inspect pixel data, see edge/contour signals, explore a matrix sample, and ask the built-in AI Vision Tutor for beginner-friendly explanations.

## Core Features

- Live camera mode and animated demo mode
- Pixel, matrix, edge, vector, and model lesson steps
- Click-to-inspect pixel values and edge score
- Technical readout for RGB averages, tensor shape, contour signal, and feature vector
- AI Vision Tutor chat for explanations about matrix, RGB, edges, vectors, embeddings, and model logic
- Learning summary generator based on the current frame analysis

## AI Agent

The product includes an AI Tutor Agent concept called **Vision Tutor Agent**.

### Input

- Current camera/demo frame
- User question about pixels, matrices, RGB, edges, vectors, or model logic

### Process

- Samples and analyzes the current frame
- Calculates RGB averages, edge strength, contour ratio, and a teaching feature vector
- Matches the user's question to the relevant computer vision concept

### Output

- Simple explanation of the selected concept
- Frame-specific learning summary
- Formula or technical sketch that connects the visual demo to AI model logic

## Tech Stack

- HTML
- CSS
- JavaScript
- Browser camera API
- Canvas API

## Running Locally

Open `index.html` in a browser, or serve the folder with any static file server.

For camera access, use a local server such as:

```bash
npx serve .
```

Then open the local URL shown in the terminal.

## Deployment

This is a static web app and can be deployed to:

- Vercel
- Netlify
- GitHub Pages

## Pitch Summary

**How AI Sees You** is an EdTech tool for AI beginners, students, and teachers. It turns abstract computer vision concepts into an interactive visual experience, helping users understand what happens between a camera frame and an AI model's prediction.
