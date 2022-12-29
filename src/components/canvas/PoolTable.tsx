/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.0.9 D:/udemy/playpool/public/untitled.glb -t
"Pool Table" () by Pieter Ferreira is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
*/

import React from "react";

import { Center, useGLTF } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import type * as THREE from "three";
import type { GLTF } from "three-stdlib";

import { PHYSIC_CONSTANTS } from "@/constants/physic";

type GLTFResult = GLTF & {
  nodes: {
    Object_2: THREE.Mesh;
    Object_2001: THREE.Mesh;
    Object_2002: THREE.Mesh;
    Object_2003: THREE.Mesh;
  };
  materials: {
    None: THREE.MeshStandardMaterial;
  };
};

export default function Model(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/pool_table.glb"
  ) as unknown as GLTFResult;

  return (
    <>
      <Center position-y={-0.5} {...props}>
        <RigidBody
          type="fixed"
          colliders="trimesh"
          friction={PHYSIC_CONSTANTS.TABLE_FRICTION}
          restitution={PHYSIC_CONSTANTS.TABLE_RESTITUTION}
        >
          <group
            rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
            dispose={null}
            scale={1.11}
          >
            <mesh
              geometry={nodes.Object_2.geometry}
              material={materials.None}
            />
          </group>
        </RigidBody>
      </Center>
      {/* <mesh
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        dispose={null}
        scale={1.11}
        position-y={-1}
        geometry={nodes.Object_2001.geometry}
        material={materials.None}
      /> */}
      <CuboidCollider args={[0.75, 0.1, 1.2]} position={[0, -0.15, 0]} sensor />
    </>
  );
}

useGLTF.preload("/pool_table.glb");
