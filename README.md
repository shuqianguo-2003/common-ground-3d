# Common Ground — Interactive 3D Space Model

A browser-based Three.js concept model for a senior-led community shop, café, learning hub and gathering place.

## Live site

[common-ground-community-3d.sguo0060.chatgpt.site](https://common-ground-community-3d.sguo0060.chatgpt.site)

## Highlights

- Interactive 360° spatial model
- Ten selectable community zones
- Overview and human-height camera views
- Cutaway and full-height wall modes
- Complete Chinese and English interface
- Bundled dependencies for offline-friendly static hosting

## Tech stack

- HTML, CSS and JavaScript
- Three.js
- OrbitControls

## Run locally

Serve the `dist` directory with any static web server. For example:

```sh
python3 -m http.server 4173 --directory dist
```

Then open `http://localhost:4173`.

## Interaction

- Drag to orbit 360° around the space.
- Use the mouse wheel or pinch to zoom.
- Right-drag or two-finger drag to pan.
- Use the view buttons for overview and human-height views.
- Toggle between cutaway and full-height wall views.
- Switch the complete interface between Chinese and English.
- Select any of the ten zone labels to focus the camera and read its description.

Three.js and OrbitControls are bundled in `dist/vendor`, so the 3D model does not depend on a CDN.

## Note

This repository contains the original editable project files used for the published experience, not a downloaded copy of the rendered website.
