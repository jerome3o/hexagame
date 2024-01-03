import * as THREE from "three";
import * as CANNON from "cannon-es";

function copyBodyToMesh(body: CANNON.Body, mesh: THREE.Mesh) {
  //   mesh.position.copy(body.position);
  mesh.position.y = body.position.y;
  mesh.position.x = body.position.x;
  mesh.position.z = body.position.z;

  // mesh.quaternion.copy(body.quaternion);
  mesh.quaternion.x = body.quaternion.x;
  mesh.quaternion.y = body.quaternion.y;
  mesh.quaternion.z = body.quaternion.z;
  mesh.quaternion.w = body.quaternion.w;
}

export { copyBodyToMesh };
