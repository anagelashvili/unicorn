# AI Vision Tutor Agent

## Purpose

The AI Vision Tutor Agent helps users understand how a computer vision system reads an image. It translates frame data into beginner-friendly explanations.

## Input

- Camera frame or demo frame from the web app
- User question about pixels, RGB values, matrices, edges, feature vectors, embeddings, or model logic

Example prompts:

- Explain the matrix
- What are the edge numbers?
- Explain the vector
- Explain this frame mathematically

## Process

1. The app samples the current frame through the Canvas API.
2. It calculates RGB averages, pixel brightness, local edge strength, contour ratio, and a 24-value teaching vector.
3. The tutor matches the user's question to the relevant computer vision concept.
4. It combines the current frame statistics with a simple explanation and formula.

## Output

- A simple explanation of the selected concept
- A frame-specific learning summary
- A short formula or technical sketch
- A clearer understanding of the computer vision pipeline

## Workflow

```text
User frame or question
        ↓
Pixel + RGB sampling
        ↓
Edge and contour analysis
        ↓
Teaching vector generation
        ↓
AI Tutor explanation
        ↓
Learning summary
```

## Demo Script

1. Open the live web app.
2. Click **Demo** if camera access is not available.
3. Click a visible contour in the frame.
4. Open **Ask for a deeper explanation**.
5. Ask: `Explain the vector`.
6. Click **Generate Learning Summary**.

This demonstrates the full Input → Process → Output logic required for the final project.
