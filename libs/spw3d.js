/* global requestAnimationFrame */
/* global THREE */
/* global Stats */

var container, stats;

var camera, scene, renderer;
var group;

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
//var windowHalfY = window.innerHeight / 2;

init();
animate();

function init () {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( 0, -50, 750 );
    camera.lookAt( new THREE.Vector3( 0, -50, 0 ));

    window.camera = camera;

    scene = new THREE.Scene();
    scene.add( new THREE.AmbientLight( 0x808080 ) );

    var light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 1, 100, 100 );
    scene.add( light );

    group = new THREE.Group();
    group.position.y = 50;
    scene.add( group );

    // load geoemtry

    var loader = new THREE.JSONLoader();

    var loadGeometry = function ( url, color, scale ) {

        loader.load( url, function ( geometry, materials ) {

            var material;

            if ( materials && materials.length ) {

                console.debug( 'materials', materials );

                material = materials[ 0 ];

            } else {

                material = new THREE.MeshLambertMaterial( { color: color, shading: THREE.SmoothShading } ); //THREE.FlatShading } );

            }

            var object = new THREE.Mesh( geometry, material );

            object.rotateX( 0.5 * Math.PI );

            object.scale.x = scale;
            object.scale.y = scale;
            object.scale.z = scale;

            object.position.x = scale / -2;

            group.add( object );

        });

    };

    var color = 0x2194CE;
    var scale = 1000;

    loadGeometry( 'spw-s.json', color, scale );
    loadGeometry( 'spw-p.json', color, scale );
    loadGeometry( 'spw-e.json', color, scale );
    loadGeometry( 'spw-a.json', color, scale );
    loadGeometry( 'spw-r.json', color, scale );
    loadGeometry( 'spw-w.json', color, scale );
    loadGeometry( 'spw-o.json', color, scale );
    loadGeometry( 'spw-l.json', color, scale );
    loadGeometry( 'spw-f.json', color, scale );

    //

    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    renderer.setClearColor( 0x000000, 0 );  // 0xE0E0E0 );  //0xB0D0F0 ); //0xf0f0f0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize () {

    windowHalfX = window.innerWidth / 2;
    //windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function onDocumentMouseDown ( event ) {

    event.preventDefault();

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    document.addEventListener( 'mouseout', onDocumentMouseOut, false );

    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationOnMouseDown = targetRotation;

}

function onDocumentMouseMove ( event ) {

    mouseX = event.clientX - windowHalfX;

    targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;

}

function onDocumentMouseUp ( /* event */ ) {

    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

}

function onDocumentMouseOut ( /* event */ ) {

    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

}

function onDocumentTouchStart ( event ) {

    if ( event.touches.length == 1 ) {

        event.preventDefault();

        mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
        targetRotationOnMouseDown = targetRotation;

    }

}

function onDocumentTouchMove ( event ) {

    if ( event.touches.length == 1 ) {

        event.preventDefault();

        mouseX = event.touches[ 0 ].pageX - windowHalfX;
        targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;

    }

}

//

function animate () {

    requestAnimationFrame( animate );

    render();
    stats.update();

}

function render () {

    group.rotation.y += ( targetRotation - group.rotation.y ) * 0.05;
    renderer.render( scene, camera );

}

