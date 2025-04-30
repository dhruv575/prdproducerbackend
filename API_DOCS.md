# PRD Producer API Documentation

This document outlines all the endpoints provided by the PRD Producer API.

## Base URL

```
http://localhost:3001/api/prd
```

## Authentication

No authentication is required for local development.

## API Endpoints

### 1. Kickoff & Presets (Step 1)

Generates an initial overview based on the user's business challenge description or a preset idea.

**Endpoint:** `/kickoff`  
**Method:** `POST`  
**Content-Type:** `application/json`

**Request Body:**

```json
{
  "description": "String describing the business challenge (optional if usePreset is true)",
  "usePreset": true/false,
  "presetChoice": "One of the preset ideas (required if usePreset is true)"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "markdown": "## Overview\n\n[Generated overview text]"
  }
}
```

### 2. Overview & Key Features (Step 2)

Adds a Key Features section to the existing PRD markdown.

**Endpoint:** `/overview`  
**Method:** `POST`  
**Content-Type:** `application/json`

**Request Body:**

```json
{
  "currentMarkdown": "Current PRD markdown content",
  "features": [
    {
      "title": "Feature title",
      "description": "Feature description"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "markdown": "[Updated markdown content with Key Features section]"
  }
}
```

### 3. Data Models (Step 3)

Adds a Data Models section to the existing PRD markdown.

**Endpoint:** `/data-models`  
**Method:** `POST`  
**Content-Type:** `application/json`

**Request Body:**

```json
{
  "currentMarkdown": "Current PRD markdown content",
  "entities": [
    {
      "name": "Entity name",
      "purpose": "Entity purpose"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "markdown": "[Updated markdown content with Data Models section]"
  }
}
```

### 4. Core Workflows (Step 4)

Adds a Workflows section to the existing PRD markdown.

**Endpoint:** `/workflows`  
**Method:** `POST`  
**Content-Type:** `application/json`

**Request Body:**

```json
{
  "currentMarkdown": "Current PRD markdown content",
  "workflows": [
    {
      "title": "Workflow title",
      "steps": "Workflow steps"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "markdown": "[Updated markdown content with Workflows section]"
  }
}
```

### 5. UI Styling & Inspiration (Step 5)

Adds a UI & Styling section to the existing PRD markdown.

**Endpoint:** `/ui-styling`  
**Method:** `POST`  
**Content-Type:** `application/json`

**Request Body:**

```json
{
  "currentMarkdown": "Current PRD markdown content",
  "inspiration": "Description of UI style inspiration"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "markdown": "[Updated markdown content with UI & Styling section]"
  }
}
```

### 6. Backend Implementation Plan (Step 6)

Adds a Backend Plan section to the existing PRD markdown.

**Endpoint:** `/backend-plan`  
**Method:** `POST`  
**Content-Type:** `application/json`

**Request Body:**

```json
{
  "currentMarkdown": "Current PRD markdown content"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "markdown": "[Updated markdown content with Backend Plan section]"
  }
}
```

### 7. Frontend Implementation Plan (Step 7)

Adds a Frontend Plan section to the existing PRD markdown.

**Endpoint:** `/frontend-plan`  
**Method:** `POST`  
**Content-Type:** `application/json`

**Request Body:**

```json
{
  "currentMarkdown": "Current PRD markdown content"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "markdown": "[Updated markdown content with Frontend Plan section]"
  }
}
```

### 8. Finalization & Download (Step 8)

Finalizes the PRD and marks it as ready for download.

**Endpoint:** `/finalize`  
**Method:** `POST`  
**Content-Type:** `application/json`

**Request Body:**

```json
{
  "currentMarkdown": "Current PRD markdown content"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "markdown": "[Final markdown content]",
    "downloadReady": true
  }
}
```

## Error Responses

All endpoints return the following format in case of an error:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

Common error status codes:
- `400`: Bad Request - Invalid input parameters
- `500`: Server Error - Error processing the request or contacting OpenAI API 