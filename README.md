# Seismic3D Usage Guide

This JavaScript project demonstrates how to use OpenGL based WebGL library Three.JS to visualize 3D seismic data (one cube, one in-line slice, one cross-line slice and one z-plane slice) on the web. To test it, open ./Seismic3D/index.html from the browser. Please note that WebGL has stronger restrictions for loading images which means you need to install a web server in order to see images from this project. For more details, see 

   https://webglfundamentals.org/webgl/lessons/webgl-setup-and-installation.html

Fortunately, I can see all images when using Microsoft's Edge on a Windows 10 machine.

The project supports the followings features:

1. Animation

Seismic objects are animated (rotation for all objects and bouncing for seismic in-line slice) by default when the web page is loaded. To stop animation, simply click any area in the canvas. To re-start animation, click the canvas again. 

2. Hit-Test

When a seismic object is hit by the mouse, the corresponding image is displayed in lower-right corner area. If no object is hit, that area becomes 'White'. 

3. Rotation

To manually rotate scene, hold the left mouse button and move the mouse up/down/left/right.

4. Zoom In/Out

To manually zooming in or zooming out, move the middle mouse button (mouse wheel).

5. Movement

To manually move scene, hold the right mouse button and move the mouse up/down/left/right.
