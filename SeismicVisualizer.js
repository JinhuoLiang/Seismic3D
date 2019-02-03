class SeismicSlice {
    // Constructor for seismic slice
    constructor(name, width, height, imageFilePath) {
        // Load the image and set to material texture 
        var loader = new THREE.TextureLoader();
        var texture = loader.load(imageFilePath);
        var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });

        // Create geometry mesh 
        var square = new THREE.PlaneGeometry(width, height);
        this.mesh = new THREE.Mesh(square, material);
        this.mesh.name = name;
    }

    // Add seismic slice to scene
    addToScene(scene, x, y, z, rx, ry, rz) {
        // Perform transform
        this.mesh.rotation.set(rx, ry, rz);
        this.mesh.position.set(x, y, z);

        // Add to the scene
        scene.add(this.mesh);
    }
}

class SeismicCube {
    // Constructor for seismic cube
    constructor(width, height, length, imageFiles) {
        // Load the image and set to material texture 
        var loader = new THREE.TextureLoader();

        var nFiles = imageFiles.length;
        var nSides = 6; // 6 sides of seismic cube
        var textures = [];
        var texture;

        for (var i = 0; i < nSides; i++) {
            if (i < nFiles)
                texture = loader.load(imageFiles[i]);

            textures[i] = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        }

        var material = new THREE.MeshFaceMaterial(textures);

        // Create geometry mesh 
        var geometry = new THREE.BoxGeometry(width, height, length);
        this.mesh = new THREE.Mesh(geometry, material);
    }

    // Add seismic slice to scene
    addToScene(scene, x, y, z, rx, ry, rz) {
        // Perform transform
        this.mesh.rotation.set(rx, ry, rz);
        this.mesh.position.set(x, y, z);

        // Add to the scene
        scene.add(this.mesh);
    }
}

class SeismicVisualizer {
    // SeisicView constructor
    constructor() {
    }

    // Initialize camera, renderer, scene, etc.
    init() {
        // Expand the canvas to the whole area of its parent.
        this.canvas = document.getElementById("canvasID");
        this.container = document.getElementById("canvasContainerID");
        var width = this.container.clientWidth;
        var height = this.container.clientHeight;
        this.canvas.width = width;
        this.canvas.height = height;

        // Create renderer with canvas pre-set in index.html.
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setSize(width, height);
        //this.renderer.setClearColor(0xffffff);

        // Create a camera
        this.camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 100);
        this.camera.position.set(0, 3, 6);

        // Add OrbitControls to support interactive view
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        // Create scene.
        this.scene = new THREE.Scene();

        // Create a raycaster to 
        this.raycaster = new THREE.Raycaster();

        // Add event handler for window resizing
        window.addEventListener('resize', this.sizeChanged.bind(this));
        this.canvas.addEventListener('click', this.mouseClicked.bind(this));

        // Set dimension of seismic cube
        this.cubeWidth = 2;
        this.cubeHeight = 2;
        this.cubeLength = 2;

        this.ZZZ = 0;
        this.delta = 0.01;
    }

    // Load seismic cube images
    loadSeismicCube() {
        // Set coordinate of the seismic cube (center)
        var cubeX = -this.cubeWidth;
        var cubeY = 0;
        var cubeZ = 0;

        var imageFiles =
            ['./Images/CrossLine.png', // Right Side
                './Images/CrossLine.png', // Left Side
                './Images/Top.png',       // Top Side
                './Images/Top.png',       // Bottom Side
                './Images/Front.png',     // Front Side
                './Images/InLine.png'];   // Back Side

        this.cube = new SeismicCube(this.cubeWidth, this.cubeHeight, this.cubeLength, imageFiles);
        this.cube.addToScene(this.scene, cubeX, cubeY, cubeZ, 0.0, 0.0, 0.0);
    }

    // Load seismic slices: in-line, cross-line andz-plane images
    loadSeismicSlices() {
        // Set coordinate of the seismic cube center
        var cubeX = this.cubeWidth;
        var cubeY = 0;
        var cubeZ = 0;

        // Draw In-Line
        this.inline = new SeismicSlice("inline", this.cubeWidth, this.cubeHeight, './Images/InLine.png');
        this.inline.addToScene(this.scene, cubeX, cubeY, cubeZ, 0.0, 0.0, 0.0);

        // Draw Cross-Line
        this.crossline = new SeismicSlice("crossline", this.cubeLength, this.cubeHeight, './Images/CrossLine.png');
        this.crossline.addToScene(this.scene, cubeX, cubeY, cubeZ, 0.0, 0.5 * Math.PI, 0.0);

        // Draw Z-plane
        this.zplane = new SeismicSlice("zplane", this.cubeWidth, this.cubeLength, './Images/ZPlane.png');
        this.zplane.addToScene(this.scene, cubeX, cubeY, cubeZ, 0.5 * Math.PI, 0.0, 0.0);
    }

    addLine(scene, material, p1, p2) {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(p1);
        geometry.vertices.push(p2);
        var line = new THREE.Line(geometry, material);
        scene.add(line);
    }

    // Add event handler for window resizing
    sizeChanged() {
        var width = this.container.clientWidth;
        var height = this.container.clientHeight;
        this.canvas.width = width;
        this.canvas.height = height;
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    // If a seismic slice is clicked, display it in the lower-right corner canvas.
    // Otherwise, stop or continue slice animation.
    mouseClicked(event) {
        var mouse = new THREE.Vector2();
        mouse.x = (event.offsetX / this.canvas.width) * 2 - 1;
        mouse.y = - (event.offsetY / this.canvas.height) * 2 + 1;
        this.raycaster.setFromCamera(mouse, this.camera);
        var intersects = this.raycaster.intersectObjects(this.scene.children);

        if (intersects.length > 0) {
            var selectedObj = intersects[0].object;

            // Display an image for the selected object
            if (selectedObj == this.inline.mesh) {
                document.getElementById("canvasContainer2ID").style.backgroundImage = 'url("./Images/InLine.png")';
            }
            else if (selectedObj == this.crossline.mesh) {
                document.getElementById("canvasContainer2ID").style.backgroundImage = 'url("./Images/CrossLine.png")';
            }
            else if (selectedObj == this.zplane.mesh) {
                document.getElementById("canvasContainer2ID").style.backgroundImage = 'url("./Images/ZPlane.png")';
            }
            else {
                document.getElementById("canvasContainer2ID").style.backgroundImage = 'url("./Images/Cube.png")';
            }
       }
        else {
            document.getElementById("canvasContainer2ID").style.backgroundImage = '';
        }

        //  Stop/continue seismic slice (in-line) animation
        if (this.delta != 0.0)
            this.delta = 0.0;
        else
            this.delta = 0.01;
    }

    // Render the screen.
    render() {
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    // Set 3D object animation
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.scene.rotation.y += Math.abs(this.delta) * 0.5;

        // Animate one slice
        if (this.ZZZ > this.cubeLength * 0.5)
            this.delta = -0.01;
        else if (this.ZZZ < -this.cubeLength * 0.5)
            this.delta = 0.01;

        this.ZZZ += this.delta;
        this.scene.remove(this.inline);
        this.inline.addToScene(this.scene, this.cubeWidth, 0, this.ZZZ, 0.0, 0.0, 0.0);

        this.renderer.render(this.scene, this.camera);
    }

    // Clear the screen.
    clearScene() {
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
    }
}

var seismic = new SeismicVisualizer();
seismic.init();
seismic.loadSeismicCube();
seismic.loadSeismicSlices();
seismic.animate();