import * as THREE from 'three';

/**
 * Convert latitude/longitude to 3D position on a sphere
 * @param lat Latitude in degrees (-90 to 90)
 * @param lon Longitude in degrees (-180 to 180)
 * @param radius Sphere radius
 * @returns THREE.Vector3 position on the sphere surface
 */
export function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
    // Convert to radians
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    // Spherical to Cartesian coordinates
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
}

/**
 * Calculate the angle between a vector and the camera's forward direction
 * Used for determining which POI is closest to screen center
 */
export function calculateAngleToCamera(
    position: THREE.Vector3,
    camera: THREE.Camera
): number {
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    const toPOI = position.clone().normalize();
    const angle = cameraDirection.angleTo(toPOI);

    return angle;
}
