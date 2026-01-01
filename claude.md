# Shot Match Tool

## Project Overview

Shot Match is a web-based tool that analyzes reference images from films, photographs, or screenshots and provides users with actionable recreation guides. It leverages computer vision and machine learning to deconstruct technical and artistic elements of any image.

## Target Users

- Cinematographers & DPs - Pre-production reference matching
- Photographers - Learning and recreation
- YouTubers/Content creators - Achieving "film look"
- Film students - Understanding craft
- Colorists - Starting point for grades

## Core User Flow

1. **Upload**: User provides a reference image (film still, photograph, screenshot)
2. **Analyze**: AI deconstructs technical and artistic elements
3. **Deliver**: User receives actionable recreation guide

## Analysis Capabilities

### Camera & Lens Technical Properties
- Focal length estimate (perspective distortion, field of view)
- Aperture estimate (depth of field, bokeh characteristics)
- Shutter speed hints (motion blur analysis)
- ISO/noise profile (grain pattern analysis)

### Lighting Analysis
- Key light direction (shadow analysis, highlight placement)
- Light quality (hard vs soft - shadow edge transition)
- Lighting ratio (contrast between lit and shadow areas)
- Color temperature (warm/cool, mixed lighting detection)
- Lighting patterns (Rembrandt, butterfly, split, loop)

### Color & Grade Analysis
- Overall color palette extraction
- Lift/gamma/gain estimates for shadow, midtone, highlight
- Contrast curve shape
- Saturation mapping
- LUT approximation (downloadable LUT files)

### Composition Analysis
- Rule of thirds / golden ratio overlay
- Leading lines detection
- Subject placement and framing
- Aspect ratio identification

## Tech Stack

### Frontend
- **React** - Interactive result visualization
- **TailwindCSS** - Rapid UI development
- **Canvas/WebGL** - Overlays, lighting diagrams

### Backend
- **Python (FastAPI)** - Image processing pipeline
- **OpenCV** - Fundamental image analysis
- **Pillow** - Image manipulation
- **NumPy** - Numerical computations

## Project Structure

```
shottool/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/
│   └── public/
├── backend/           # FastAPI server
│   ├── app/
│   │   ├── api/
│   │   ├── services/
│   │   └── models/
│   └── requirements.txt
└── claude.md
```

## MVP Features (v1.0)

- [x] Image upload + basic processing pipeline
- [x] Focal length estimation
- [x] Lighting direction analysis
- [x] Color palette extraction
- [x] Simple results page with visual diagrams

## Development Commands

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## API Endpoints

- `POST /api/analyze` - Upload and analyze an image
- `GET /api/analysis/{id}` - Get analysis results
- `GET /api/health` - Health check

## Key Technical Approaches

1. **Focal Length Estimation**: Analyze perspective distortion patterns
2. **Lighting Detection**: Shadow mapping + highlight analysis
3. **Color Analysis**: Extract dominant colors and generate LUT approximations
4. **Accuracy**: Provide ranges, not false precision (e.g., "f/2 - f/2.8")
