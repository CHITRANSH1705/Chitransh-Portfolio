import {
  Shape,
  ExtrudeGeometry,
  PlaneGeometry,
  MeshStandardMaterial,
  MeshBasicMaterial,
  Mesh,
  Group,
} from "three";

import Experience from "./Experience.js";
import {
  FRAME_WIDTH,
  FRAME_HEIGHT,
  FRAME_DEPTH,
  FRAME_BORDER,
  FRAME_ROTATION_Y,
  LEFT_FRAME_POSITION,
  RIGHT_FRAME_POSITION,
} from "./constants.js";

// Two framed photos mounted above the whiteboard - your copyright
// certificate (left) and your research paper (right). They currently show
// static/assets/textures/copyright-certificate.jpg and research-paper.jpg -
// replace those two files (same filenames) to update the photos, no code
// changes needed. See the TODO above LEFT_FRAME_POSITION in constants.js
// for the Google Drive link option.
//
// These are display-only (not clickable links) - unlike the "linkedin"/
// "github" sticker icons elsewhere in the room, these two names aren't in
// ELEMENTS_TO_RAYCAST, so clicking them does nothing.
//
// Frame ring is built as a beveled extrusion (dark walnut wood look); the
// AmbientLight + DirectionalLight already present in the scene (see
// RubiksCube.js) light it so the bevel actually reads as a bevel.
export default class PhotoFrames {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.frameMaterial = new MeshStandardMaterial({
      color: 0x4a2f1c,
      roughness: 0.75,
      metalness: 0.05,
    });
    this.frameGeometry = this.buildFrameGeometry();

    this.copyrightFrame = this.buildFrame(
      "copyrightFrame",
      LEFT_FRAME_POSITION,
      this.resources.items.copyrightTexture
    );
    this.researchPaperFrame = this.buildFrame(
      "researchPaperFrame",
      RIGHT_FRAME_POSITION,
      this.resources.items.researchPaperTexture
    );

    this.scene.add(this.copyrightFrame);
    this.scene.add(this.researchPaperFrame);
  }

  buildFrameGeometry = () => {
    const halfW = FRAME_WIDTH / 2;
    const halfH = FRAME_HEIGHT / 2;
    const innerW = FRAME_WIDTH / 2 - FRAME_BORDER;
    const innerH = FRAME_HEIGHT / 2 - FRAME_BORDER;

    const outer = new Shape();
    outer.moveTo(-halfW, -halfH);
    outer.lineTo(halfW, -halfH);
    outer.lineTo(halfW, halfH);
    outer.lineTo(-halfW, halfH);
    outer.closePath();

    const hole = new Shape();
    hole.moveTo(-innerW, -innerH);
    hole.lineTo(innerW, -innerH);
    hole.lineTo(innerW, innerH);
    hole.lineTo(-innerW, innerH);
    hole.closePath();
    outer.holes.push(hole);

    const geometry = new ExtrudeGeometry(outer, {
      depth: FRAME_DEPTH,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.012,
      bevelSegments: 3,
      curveSegments: 1,
    });
    geometry.center();
    return geometry;
  };

  buildFrame = (name, position, texture) => {
    const group = new Group();
    group.name = name;
    group.position.copy(position);
    group.rotateY(FRAME_ROTATION_Y);

    // Beveled wood-look frame ring
    const body = new Mesh(this.frameGeometry, this.frameMaterial);
    body.name = name;

    // Photo panel - shows the actual image texture
    const photo = new Mesh(
      new PlaneGeometry(
        FRAME_WIDTH - FRAME_BORDER * 2,
        FRAME_HEIGHT - FRAME_BORDER * 2
      ),
      new MeshBasicMaterial({ map: texture })
    );
    photo.name = name;
    photo.position.z = FRAME_DEPTH / 2 + 0.01;

    group.add(body);
    group.add(photo);

    return group;
  };
}
