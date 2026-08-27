export const TILE_WIDTH = 64;
export const TILE_HEIGHT = 32;

export function gridToScreen(gridX: number, gridY: number, gridZ: number = 0) {
  const screenX = (gridX - gridY) * (TILE_WIDTH / 2);
  const screenY = (gridX + gridY) * (TILE_HEIGHT / 2) - gridZ * TILE_HEIGHT;
  return { x: screenX, y: screenY };
}

export function screenToGrid(screenX: number, screenY: number) {
  const gridX = (screenX / (TILE_WIDTH / 2) + screenY / (TILE_HEIGHT / 2)) / 2;
  const gridY = (screenY / (TILE_HEIGHT / 2) - screenX / (TILE_WIDTH / 2)) / 2;
  return { x: gridX, y: gridY };
}

export function getDepthSortKey(gridX: number, gridY: number): number {
  return gridX + gridY;
}
