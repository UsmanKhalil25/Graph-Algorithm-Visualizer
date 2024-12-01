function* nodeIdGenerator() {
  let idCounter = 0;
  while (true) {
    idCounter += 1;
    yield idCounter;
  }
}

export const generateNodeId = nodeIdGenerator();
export const generateEdgeId = nodeIdGenerator();
